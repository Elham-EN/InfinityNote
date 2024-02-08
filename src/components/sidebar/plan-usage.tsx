/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { MAX_FOLDERS_FREE_PLAN } from "@/lib/constants";
import { useAppState } from "@/lib/providers/state-provider";
import { Subscription } from "@/lib/supabase/supabase.types";
import React, { ReactElement, useEffect, useState } from "react";
import CypressDiamondIcon from "../icons/cypressDiamondIcon";
import { Progress } from "../ui/progress";

interface PlanUsageProps {
  foldersLength: number;
  subscription: Subscription;
}

export default function PlanUsage({
  foldersLength,
  subscription,
}: PlanUsageProps): ReactElement {
  const { state, workspaceId } = useAppState();
  const [usagePercentage, setUsagePercentage] = useState(
    (foldersLength / MAX_FOLDERS_FREE_PLAN) * 100
  );

  useEffect(() => {
    const stateFoldersLength = state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    )?.folders.length;
    setUsagePercentage((stateFoldersLength! / MAX_FOLDERS_FREE_PLAN) * 100);
    console.log(usagePercentage);
  }, [state, workspaceId]);

  return (
    <article className="mt-4 ">
      {subscription?.status !== "active" && (
        <div
          className="flex gap-2 text-muted-foreground mb-2 items-center 
            justify-center"
        >
          <div className="h-8 w-8">
            <CypressDiamondIcon />
          </div>
          <div className="flex justify-start w-full items-center gap-2">
            <div>Free Plan</div>
            <small>{usagePercentage.toFixed(0)}% / 100%</small>
          </div>
        </div>
      )}
      {subscription?.status !== "active" && (
        <Progress value={usagePercentage} className="h-2" />
      )}
    </article>
  );
}
