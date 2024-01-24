//* Server Component by default
import db from "@/lib/supabase/db";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import React, { ReactElement } from "react";
import DashboardSetup from "@/components/dashboard-setup/dashboard-setup";
import { getUserSubscriptionStatus } from "@/lib/supabase/queries";

/**
 * When user access Dashboard page from login/signup page, to check
 * if user already have a workspace. If they do have a workspace
 * route them to the first workspace that they have or if they
 * dont have workspace, then allow them to create workspace here
 */
async function DashboardPage(): Promise<ReactElement | undefined> {
  // Initialize supabase client
  const supabase = createServerComponentClient({ cookies });
  // Fetch user data to determine if the user is authenticated
  const { data } = await supabase.auth.getUser();

  // Check if user's data exist
  if (!data.user) return;
  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, data.user.id),
  });

  // Get user's subscription status
  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(data.user.id);
  if (subscriptionError) return;

  // If they don't have one, they allow them to setup a workspace
  if (!workspace)
    return (
      <div
        className="bg-bacground h-screen w-screen flex justify-center 
          items-center"
      >
        <DashboardSetup user={data.user} subscription={subscription} />
      </div>
    );
  // Redirect user to a new page, with current workspace they have already
  // built one
  redirect(`/dashboard/${workspace.id}`);
}

export default DashboardPage;
