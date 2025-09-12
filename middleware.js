// middleware.js (MUST be at repo root)
import { NextResponse } from "next/server";

// Add CSP header to every response
export function middleware() {
  return NextResponse.next({
    headers: {
      "Content-Security-Policy": "frame-ancestors https://app.repspark.com"
      // For local parent testing too, you could use:
      // "Content-Security-Policy": "frame-ancestors https://app.repspark.com http://localhost:3000"
    },
  });
}

// Apply to all routes (including /index.html and static assets)
export const config = {
  matcher: "/:path*",
};
