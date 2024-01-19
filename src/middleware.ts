import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

// Middleware allows you to run code before a request is completed.
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Create supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });
  // Refresh session if expired - required for Server Components
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  // if user is requesting this page (define which paths Middleware
  // will run on)
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    // Check if user is authenticated to access this page
    if (!session) {
      // If there is no session, then redirect user to login page
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  // handle cases where a user might click on an expired or invalid email link (
  // for email verification and ensures they are redirected to sign up with an
  // error message.
  const emailLinkError = "Email link is invalid or has expired";
  // It then checks if the error_description query parameter in the URL
  // matches this error and the current page is not /signup.
  if (
    req.nextUrl.searchParams.get("error_description") === emailLinkError &&
    req.nextUrl.pathname !== "/signup"
  ) {
    console.log("Email Link Expired");
    return NextResponse.redirect(
      new URL(
        `/signup?error_description=${req.nextUrl.searchParams.get(
          "error_description"
        )}`,
        req.url
      )
    );
  }
  // If users are trying to access this "/login" or "/signup", when they
  // they are already logged in, then redirect they to the dashboard page
  if (["/login", "/signup"].includes(req.nextUrl.pathname)) {
    if (session) {
      // The req.url is used to resolve the absolute URL for "/dashboard"
      // The application based URL: "http//localhost:3000/dashboard"
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
  return res;
}
