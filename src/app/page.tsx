import Link from "next/link";

export const metadata = {
  title: "Welcome | FlashFlip",
  description:
    "Create flashcards, organize by folders and subjects, and study with game-inspired modes.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Splash / Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-10 ">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200 relative">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                Academic, organized, game-inspired
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
                FlashFlip
              </h1>
              <p className="mt-2 text-lg text-gray-700">
                A flashcard-inspired learning tool. Create cards, assign them to{" "}
                <strong>folders</strong> and <strong>subjects</strong>, then
                reinforce recall with quick game modes.
              </p>

              {/* Entry buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/content"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                >
                  Explore as Guest
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-gray-900 hover:bg-gray-50"
                >
                  Sign in to Save
                </Link>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Guests can explore game modes. Saving cards requires an account.
              </p>
            </div>

            {/* Visual hierarchy preview */}
            <div className="relative">
              <div className="rounded-2xl border border-gray-200 bg-blue-50/50 p-4">
                <p className="text-sm font-semibold text-gray-700">
                  How things organize
                </p>
                <div className="mt-3 grid gap-3 text-sm">
                  <div className="rounded-xl bg-pink-50 p-3 shadow-sm ring-1 ring-pink-100">
                    <div className="font-medium text-gray-800">
                      📁 Folder: Term 1
                    </div>
                    <div className="mt-1 text-gray-500">
                      Group your study sets
                    </div>
                  </div>
                  <div className="ml-4 rounded-xl bg-green-50 p-3 shadow-sm ring-1 ring-green-100">
                    <div className="font-medium text-gray-800">
                      📚 Subject: Biology
                    </div>
                    <div className="mt-1 text-gray-500">
                      Attach sets to subjects
                    </div>
                  </div>
                  <div className="ml-8 rounded-xl bg-yellow-50 p-3 shadow-sm ring-1 ring-yellow-100">
                    <div className="font-medium text-gray-800">
                      🗂️ Set: Cell Basics
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <CardPreview
                        label="Question"
                        value="Organelle for energy?"
                      />
                      <CardPreview label="Answer" value="Mitochondrion" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute bottom-0 right-0 w-56 translate-y-12 translate-x-6 rotate-2 rounded-xl border border-gray-200 bg-white p-4 shadow">
                <div className="text-xs uppercase text-gray-500">Flashcard</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                  Q → “Define photosynthesis”
                </div>
                <div className="mt-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-700">
                  A → “Plants convert light into chemical energy…”
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Study modes */}
      <section className="mx-auto mt-16 max-w-6xl px-6">
        <h2 className="text-xl font-semibold text-gray-900">Study modes</h2>
        <p className="mt-1 text-sm text-gray-600">
          Core recall first, then quick games to lock it in.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <ModeCard
            title="Live Quiz (Kahoot-style)"
            badge="Real-time"
            desc="Host or join timed rounds with streaks and leaderboards."
            color="bg-purple-50 ring-purple-100"
            items={["Buzz-in questions", "Power-ups", "Classroom-friendly"]}
          />
          <ModeCard
            title="Q↔A Matching"
            badge="Focus"
            desc="Match questions to their answers, perfect for definitions."
            color="bg-pink-50 ring-pink-100"
            items={["Shuffle pairs", "Time attack", "Hints on miss"]}
          />
          <ModeCard
            title="Spaced Practice"
            badge="Retention"
            desc="Adaptive scheduling that prioritizes what you’re close to forgetting."
            color="bg-green-50 ring-green-100"
            items={["Daily reviews", "Confidence ratings", "Progress charts"]}
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto mt-20 max-w-4xl px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Our Mission & Vision
        </h2>
        <p className="mt-4 text-lg text-gray-700 leading-relaxed">
          At <strong>FlashFlip</strong>, our mission is simple:{" "}
          <span className="italic">
            make learning engaging, accessible, and memorable.
          </span>{" "}
          We believe that knowledge sticks best when it’s{" "}
          <span className="font-semibold">active, playful, and personal</span>.
        </p>
        <p className="mt-4 text-lg text-gray-700 leading-relaxed">
          Whether you’re cramming for exams, exploring new subjects, or leading
          a classroom, our goal is to provide tools that blend{" "}
          <strong>academic rigor</strong> with{" "}
          <strong>game-inspired fun</strong>.
        </p>
        <p className="mt-4 text-lg text-gray-700 leading-relaxed">
          Together, we can transform the way people learn, one flashcard at a
          time.
        </p>
      </section>

      {/* White space spacer */}
      <div className="h-40 bg-grey-50" />
    </div>
  );
}

/* ---------- Small components ---------- */
function CardPreview({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="text-[10px] uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-1 font-medium text-gray-800">{value}</div>
    </div>
  );
}

function ModeCard({
  title,
  desc,
  items,
  badge,
  color,
}: {
  title: string;
  desc: string;
  items: string[];
  badge?: string;
  color: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border ${color} p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {badge ? (
          <span className="rounded-full bg-white/50 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
      <ul className="mt-4 space-y-1 text-sm text-gray-700">
        {items.map((i, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400/60" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
