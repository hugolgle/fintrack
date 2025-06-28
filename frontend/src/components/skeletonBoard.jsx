import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-4 w-60 self-end md:self-auto" />
      </div>

      {/* Stat boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Charts and side panel */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col gap-4 w-full lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-52 w-full" />
            <Skeleton className="h-52 w-full" />
          </div>
          <Skeleton className="h-60 w-full" />
        </div>
        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <Skeleton className="h-52 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-52 w-full" />
            <Skeleton className="h-52 w-full" />
          </div>
          <Skeleton className="h-52 w-full" />
        </div>
      </div>
    </div>
  );
}
