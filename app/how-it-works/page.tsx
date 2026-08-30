"use client";

import { Footer, MarketingHeader } from "@/components/layout";
import { Button, SectionHeading } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function HowItWorksPage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <MarketingHeader />
      <main className="container section">
        <SectionHeading
          eyebrow="How Kinetix works"
          title="Perform the equation."
          description="Set up the camera, perform a real throw, then follow its data through replay, comparison, and explanation."
        />

        <div className="step-grid" style={{ marginTop: 36 }}>
          <article className="step">
            <span className="step-number">01</span>
            <h3>Capture</h3>
            <p>The phone observes a visible ball in a prepared space.</p>
          </article>
          <article className="step">
            <span className="step-number">02</span>
            <h3>Measure</h3>
            <p>Kinetix turns positions over time into understandable values.</p>
          </article>
          <article className="step">
            <span className="step-number">03</span>
            <h3>Learn</h3>
            <p>Compare your result with theory and test a better next attempt.</p>
          </article>
        </div>

        <div className="actions">
          <Button href={isAuthenticated ? "/dashboard" : "/auth/sign-up"}>Start experimenting</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}

