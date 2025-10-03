// components/AuthCard.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthCard({ title, subtitle, children, footer }: Props) {
  // small UX nicety: show password toggle when present
  const [show, setShow] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="mb-5">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
            Welcome back
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          ) : null}
        </div>

        {/* form slot */}
        <div className="space-y-4">{children}</div>

        {footer ? <div className="mt-5">{footer}</div> : null}
      </div>

      {/* Subtle page flourish under the card */}
      <div className="pointer-events-none mx-auto mt-6 h-28 w-64 rounded-full bg-blue-50/50 blur-2xl" />
    </div>
  );
}
