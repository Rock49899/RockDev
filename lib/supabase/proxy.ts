import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseKey, supabaseUrl } from "./env";

const LOGIN_PATH = "/admin/login";

/** Rafraîchit la session Supabase et renvoie vers la connexion si l'accès est anonyme. */
export async function updateSession(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    // Sans Supabase, l'admin n'a pas de sens : on laisse la page l'expliquer.
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  if (!signedIn && pathname !== LOGIN_PATH) {
    return redirectWithCookies(request, response, LOGIN_PATH);
  }
  if (signedIn && pathname === LOGIN_PATH) {
    return redirectWithCookies(request, response, "/admin");
  }
  return response;
}

function redirectWithCookies(request: NextRequest, from: NextResponse, path: string) {
  const redirect = NextResponse.redirect(new URL(path, request.url));
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
