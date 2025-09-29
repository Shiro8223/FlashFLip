// app/(auth)/signup/page.tsx
import Link from "next/link";
import AuthCard from "../../components/AuthCard";

export const metadata = {
  title: "Sign up | FlashFlip",
};

// Example server action (replace with real logic)
async function signupAction(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  // TODO: validate + create user in DB
  console.log("Sign up request:", { name, email, password, confirm });

  // Optionally redirect
  // redirect("/profile");
}

export default function SignupPage() {
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
          {/* ✅ no onSubmit, use action */}
          <form className="space-y-4" action={signupAction}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-800">
                Name
              </span>
              <input
                name="name"
                type="text"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-blue-200 placeholder:text-gray-400 focus:ring-2"
                placeholder="Guest User"
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

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Create account
            </button>

            <p className="text-center text-xs text-gray-500">
              By signing up you agree to our Terms and Privacy Policy.
            </p>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
