"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { ArrowRightIcon, ShieldIcon } from "@/components/ui/Icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      router.push("/account");
    } else {
      setError(result.message || "Invalid credentials.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-6 bg-ivory-light/50">
      <div className="w-full max-w-md bg-white border border-border p-8 sm:p-12 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo variant="dark" size="sm" className="mb-4" />
          <span className="text-label text-gold text-[10px] tracking-[0.25em] block mb-2">
            Private Access
          </span>
          <h1 className="heading-display text-2xl sm:text-3xl text-noir">
            Sign In to the House
          </h1>
          <div className="gold-line mx-auto mt-4" />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs leading-relaxed">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-label text-[11px] text-noir block mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. client@maisonnoir.com"
              className="w-full px-4 py-3 bg-white border border-border text-sm text-noir
                placeholder:text-muted-light focus:outline-none focus:border-gold
                transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="text-label text-[11px] text-noir"
              >
                Password
              </label>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password reset instructions will be sent to your registered email.");
                }}
                className="text-[11px] text-muted hover:text-gold transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-border text-sm text-noir
                placeholder:text-muted-light focus:outline-none focus:border-gold
                transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting ? "Authenticating..." : "Sign In"}
            {!submitting && <ArrowRightIcon size={16} />}
          </button>
        </form>

        {/* Security badge */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-muted text-[11px]">
          <ShieldIcon size={14} className="text-gold" />
          <span>Encrypted 256-bit Session Security</span>
        </div>

        {/* Link to Register */}
        <div className="mt-6 text-center text-xs text-muted">
          New to MAISON NOIR?{" "}
          <Link
            href="/register"
            className="text-noir font-medium hover:text-gold underline underline-offset-4 transition-colors"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
