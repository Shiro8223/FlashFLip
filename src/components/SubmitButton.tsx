"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  idle = "Log in",
  pendingText = "Logging in...",
  className = "",
}: {
  idle?: string;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`w-full rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60 ${className}`}
      disabled={pending}
    >
      {pending ? pendingText : idle}
    </button>
  );
}
