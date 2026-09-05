import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { ForceAndLawsSandbox } from "@/components/dashboard/sandbox/ForceAndLawsSandbox";
import { ForceAndLawsSandbox3D } from "@/components/dashboard/sandbox/ForceAndLawsSandbox3D";

export default function ForceAndLawsPage() {
  return (
    <ExperimentPageShell
      topicId="force-and-laws-of-motion"
      slug="force-and-laws-of-motion"
      grade="Quantitative Physics"
      eyebrow="Force and Laws of Motion"
      title="Heavier things resist speeding up."
      subtitle="Set a mass and a force, predict the top speed, then check whether acceleration really is force divided by mass."
      chatSummary="An object with an adjustable mass is pushed by an adjustable force. The student predicts the resulting acceleration or top speed, then checks it against Newton's second law: acceleration equals force divided by mass."
      suggestedQuestions={[
        "What is Newton's second law?",
        "Why does a heavier object accelerate more slowly for the same force?",
        "What's the difference between mass and weight?",
        "What are Newton's three laws of motion?",
      ]}
      sandbox3d={<ForceAndLawsSandbox3D />}
    >
      <ForceAndLawsSandbox />
    </ExperimentPageShell>
  );
}
