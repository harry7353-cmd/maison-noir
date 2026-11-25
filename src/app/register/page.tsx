"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { ArrowRightIcon, ShieldIcon } from "@/components/ui/Icons";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, password, phone);
    setSubmitting(false);

    if (result.success) {
      router.push("/account");
    } else {
      setError(result.message || "Failed to create account.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-6 bg-ivory-light/50">
      <div className="w-full max-w-lg bg-white border border-border p-8 sm:p-12 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo variant="dark" size="sm" className="mb-4" />
          <span className="text-label text-gold text-[10px] tracking-[0.25em] block mb-2">
            Privileged Membership
          </span>
          <h1 className="heading-display text-2xl sm:text-3xl text-noir">
            Join the House
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="text-label text-[11px] text-noir block mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lorde Sterling"
              className="w-full px-4 py-3 bg-white border border-border text-sm text-noir
                placeholder:text-muted-light focus:outline-none focus:border-gold
                transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="client@maisonnoir.com"
                className="w-full px-4 py-3 bg-white border border-border text-sm text-noir
                  placeholder:text-muted-light focus:outline-none focus:border-gold
                  transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="text-label text-[11px] text-noir block mb-2"
              >
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 bg-white border border-border text-sm text-noir
                  placeholder:text-muted-light focus:outline-none focus:border-gold
                  transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="text-label text-[11px] text-noir block mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full px-4 py-3 bg-white border border-border text-sm text-noir
                  placeholder:text-muted-light focus:outline-none focus:border-gold
                  transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-label text-[11px] text-noir block mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-white border border-border text-sm text-noir
                  placeholder:text-muted-light focus:outline-none focus:border-gold
                  transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {submitting ? "Registering Client..." : "Create Account"}
              {!submitting && <ArrowRightIcon size={16} />}
            </button>
          </div>
        </form>

        {/* Security badge */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-muted text-[11px]">
          <ShieldIcon size={14} className="text-gold" />
          <span>Complimentary Priority Privileges &amp; Invitations</span>
        </div>

        {/* Link to Login */}
        <div className="mt-6 text-center text-xs text-muted">
          Already a client?{" "}
          <Link
            href="/login"
            className="text-noir font-medium hover:text-gold underline underline-offset-4 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
