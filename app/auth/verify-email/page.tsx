"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brand, Button } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthProvider";

function VerifyEmailForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  const { verifyOtp, resendOtp } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      router.replace("/auth/sign-up");
    }
  }, [email, router]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) return;

    if (code.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsSubmitting(true);
    try {
      const { isNewUser } = await verifyOtp(email, code);
      // AuthProvider already stored the token and updated state
      if (isNewUser) {
        router.push("/onboarding");
      } else {
        router.replace("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired code");
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    
    setError("");
    setMessage("");
    setCooldown(30);

    try {
      await resendOtp(email);
      setMessage("Code resent successfully");
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
      setCooldown(0); // Reset cooldown on error so they can try again
    }
  };

  if (!email) return null;

  return (
    <section className="auth-card">
      <Brand />
      <h1>Check your email</h1>
      <p>We sent a 6-digit code to {email}.</p>
      
      <form onSubmit={handleSubmit}>
        <label className="field">
          Verification Code
          <input 
            type="text" 
            inputMode="numeric"
            maxLength={6}
            placeholder="123456" 
            required 
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // only allow digits
            disabled={isSubmitting}
            style={{ letterSpacing: "0.5rem", textAlign: "center", fontSize: "1.25rem" }}
          />
        </label>
        
        {error && <p style={{ color: "var(--orange)", margin: "0.5rem 0", fontSize: "0.875rem" }}>{error}</p>}
        {message && <p style={{ color: "var(--green)", margin: "0.5rem 0", fontSize: "0.875rem" }}>{message}</p>}
        
        <Button type="submit" disabled={isSubmitting || code.length !== 6}>
          {isSubmitting ? "Verifying..." : "Verify & sign in"}
        </Button>
      </form>
      
      <div className="form-note" style={{ marginTop: "1rem" }}>
        <button 
          onClick={handleResend} 
          disabled={cooldown > 0}
          style={{ 
            background: "none", 
            border: "none", 
            color: cooldown > 0 ? "var(--muted)" : "var(--ink)", 
            cursor: cooldown > 0 ? "not-allowed" : "pointer",
            textDecoration: cooldown > 0 ? "none" : "underline",
            fontSize: "0.875rem"
          }}
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="auth-page">
      <Suspense fallback={
        <section className="auth-card">
          <Brand />
          <p>Loading...</p>
        </section>
      }>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}

