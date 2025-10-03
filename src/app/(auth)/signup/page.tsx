import Link from "next/link";
import AuthCard from "../../../components/AuthCard";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubmitButton from "@/components/SubmitButton";

export const metadata = { title: "Sign up | FlashFlip" };

// --- Server Action ---
async function signupAction(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!email || !password) {
    redirect(
      `/signup?error=${encodeURIComponent("Email and password required")}`
    );
  }
  if (password !== confirm) {
    redirect(`/signup?error=${encodeURIComponent("Passwords do not match")}`);
  }
  if (password.length < 8) {
    redirect(
      `/signup?error=${encodeURIComponent(
        "Password must be at least 8 characters"
      )}`
    );
  }

  const supabase = await createClient();

  // You can attach metadata to the auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      // If you want to send a magic confirm link to a specific URL:
      // emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // If email confirmations are ON, no session yet → tell user to check email.
  // If confirmations are OFF, Supabase returns a session and cookie is set.
  if (!data.session) {
    redirect(
      `/login?info=${encodeURIComponent(
        "Account created. Check your email to confirm."
      )}`
    );
  }

  // Signed in immediately
  redirect("/dashboard");
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: { error?: string; info?: string };
}) {
  const error = searchParams?.error;
  const info = searchParams?.info;

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-6 pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-green-50 via-yellow-50 to-blue-50 p-6 ring-1 ring-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create your account
          </h2>
          <p className="text-sm text-gray-600">
            Build sets quickly, organize by folders and subjects, and play study
            games.
          </p>
        </div>

        <AuthCard
          title="Sign up"
          subtitle="Start your study journey in minutes."
          footer={
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Already have an account?</span>
              <Link href="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </div>
          }
        >
          {info && <p className="text-sm text-green-700">{info}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <form className="space-y-4" action={signupAction}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-800">
                Username
              </span>
              <input
                name="name"
                type="text"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-blue-200 placeholder:text-gray-400 focus:ring-2"
                placeholder="Your display name"
              />
            </label>

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
                minLength={8}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-blue-200 placeholder:text-gray-400 focus:ring-2"
                placeholder="At least 8 characters"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-800">
                Confirm password
              </span>
              <input
                name="confirm"
                type="password"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-blue-200 placeholder:text-gray-400 focus:ring-2"
                placeholder="Repeat password"
              />
            </label>

            <SubmitButton idle="Create account" pendingText="Creating..." />
            <p className="text-center text-xs text-gray-500">
              By signing up you agree to our Terms and Privacy Policy.
            </p>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
