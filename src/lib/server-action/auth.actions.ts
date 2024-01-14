"use server";

/**
 * Configures Supabase Auth to store the user's session in a cookie, rather than
 * localStorage. This makes it available across the client and server of the App Router
 * The session is automatically sent along with any requests to Supabase.
 */

import { z } from "zod";
import { FormSchema } from "../types";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type FormSchemaType = z.infer<typeof FormSchema>;

/**
 * The combination of Server Component and Route Handler can be used to trigger the
 * authentication process from form submissions (Server-side).
 * To call a Server Action in a Client Component, create a new file and add the
 * "use server" directive at the top of it.
 */
export async function actionLoginUser({ email, password }: FormSchemaType) {
  const supabase = createRouteHandlerClient({ cookies });
  // Get auth token as response
  const response = await supabase.auth.signInWithPassword({ email, password });
  return response;
}

export async function actionSignUp({ email, password }: FormSchemaType) {
  const supabase = createRouteHandlerClient({ cookies });
  // Get auth token as response
}
