import {
  deleteAllCustomEvents,
  deleteAllPersons,
  deleteAllPrivateDetails,
  deleteAllRelationships,
  getAllCustomEvents,
  getAllPersons,
  getAllPrivateDetails,
  getAllRelationships,
  insertCustomEvents,
  insertPersons,
  insertPrivateDetails,
  insertRelationships,
} from "@/repositories/dataRepository";
import { getIsAdmin, getServerSupabase } from "@/services/authService";
import { Relationship, RelationshipType } from "@/types";

interface PersonExport {
  id: string;
  full_name: string;
  gender: "male" | "female" | "other";
  birth_year: number | null;
  birth_month: number | null;
  birth_day: number | null;
  death_year: number | null;
  death_month: number | null;
  death_day: number | null;
  death_lunar_year: number | null;
  death_lunar_month: number | null;
  death_lunar_day: number | null;
  is_deceased: boolean;
  is_in_law: boolean;
  birth_order: number | null;
  generation: number | null;
  other_names: string | null;
  avatar_url: string | null;
  note: string | null;
  created_at?: string;
  updated_at?: string;
}

interface RelationshipExport {
  id?: string;
  type: RelationshipType;
  person_a: string;
  person_b: string;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface PersonDetailsPrivateExport {
  person_id: string;
  phone_number: string | null;
  occupation: string | null;
  current_residence: string | null;
}

interface CustomEventExport {
  id: string;
  name: string;
  content: string | null;
  event_date: string;
  location: string | null;
  created_by: string | null;
}

interface BackupPayload {
  version: number;
  timestamp: string;
  persons: PersonExport[];
  relationships: RelationshipExport[];
  person_details_private?: PersonDetailsPrivateExport[];
  custom_events?: CustomEventExport[];
}

function sanitizePerson(
  p: PersonExport,
): Omit<PersonExport, "created_at" | "updated_at"> {
  return {
    id: p.id,
    full_name: p.full_name,
    gender: p.gender,
    birth_year: p.birth_year ?? null,
    birth_month: p.birth_month ?? null,
    birth_day: p.birth_day ?? null,
    death_year: p.death_year ?? null,
    death_month: p.death_month ?? null,
    death_day: p.death_day ?? null,
    death_lunar_year: p.death_lunar_year ?? null,
    death_lunar_month: p.death_lunar_month ?? null,
    death_lunar_day: p.death_lunar_day ?? null,
    is_deceased: p.is_deceased ?? false,
    is_in_law: p.is_in_law ?? false,
    birth_order: p.birth_order ?? null,
    generation: p.generation ?? null,
    other_names: p.other_names ?? null,
    avatar_url: p.avatar_url ?? null,
    note: p.note ?? null,
  };
}

function sanitizeRelationship(
  r: RelationshipExport,
): Omit<RelationshipExport, "id" | "created_at" | "updated_at"> {
  return {
    type: r.type,
    person_a: r.person_a,
    person_b: r.person_b,
    note: r.note ?? null,
  };
}

function sanitizeCustomEvent(
  e: CustomEventExport,
): Omit<CustomEventExport, "created_by"> {
  return {
    id: e.id,
    name: e.name,
    content: e.content ?? null,
    event_date: e.event_date,
    location: e.location ?? null,
  };
}

function buildSubtreeExport(
  rootId: string,
  persons: PersonExport[],
  relationships: RelationshipExport[],
  privateDetails: PersonDetailsPrivateExport[],
) {
  const includedPersonIds = new Set<string>([rootId]);

  const findDescendants = (parentId: string) => {
    relationships
      .filter(
        (r) =>
          (r.type === "biological_child" || r.type === "adopted_child") &&
          r.person_a === parentId,
      )
      .forEach((r) => {
        if (!includedPersonIds.has(r.person_b)) {
          includedPersonIds.add(r.person_b);
          findDescendants(r.person_b);
        }
      });
  };

  findDescendants(rootId);

  Array.from(includedPersonIds).forEach((personId) => {
    relationships
      .filter(
        (r) =>
          r.type === "marriage" &&
          (r.person_a === personId || r.person_b === personId),
      )
      .forEach((r) => {
        const spouseId = r.person_a === personId ? r.person_b : r.person_a;
        includedPersonIds.add(spouseId);
      });
  });

  return {
    persons: persons.filter((p) => includedPersonIds.has(p.id)),
    relationships: relationships.filter(
      (r) =>
        includedPersonIds.has(r.person_a) &&
        includedPersonIds.has(r.person_b),
    ),
    privateDetails: privateDetails.filter((d) =>
      includedPersonIds.has(d.person_id),
    ),
  };
}

export async function exportData(
  exportRootId?: string,
): Promise<BackupPayload | { error: string }> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { error: "Từ chối truy cập. Chỉ admin mới có quyền này." };
  }

  const supabase = await getServerSupabase();
  const [allPersons, allRelationships, allPrivateDetails, allCustomEvents] =
    await Promise.all([
      getAllPersons(supabase),
      getAllRelationships(supabase),
      getAllPrivateDetails(supabase),
      getAllCustomEvents(supabase),
    ]);

  let exportPersons = allPersons as PersonExport[];
  let exportRels = allRelationships as RelationshipExport[];
  let exportPrivateDetails = allPrivateDetails as PersonDetailsPrivateExport[];
  const exportCustomEvents = allCustomEvents as CustomEventExport[];

  if (exportRootId && exportPersons.some((p) => p.id === exportRootId)) {
    const subtree = buildSubtreeExport(
      exportRootId,
      exportPersons,
      exportRels,
      exportPrivateDetails,
    );

    exportPersons = subtree.persons;
    exportRels = subtree.relationships;
    exportPrivateDetails = subtree.privateDetails;
  }

  return {
    version: 3,
    timestamp: new Date().toISOString(),
    persons: exportPersons,
    relationships: exportRels,
    person_details_private: exportPrivateDetails,
    custom_events: exportCustomEvents,
  };
}

