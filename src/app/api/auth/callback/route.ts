import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

/**
 * Managing sign-in with Code Exchange
 * The Next.js Auth Helpers are configured to use the server-side
 * auth flow to sign users into your application. This requires you
 * to setup a Code Exchange route, to exchange an auth code for the
 * user's session, which is set as a cookie for future requests made
 * to Supabase.
 */
export async function GET(req: NextRequest, res: NextResponse) {
  // To parse the URL of the incoming HTTP request: Creates a new
  // URL object from the URL of the response object res. If res.url
  // is "http://localhost:3000/api/data?user=123", then requestUrl
  // will be a URL object where you can access:
  const requestUrl = new URL(req.url);
  // requestUrl.searchParams.get('user') -> "123"
  const code = requestUrl.searchParams.get("code");
  if (code) {
    // configures Supabase Auth to store the user's session in a
    // cookie, rather than localStorage
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }
  // The redirect would go to "http://localhost:3000/dashboard".
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
