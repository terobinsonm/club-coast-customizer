// middleware.js
import { NextResponse } from "next/server";

export function middleware() {
  const res = NextResponse.next();
  res.headers.set(
    "Content-Security-Policy",
    "frame-ancestors https://app.repspark.com"
    // For local testing with a parent, you can use:
    // "frame-ancestors https://app.repspark.com http://localhost:3000"
  );
  return res;
}

// Apply to all routes (including /index.html and static assets)
export const config = {
  matcher: "/:path*",
};
