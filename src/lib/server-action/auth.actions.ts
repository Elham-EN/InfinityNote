"use server";

/**
 * Configures Supabase Auth to store the user's session in a cookie, rather than
 * localStorage. This makes it available across the client and server of the App Router
 * The session is automatically sent along with any requests to Supabase.
 */
import * as dotenv from "dotenv";
import { z } from "zod";
import { FormSchema } from "../types";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
dotenv.config({ path: ".env" });

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

/**
 * Supabase Code Exchange refers to the process of exchanging an authorization
 * code for a session or access token
 */
export async function actionSignUp({ email, password }: FormSchemaType) {
  const supabase = createRouteHandlerClient({ cookies });
  // it fetches all data from rows in the profile table where the email
  // matches a specific value.
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email);
  if (data?.length) return { error: { message: "User already exist", data } };
  const response = await supabase.auth.signUp({
    email,
    password,
    // Specifies a redirect URL for email confirmations, directing users to a
    // specified callback URL upon successful email verification
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
    },
  });

  return response;
}
