import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Contrôle optimiste : les Server Actions revérifient la session et la base applique la RLS.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
