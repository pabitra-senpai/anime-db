import Image from "next/image";
import { User } from "lucide-react";
import type { StaffMember } from "@/lib/api/types";

export function StaffList({ staff }: { staff: StaffMember[] }) {
  if (!staff.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-fg sm:text-xl">Staff</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {staff.map((member) => (
          <div key={`${member.staffId}-${member.role}`} className="flex items-center gap-3">
            <div className="relative aspect-square w-10 shrink-0 overflow-hidden rounded-full bg-bg-elevated ring-1 ring-border">
              {member.imageUrl ? (
                <Image src={member.imageUrl} alt={member.name} fill sizes="40px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-4 w-4 text-fg-subtle" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-medium text-fg">{member.name}</p>
              {member.role && <p className="line-clamp-1 text-xs text-fg-subtle">{member.role}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
