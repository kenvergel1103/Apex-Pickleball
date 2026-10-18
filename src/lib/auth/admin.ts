import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getAdminAccess() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { status: "unauthenticated" } as const;
  }

  const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!user.email || !allowedEmails.includes(user.email.toLowerCase())) {
    return { status: "forbidden" } as const;
  }

  return { status: "authorized", email: user.email } as const;
}