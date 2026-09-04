import Image from "next/image";
import { User } from "lucide-react";
import type { CastMember } from "@/lib/api/types";
import { Badge } from "@/components/ui/Badge";

function PersonAvatar({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-full bg-bg-elevated ring-1 ring-border">
      {src ? (
        <Image src={src} alt={alt} fill sizes="56px" className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <User className="h-6 w-6 text-fg-subtle" />
        </div>
      )}
    </div>
  );
}

export function CastList({ cast, limit = 12 }: { cast: CastMember[]; limit?: number }) {
  if (!cast.length) return null;
  const visible = cast.slice(0, limit);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-fg sm:text-xl">Characters &amp; Voice Actors</h2>
        {cast.length > limit && (
          <Badge tone="neutral">+{cast.length - limit} more</Badge>
        )}
      </div>
      <div className="rail -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
        {visible.map((member) => (
          <div key={member.characterId} className="flex w-40 shrink-0 flex-col gap-2">
            <div className="flex items-center gap-2">
              <PersonAvatar src={member.characterImageUrl} alt={member.characterName} />
              {member.voiceActorImageUrl && (
                <PersonAvatar src={member.voiceActorImageUrl} alt={member.voiceActorName ?? ""} />
              )}
            </div>
            <div>
              <p className="line-clamp-1 text-sm font-medium text-fg">{member.characterName}</p>
              {member.role && (
                <p className="text-xs text-fg-subtle">{member.role.charAt(0)}{member.role.slice(1).toLowerCase()}</p>
              )}
              {member.voiceActorName && (
                <p className="line-clamp-1 text-xs text-fg-muted">{member.voiceActorName}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