export async function importData(
  importPayload:
    | BackupPayload
    | {
        persons: PersonExport[];
        relationships: Relationship[];
        person_details_private?: PersonDetailsPrivateExport[];
        custom_events?: CustomEventExport[];
      },
) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { error: "Từ chối truy cập. Chỉ admin mới có quyền này." };
  }

  const supabase = await getServerSupabase();

  if (!importPayload?.persons || !importPayload?.relationships) {
    return { error: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại file JSON." };
  }

  if (importPayload.persons.length === 0) {
    return {
      error: "File backup trống — không có thành viên nào để phục hồi.",
    };
  }

  const CHUNK = 200;
  const persons = importPayload.persons.map(sanitizePerson);

  let response = await deleteAllCustomEvents(supabase);
  if (response.error) {
    return { error: "Lỗi khi xoá custom_events cũ: " + response.error.message };
  }

  response = await deleteAllRelationships(supabase);
  if (response.error) {
    return { error: "Lỗi khi xoá relationships cũ: " + response.error.message };
  }

  response = await deleteAllPrivateDetails(supabase);
  if (response.error) {
    return { error: "Lỗi khi xoá person_details_private cũ: " + response.error.message };
  }

  response = await deleteAllPersons(supabase);
  if (response.error) {
    return { error: "Lỗi khi xoá persons cũ: " + response.error.message };
  }

  for (let i = 0; i < persons.length; i += CHUNK) {
    response = await insertPersons(supabase, persons.slice(i, i + CHUNK));
    if (response.error) {
      return {
        error: `Lỗi khi import persons (chunk ${i / CHUNK + 1}): ${response.error.message}`,
      };
    }
  }

  const relationships = importPayload.relationships
    .filter((r) => r.person_a !== r.person_b)
    .map(sanitizeRelationship);

  for (let i = 0; i < relationships.length; i += CHUNK) {
    response = await insertRelationships(supabase, relationships.slice(i, i + CHUNK));
    if (response.error) {
      return {
        error: `Lỗi khi import relationships (chunk ${i / CHUNK + 1}): ${response.error.message}`,
      };
    }
  }

  const privateDetails = importPayload.person_details_private ?? [];
  let privateDetailsCount = 0;
  if (privateDetails.length > 0) {
    for (let i = 0; i < privateDetails.length; i += CHUNK) {
      response = await insertPrivateDetails(supabase, privateDetails.slice(i, i + CHUNK));
      if (response.error) {
        return {
          error: `Lỗi khi import person_details_private (chunk ${i / CHUNK + 1}): ${response.error.message}`,
        };
      }
    }
    privateDetailsCount = privateDetails.length;
  }

  const customEvents = (importPayload.custom_events ?? []).map(sanitizeCustomEvent);
  let customEventsCount = 0;
  if (customEvents.length > 0) {
    for (let i = 0; i < customEvents.length; i += CHUNK) {
      response = await insertCustomEvents(supabase, customEvents.slice(i, i + CHUNK));
      if (response.error) {
        return {
          error: `Lỗi khi import custom_events (chunk ${i / CHUNK + 1}): ${response.error.message}`,
        };
      }
    }
    customEventsCount = customEvents.length;
  }

  return {
    success: true,
    imported: {
      persons: persons.length,
      relationships: relationships.length,
      person_details_private: privateDetailsCount,
      custom_events: customEventsCount,
    },
  };
}
