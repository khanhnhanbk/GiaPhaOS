"use client";

import { Person } from "@/types";
import { useDashboard } from "@/components";
import { PersonSelector } from "@/components";

export default function RootSelector({
  persons,
  currentRootId,
}: {
  persons: Person[];
  currentRootId: string;
}) {
  const { setRootId } = useDashboard();

  return (
    <PersonSelector
      persons={persons}
      selectedId={currentRootId}
      onSelect={(id) => {
        if (id) setRootId(id);
      }}
      placeholder="Chọn người..."
      label="Gốc hiển thị"
      className="w-full sm:w-72"
    />
  );
}
