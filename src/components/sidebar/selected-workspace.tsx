/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { workspace } from "@/lib/supabase/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { ReactElement, useEffect, useState } from "react";

interface SelectedWorkspaceProps {
  workspace: workspace;
  onClick?: (option: workspace) => void;
}

function SelectedWorkspace({ workspace, onClick }: SelectedWorkspaceProps): ReactElement {
  const supabase = createClientComponentClient();
  const [workspaceLogo, setWorkspaceLogo] = useState("/infinity.png");

  useEffect(() => {
    if (workspace.logo) {
      const path = supabase.storage.from("workspace-logos").getPublicUrl(workspace.logo)
        ?.data.publicUrl;
      setWorkspaceLogo(path);
    }
  }, [workspace]);

  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if (onClick) onClick(workspace);
      }}
      className="flex rounded-md hover:bg-muted transition-all flex-row p-2 gap-4 
        justify-center items-center my-2"
    >
      <Image
        src={workspaceLogo}
        alt="workspace logo"
        width={46}
        height={26}
        className="rounded-full object-cover"
      />
      <div className="flex flex-col">
        <p
          className="text-lg w-[170px] overflow-hidden overflow-ellipsis 
        whitespace-nowrap"
        >
          {workspace.title}
        </p>
      </div>
    </Link>
  );
}

export default SelectedWorkspace;
