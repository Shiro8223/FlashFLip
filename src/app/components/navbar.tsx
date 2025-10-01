"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Subject = {
  name: string;
  slug: string;
  folders: { name: string; id: string }[];
};

const subjects: Subject[] = [
  {
    name: "Biology",
    slug: "biology",
    folders: [
      { name: "Cell Basics", id: "cell-basics" },
      { name: "Genetics", id: "genetics" },
    ],
  },
  {
    name: "Chemistry",
    slug: "chemistry",
    folders: [
      { name: "Atomic Structure", id: "atomic" },
      { name: "Bonding", id: "bonding" },
    ],
  },
  {
    name: "Maths",
    slug: "maths",
    folders: [
      { name: "Algebra I", id: "algebra-1" },
      { name: "Trigonometry", id: "trig" },
    ],
  },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  // "revision" | "game" | ""  -> only one can be open
  const [openSection, setOpenSection] = useState<"" | "revision" | "game">("");
  const [openSubject, setOpenSubject] = useState<string>("");

  // Close on Escape
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  // Close subject folders if "My Revision" collapses
  useEffect(() => {
    if (openSection !== "revision") setOpenSubject("");
  }, [openSection]);

  const navLink = "block rounded px-3 py-2 text-white/90 hover:bg-white/10";
  const rowChevronBtn =
    "p-2 rounded focus:outline-none focus:ring-2 focus:ring-white/30 hover:bg-white/10";

  const toggleSection = (key: "revision" | "game") =>
    setOpenSection((cur) => (cur === key ? "" : key));

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white h-16 flex items-center px-4">
        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
        <div className="ml-3 text-lg font-semibold">
          <Link href="/">FlashFlip</Link>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={[
          "fixed top-0 left-0 z-50 h-full w-80 bg-black text-white shadow-lg",
          "transform transition-transform duration-200 will-change-transform",
          open ? "translate-x-0" : "translate-x-[-120%]",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
          <span className="font-semibold">Menu</span>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <span className="block w-5 h-0.5 bg-white rotate-45 translate-y-0.5" />
            <span className="block w-5 h-0.5 bg-white -rotate-45 -translate-y-0.5" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center px-4 py-6 text-center">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-10 h-10"
              fill="currentColor"
            >
              <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6Zm0 2c-4.418 0-8 2.91-8 6.5 0 .828.895 1.5 2 1.5h12c1.105 0 2-.672 2-1.5 0-3.59-3.582-6.5-8-6.5Z" />
            </svg>
          </div>
          <div className="font-semibold text-lg">Guest</div>
          <Link
            href="/login"
            className="text-sm text-blue-400 hover:underline mt-1"
            onClick={() => setOpen(false)}
          >
            Log in
          </Link>
        </div>

        <div className="h-px bg-white/10 mx-4 mb-2" />

        {/* Content */}
        <nav className="px-2 pb-4 overflow-y-auto h-[calc(100%-8rem)]">
          {/* My Revision */}
          <div className="mt-3 flex items-center justify-between">
            <Link
              href="/revision"
              className={`${navLink} font-semibold`}
              onClick={() => setOpen(false)}
            >
              My Revision
            </Link>
            <button
              aria-label="Toggle subjects"
              aria-expanded={openSection === "revision"}
              onClick={() => toggleSection("revision")}
              className={rowChevronBtn}
            >
              <Chevron open={openSection === "revision"} />
            </button>
          </div>

          {/* Subjects (only when "revision" open) */}
          {openSection === "revision" && (
            <div className="mt-1 space-y-1">
              {subjects.map((s) => {
                const isOpen = openSubject === s.slug;
                return (
                  <div key={s.slug}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/subjects/${s.slug}`}
                        className={`${navLink} ml-4`}
                        onClick={() => setOpen(false)}
                      >
                        {s.name}
                      </Link>
                      <button
                        aria-label={`Toggle folders for ${s.name}`}
                        aria-expanded={isOpen}
                        onClick={() => setOpenSubject(isOpen ? "" : s.slug)}
                        className={rowChevronBtn}
                      >
                        <Chevron open={isOpen} />
                      </button>
                    </div>

                    {isOpen && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {s.folders.map((f) => (
                          <li key={f.id}>
                            <Link
                              href={`/subjects/${s.slug}/folders/${f.id}`}
                              className="block rounded px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                              onClick={() => setOpen(false)}
                            >
                              {f.name}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href={`/subjects/${s.slug}/folders/new`}
                            className="block rounded px-3 py-2 text-sm text-blue-300 hover:bg-white/10"
                            onClick={() => setOpen(false)}
                          >
                            + New folder
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Online Game */}
          <div className="mt-3 flex items-center justify-between">
            <Link
              href="/game"
              className={`${navLink} font-semibold`}
              onClick={() => setOpen(false)}
            >
              Online Game
            </Link>
            <button
              aria-label="Toggle online game options"
              aria-expanded={openSection === "game"}
              onClick={() => toggleSection("game")}
              className={rowChevronBtn}
            >
              <Chevron open={openSection === "game"} />
            </button>
          </div>

          {/* Host / Join (only when "game" open) */}
          {openSection === "game" && (
            <div className="mt-1 ml-4 space-y-1">
              <Link
                href="/game/host"
                className="block rounded px-3 py-2 text-white/90 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Host game
              </Link>
              <Link
                href="/game/join"
                className="block rounded px-3 py-2 text-white/90 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Join game
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

/* Chevron */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 5l6 5-6 5V5z" />
    </svg>
  );
}
