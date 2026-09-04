import type { HTMLAttributes } from "react";
import clsx from "clsx";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-bg-elevated", className)}
      {...props}
    />
  );
}

export function AnimeCardSkeleton() {
  return (
    <div className="w-[160px] shrink-0 sm:w-[180px]">
      <Skeleton className="aspect-[2/3] w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-1 h-3 w-2/5" />
    </div>
  );
}
