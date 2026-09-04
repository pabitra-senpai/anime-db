import { Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;
  const tone = score >= 75 ? "success" : score >= 50 ? "accent" : "neutral";
  return (
    <Badge tone={tone} className="gap-1">
      <Star className="h-3 w-3 fill-current" />
      {(score / 10).toFixed(1)}
    </Badge>
  );
}
