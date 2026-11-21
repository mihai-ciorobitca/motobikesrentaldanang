import { NextResponse, type NextRequest } from "next/server";

/**
 * Language routing:
 *  - English is served at the root (/bikes) and internally rewritten to /en/bikes
 *  - Vietnamese lives under /vi (/vi/bikes)
 *  - /en/... is redirected to the root so each page has one English URL
 *  - a visitor who picked Vietnamese (cookie "lang=vi") is sent to the /vi version
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/vi" || pathname.startsWith("/vi/")) return NextResponse.next();

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (request.cookies.get("lang")?.value === "vi") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/vi" : `/vi${pathname}`;
    return NextResponse.redirect(url, 307);
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // skip Next internals, static files and metadata routes
  matcher: ["/((?!_next/|images/|api/|favicon\\.ico|icon\\.png|apple-icon\\.png|robots\\.txt|sitemap\\.xml|.*\\.[a-zA-Z0-9]+$).*)"],
};
