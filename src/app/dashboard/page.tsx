import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubmitButton from "@/components/SubmitButton";
import { signOutAction } from "./actions";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "Dashboard | FlashFlip" };

type SubjectRow = { id: string; name: string; slug?: string | null };
type FolderRow = { id: string; name: string; subject_id: string };
type LibraryItemRow = {
  id: string;
  title: string;
  subject?: string | null;
  price?: number | null;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: subjectsRaw },
    { data: foldersRaw },
    { data: streakRaw },
    walletRes,
    libFeaturedRes,
    // 👇 new (optional, both are safe fallbacks)
    profileRes,
    progressRes,
  ] = await Promise.all([
    supabase.from("subjects").select("id,name,slug").eq("user_id", user.id),
    supabase
      .from("folders")
      .select("id,name,subject_id")
      .eq("user_id", user.id),
    supabase
      .from("streaks")
      .select("current,best,last_active")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("wallets")
      .select("credits")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("library_folders").select("id,title,subject,price").limit(4),

    // OPTIONAL Tables (use whichever you have)
    supabase
      .from("profiles")
      .select("username,avatar_url,xp")
      .eq("id", user.id)
      .maybeSingle(),
    supabase.from("progress").select("xp").eq("user_id", user.id).maybeSingle(),
  ]);

  const displayName =
    profileRes?.data?.username ||
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email;

  const avatarUrl = profileRes?.data?.avatar_url ?? null;
  const xp = profileRes?.data?.xp ?? progressRes?.data?.xp ?? 0;
  const subjects = (subjectsRaw ?? []) as SubjectRow[];
  const folders = (foldersRaw ?? []) as FolderRow[];

  // group folders by subject id
  const bySubject: Record<string, FolderRow[]> = {};
  for (const f of folders) (bySubject[f.subject_id] ??= []).push(f);

  const streak = {
    current: streakRaw?.current ?? 0,
    best: streakRaw?.best ?? 0,
    last_active: streakRaw?.last_active ?? null,
  };
  const credits = walletRes?.data?.credits ?? 0;
  const featured = (libFeaturedRes?.data ?? []) as LibraryItemRow[];

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* keep your header or remove; we'll also show sign-out in the level header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back{user.email ? `, ${user.email}` : ""}{" "}
            <span className="ml-1">🎮</span>
          </h1>
          {/* you can keep this or rely on the header's Sign out */}
        </header>

        <DashboardClient
          userId={user.id}
          displayName={displayName}
          avatarUrl={avatarUrl}
          xp={xp}
          subjects={subjects}
          bySubject={bySubject}
          streak={streak}
          credits={credits}
          featured={featured}
        />
      </div>
    </div>
  );
}
