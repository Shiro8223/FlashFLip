"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { signOutAction } from "./actions"; // ✅ use server action via form

type SubjectRow = { id: string; name: string; slug?: string | null };
type FolderRow = { id: string; name: string; subject_id: string };
type LibraryItemRow = {
  id: string;
  title: string;
  subject?: string | null;
  price?: number | null;
};

export default function DashboardClient({
  userId,
  displayName,
  avatarUrl,
  xp,
  subjects,
  bySubject,
  streak,
  credits,
  featured,
}: {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  xp: number;
  subjects: SubjectRow[];
  bySubject: Record<string, FolderRow[]>;
  streak: { current: number; best: number; last_active: string | null };
  credits: number;
  featured: LibraryItemRow[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<"" | "new" | "host" | "join">("");

  // ---------- XP/Level helpers ----------
  function xpCurve(x: number) {
    // Progressive requirement: L1->2 needs 100, then *1.2 per level
    let level = 1;
    let req = 100;
    let remaining = x;
    while (remaining >= req) {
      remaining -= req;
      level += 1;
      req = Math.round(req * 1.2);
    }
    const progress = remaining / req;
    const toNext = req - remaining;
    return { level, req, progress, toNext, inLevelXp: remaining };
  }

  const prog = xpCurve(xp);

  return (
    <>
      {/* LEVEL / XP HEADER */}
      <div className="mb-4 rounded-2xl bg-white ring-1 ring-slate-200 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar imageUrl={avatarUrl} name={displayName ?? "Player"} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                {displayName ?? "Player"}
              </h2>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                LV {prog.level}
              </span>
            </div>

            {/* XP bar */}
            <div className="mt-2 w-72 max-w-full">
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-indigo-500"
                  style={{ width: `${Math.round(prog.progress * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {prog.inLevelXp} / {prog.req} XP — {prog.toNext} to next level
              </p>
            </div>
          </div>
        </div>

        {/* Server-action sign out */}
        <form action={signOutAction} className="self-start sm:self-auto">
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-black"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* STATS ROW (pastel) */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PastelCard color="orange">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            Streak
          </p>
          <p className="mt-1 text-3xl font-black text-orange-900 flex items-center gap-2">
            {streak.current} <span>🔥</span>
          </p>
          <div className="mt-2 grid grid-cols-2 text-sm text-orange-800/80">
            <span>
              Best: <b className="text-orange-900">{streak.best}</b>
            </span>
            <span>
              Last:{" "}
              <b className="text-orange-900">
                {streak.last_active
                  ? new Date(streak.last_active).toLocaleDateString()
                  : "—"}
              </b>
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-orange-200 overflow-hidden">
            <div className="h-full w-[45%] bg-orange-500/80" />
          </div>
        </PastelCard>

        <StatPastel
          label="Subjects"
          value={subjects.length}
          color="sky"
          icon="📚"
        />
        <StatPastel
          label="Folders"
          value={Object.values(bySubject).flat().length}
          color="amber"
          icon="🗂️"
        />
        <StatPastel label="Credits" value={credits} color="indigo" icon="💎" />
      </section>

      {/* QUICK ACTIONS as tabs */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">Quick Actions</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ActionTab
            active={selected === "new"}
            color="sky"
            title="New Subject"
            badge="Create"
            icon="➕"
            onClick={() => setSelected(selected === "new" ? "" : "new")}
          />
          <ActionTab
            active={selected === "host"}
            color="emerald"
            title="Host Game"
            badge="Live"
            icon="🚀"
            onClick={() => setSelected(selected === "host" ? "" : "host")}
          />
          <ActionTab
            active={selected === "join"}
            color="violet"
            title="Join Game"
            badge="Join"
            icon="🎯"
            onClick={() => setSelected(selected === "join" ? "" : "join")}
          />
        </div>

        {/* EXPANDING PANEL */}
        {selected && (
          <div className="mt-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            {selected === "new" && (
              <NewSubjectForm
                userId={userId}
                onDone={() => {
                  setSelected("");
                  router.refresh();
                }}
              />
            )}
            {selected === "host" && (
              <HostGameForm
                onStart={(code) =>
                  router.push(`/play/host?code=${encodeURIComponent(code)}`)
                }
              />
            )}
            {selected === "join" && (
              <JoinGameForm
                onJoin={(code) =>
                  router.push(`/play/join?code=${encodeURIComponent(code)}`)
                }
              />
            )}
          </div>
        )}
      </section>

      {/* LIBRARY (pastel) */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Library</h2>
          <Link
            href="/library"
            className="text-sm text-indigo-700 hover:underline"
          >
            Browse all →
          </Link>
        </div>

        <PastelCard color="indigo" className="p-0">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-indigo-200/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💎</span>
              <div>
                <p className="text-sm text-indigo-800/80">Your Credits</p>
                <p className="text-xl font-bold text-indigo-900">{credits}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <ShopButton href="/library/redeem" label="Redeem Code" />
              <ShopButton
                href="/library/buy-credits"
                label="Buy Credits"
                variant="primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.length === 0 ? (
              <EmptyTile
                title="No featured items yet"
                subtitle="Check back soon for DS&A, Stats, and more."
              />
            ) : (
              featured.map((item) => (
                <Link
                  key={item.id}
                  href={`/library/items/${item.id}`}
                  className="group rounded-xl border border-indigo-200/60 bg-white p-4 hover:border-indigo-400 hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">
                      {item.title}
                    </h3>
                    <Badge color="indigo">
                      {item.price != null
                        ? `£${item.price.toFixed(2)}`
                        : "£2.50"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.subject ?? "General"}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Click to preview & unlock
                  </p>
                </Link>
              ))
            )}
          </div>
        </PastelCard>
      </section>

      {/* SUBJECTS → FOLDERS (widgets, clickable) */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">Your Subjects</h2>

        {subjects.length === 0 ? (
          <PastelCard color="gray">
            <p className="text-slate-700">
              You don’t have any subjects yet.{" "}
              <Link
                href="/subjects/new"
                className="text-sky-700 hover:underline"
              >
                Create your first subject
              </Link>
              .
            </p>
          </PastelCard>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {subjects.map((s) => {
              const sFolders = bySubject[s.id] ?? [];
              return (
                <PastelCard key={s.id} color="sky">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      {s.name}
                    </h3>
                    <Link
                      href={
                        s.slug ? `/subjects/${s.slug}` : `/subjects/${s.id}`
                      }
                      className="text-sm text-sky-700 hover:underline"
                    >
                      View subject →
                    </Link>
                  </div>

                  {sFolders.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      No folders yet.{" "}
                      <Link
                        href={
                          s.slug
                            ? `/subjects/${s.slug}/folders/new`
                            : `/subjects/${s.id}/folders/new`
                        }
                        className="text-sky-700 hover:underline"
                      >
                        Add one
                      </Link>
                      .
                    </p>
                  ) : (
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {sFolders.map((f) => (
                        <li key={f.id}>
                          <Link
                            href={
                              s.slug
                                ? `/subjects/${s.slug}/folders/${f.id}`
                                : `/subjects/${s.id}/folders/${f.id}`
                            }
                            className="block rounded-xl border border-sky-200 bg-white p-4 hover:border-sky-400 hover:shadow-sm transition"
                          >
                            <p className="font-semibold text-slate-900">
                              {f.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Open folder
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </PastelCard>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

/* =============== Forms for the expanding panel =============== */

function NewSubjectForm({
  userId,
  onDone,
}: {
  userId: string;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function createSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase
      .from("subjects")
      .insert({ name, user_id: userId });
    setSaving(false);
    if (!error) onDone();
    // (optional) surface error
  }

  return (
    <div>
      <TabHeader icon="➕" title="New Subject" color="sky" />
      <form onSubmit={createSubject} className="mt-4 grid gap-3 sm:max-w-md">
        <label className="text-sm font-medium text-slate-800">
          Subject name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Data Structures"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-200 focus:ring-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create subject"}
        </button>
      </form>
    </div>
  );
}

function HostGameForm({ onStart }: { onStart: (code: string) => void }) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState("classic");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    onStart(code);
  }

  return (
    <div>
      <TabHeader icon="🚀" title="Host Game" color="emerald" />
      <form onSubmit={submit} className="mt-4 grid gap-3 sm:max-w-md">
        <label className="text-sm font-medium text-slate-800">
          Session name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Friday Review"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-emerald-200 focus:ring-2"
        />
        <label className="text-sm font-medium text-slate-800">Gamemode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-emerald-200 focus:ring-2"
        >
          <option value="classic">Classic</option>
          <option value="speed">Speed</option>
          <option value="streak">Streak</option>
        </select>
        <button className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
          Start session
        </button>
      </form>
    </div>
  );
}

function JoinGameForm({ onJoin }: { onJoin: (code: string) => void }) {
  const [code, setCode] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    onJoin(code.trim().toUpperCase());
  }

  return (
    <div>
      <TabHeader icon="🎯" title="Join Game" color="violet" />
      <form onSubmit={submit} className="mt-4 grid gap-3 sm:max-w-sm">
        <label className="text-sm font-medium text-slate-800">
          Session Code
        </label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ABC123"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 tracking-widest uppercase outline-none ring-violet-200 focus:ring-2"
        />
        <button className="cursor-pointer rounded-xl bg-violet-600 px-4 py-2 text-white hover:bg-violet-700">
          Join
        </button>
      </form>
    </div>
  );
}

/* ===================== UI helpers ===================== */

function TabHeader({
  icon,
  title,
  color,
}: {
  icon: string;
  title: string;
  color: "sky" | "emerald" | "violet";
}) {
  const map: Record<string, string> = {
    sky: "text-sky-700",
    emerald: "text-emerald-700",
    violet: "text-violet-700",
  };
  return (
    <div
      className={`flex items-center gap-2 text-sm font-semibold ${map[color]}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{title}</span>
    </div>
  );
}

function PastelCard({
  children,
  color,
  className = "p-5",
}: {
  children: React.ReactNode;
  color: "orange" | "sky" | "amber" | "indigo" | "gray";
  className?: string;
}) {
  const bg: Record<string, string> = {
    orange: "bg-orange-50 ring-orange-200",
    sky: "bg-sky-50 ring-sky-200",
    amber: "bg-amber-50 ring-amber-200",
    indigo: "bg-indigo-50 ring-indigo-200",
    gray: "bg-slate-50 ring-slate-200",
  };
  return (
    <div className={`rounded-2xl ${bg[color]} ${className} ring-1 shadow-sm`}>
      {children}
    </div>
  );
}

function StatPastel({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: "sky" | "amber" | "indigo";
  icon?: string;
}) {
  const text: Record<string, string> = {
    sky: "text-sky-700",
    amber: "text-amber-700",
    indigo: "text-indigo-700",
  };
  return (
    <PastelCard color={color as any}>
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-xs uppercase tracking-wide font-semibold ${text[color]}`}
          >
            {label}
          </p>
          <p className="mt-1 text-3xl font-black text-slate-900">{value}</p>
        </div>
        <div className="text-2xl">{icon ?? "✨"}</div>
      </div>
    </PastelCard>
  );
}

function ActionTab({
  active,
  color,
  title,
  badge,
  icon,
  onClick,
}: {
  active: boolean;
  color: "sky" | "emerald" | "violet";
  title: string;
  badge: string;
  icon: string;
  onClick: () => void;
}) {
  const map: Record<string, string> = {
    sky: "from-sky-400 to-sky-600",
    emerald: "from-emerald-400 to-emerald-600",
    violet: "from-violet-400 to-fuchsia-600",
  };
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-2xl bg-white p-5 ring-1 ring-slate-200 text-left transition shadow-sm hover:shadow-md ${
        active ? "outline outline-2 outline-offset-2 outline-slate-300" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white bg-gradient-to-r ${map[color]}`}
        >
          {badge}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
        <span className="text-lg">{icon}</span>
        <span className="opacity-80">Open</span>
      </div>
    </button>
  );
}

function Badge({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: "gray" | "indigo";
}) {
  const map: Record<string, string> = {
    gray: "bg-slate-100 text-slate-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[color]}`}
    >
      {children}
    </span>
  );
}

function ShopButton({
  href,
  label,
  variant = "ghost",
}: {
  href: string;
  label: string;
  variant?: "ghost" | "primary";
}) {
  const base = "rounded-xl px-3 py-2 text-sm font-medium";
  const v =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : "bg-white text-slate-900 ring-1 ring-slate-200 hover:ring-indigo-300";
  return (
    <Link href={href} className={`${base} ${v}`}>
      {label}
    </Link>
  );
}

function EmptyTile({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-600">
      <p className="font-medium text-slate-800">{title}</p>
      {subtitle && <p className="mt-1">{subtitle}</p>}
    </div>
  );
}

function Avatar({ imageUrl, name }: { imageUrl: string | null; name: string }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
      />
    );
  }
  const initial = (name?.[0] || "U").toUpperCase();
  return (
    <div className="h-12 w-12 rounded-full bg-sky-100 text-sky-700 ring-1 ring-sky-200 flex items-center justify-center font-bold">
      {initial}
    </div>
  );
}
