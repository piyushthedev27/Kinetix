"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brand, Button } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendOtp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await sendOtp(email);
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Brand />
        <h1>Welcome back</h1>
        <p>Enter your email and we&apos;ll send you a code to sign in.</p>
        <form onSubmit={handleSubmit}>
          <label className="field">
            Email
            <input 
              type="email" 
              autoComplete="email" 
              placeholder="you@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </label>
          
          {error && <p style={{ color: "var(--orange)", margin: "0.5rem 0", fontSize: "0.875rem" }}>{error}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending code..." : "Send verification code"}
          </Button>
        </form>
        <p className="form-note">
          <Link href="/auth/sign-up">Don&apos;t have an account? Create one</Link>
        </p>
      </section>
    </main>
  );
}

