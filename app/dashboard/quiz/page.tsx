import { QuizBrowser } from "@/components/dashboard/quiz/QuizBrowser";

export default function QuizHubPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Test Yourself</p>
        <h1 className="kx-page-title">Check what you&rsquo;ve learned.</h1>
        <p className="kx-page-subtitle">A short quiz for each experiment — see how well the concept stuck.</p>
      </div>

      <QuizBrowser />
    </div>
  );
}
