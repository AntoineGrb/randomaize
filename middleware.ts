import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("spotify_access_token");

  // Rediriger si pas authentifié et la route commence par `/playlists` ou `/generate`
  if (
    !accessToken &&
    (req.nextUrl.pathname.startsWith("/playlists") ||
      req.nextUrl.pathname.startsWith("/generate"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
