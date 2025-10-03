import Link from "next/link";
import AuthCard from "../../../components/AuthCard";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubmitButton from "@/components/SubmitButton";

// --- Server Action ---
async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/dashboard");
}

export const metadata = { title: "Log in | [WittyName]" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error;

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-6 pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-50 via-pink-50 to-green-50 p-6 ring-1 ring-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Log in to continue
          </h2>
          <p className="text-sm text-gray-600">
            Save your flashcards, organize by subject and folder, and access
            game modes.
          </p>
        </div>

        <AuthCard
          title="Log in"
          subtitle="Use your email and password to access your account."
          footer={
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">New here?</span>
              <Link href="/signup" className="text-blue-600 hover:underline">
                Create an account
              </Link>
            </div>
          }
        >
          {error && <p className="text-sm text-red-600">{error}</p>}

          <form className="space-y-4" action={loginAction}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-800">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-blue-200 placeholder:text-gray-400 focus:ring-2"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-800">
                Password
              </span>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-blue-200 placeholder:text-gray-400 focus:ring-2"
                placeholder="••••••••"
              />
            </label>

            <SubmitButton />
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
