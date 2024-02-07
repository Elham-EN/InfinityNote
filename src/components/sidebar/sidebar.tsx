import React, { ReactElement } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from "@/lib/supabase/queries";
import WorkspaceDropdown from "./workspace-dropdown";

interface SidebarProps {
  params: { workspaceid: string };
  className?: string;
}

// Server Component
export default async function Sidebar({
  params,
  className,
}: SidebarProps): Promise<ReactElement | undefined> {
  const supabase = createServerComponentClient({ cookies });
  // Get the user information
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  // Get Subscription status
  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);
  // Get List of folders
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceid
  );
  console.log("WorkspaceFolderData: ", subscriptionError, foldersError);
  // If there are errors
  if (subscriptionError || foldersError) redirect("/dashboard");
  // This code executes three asynchronous functions. The results from these
  // functions are destructured into three variables: Each variable will
  // contain the result of its corresponding function once all promises resolve.
  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);
  // Get all the different workspaces private, collaborating and shared
  return (
    <aside
      className={twMerge(
        "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 !justify-between",
        className
      )}
    >
      {/* The defaultValue prop in the <WorkspaceDropdown> component is designed to 
          determine the initially selected workspace. It does this by finding a 
          workspace from the combined arrays of privateWorkspaces, 
          collaboratingWorkspaces, and sharedWorkspaces that matches the workspaceid 
          from params. The result is a workspace object that has an ID equal to 
          params.workspaceid, and this object is used as the initial value for the 
          dropdown. This setup ensures that when the dropdown is first rendered, it 
          displays the workspace corresponding to the given workspaceid */}
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].find((workspace) => workspace.id === params.workspaceid)}
        />
      </div>
    </aside>
  );
}
