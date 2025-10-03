import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubmitButton from "@/components/SubmitButton";
import { signOutAction } from "./actions";

export const metadata = { title: "Dashboard | FlashFlip" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in? Kick to login
  if (!user) redirect("/login");

  // (Optional) load more data tied to user here, e.g. profile, plan, counts, due cards, etc.

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back{user.email ? `, ${user.email}` : ""} 👋
          </h1>
          <form action={signOutAction}>
            <SubmitButton idle="Sign out" pendingText="Signing out..." />
          </form>
        </header>

        {/* Quick stats / nav tiles (replace with real data later) */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Subjects</p>
            <p className="mt-1 text-2xl font-semibold">—</p>
          </div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Folders</p>
            <p className="mt-1 text-2xl font-semibold">—</p>
          </div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Flashcards</p>
            <p className="mt-1 text-2xl font-semibold">—</p>
          </div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Due Today</p>
            <p className="mt-1 text-2xl font-semibold">—</p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/subjects/new"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700"
            >
              New Subject
            </a>
            <a
              href="/play/host"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-white hover:bg-emerald-700"
            >
              Host Game
            </a>
            <a
              href="/play/join"
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-white hover:bg-black"
            >
              Join Game
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
