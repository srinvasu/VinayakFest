// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const basicAuth = request.headers.get("authorization");
  const url = request.nextUrl;

  // Check if Authorization header is present
  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    // Check credentials
    if (user === "admin" && pwd === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next();
    }
  }

  // If not authenticated, ask for login
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

// ✅ Add this at the bottom to specify which routes to protect
// ✅ Protect index page ("/") and others if needed
export const config = {
    matcher: ['/', '/admin/:path*'],
  }
