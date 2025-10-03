import { createClient } from "@/lib/supabase/server";
import NavBarClient from "./NavBarClient";

export const dynamic = "force-dynamic"; // <- ensure server re-renders
export const revalidate = 0; // <- no static caching

export default async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    user?.email ||
    null;

  // key forces the client component to remount when user changes
  return <NavBarClient key={user?.id ?? "guest"} initialUserName={name} />;
}
