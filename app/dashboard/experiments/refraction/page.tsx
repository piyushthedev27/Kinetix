import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { RefractionSandbox } from "@/components/dashboard/sandbox/RefractionSandbox";

export default function RefractionPage() {
  return (
    <ExperimentPageShell
      topicId="light-reflection-refraction"
      slug="refraction"
      grade="Class 10"
      eyebrow="Light — Reflection and Refraction"
      title="Light bends when it changes speed."
      subtitle="Set the angle and the medium, predict which way it bends, then reveal the refracted ray."
      chatSummary="A ray of light travels from one medium into another (e.g. air into water) at an angle the student sets. Because light changes speed crossing the boundary, it bends — the student predicts the direction of the bend before revealing the refracted ray."
      suggestedQuestions={[
        "Why does light bend when it enters a new medium?",
        "What is the refractive index?",
        "Why does a straw look bent in a glass of water?",
        "What is total internal reflection?",
      ]}
    >
      <RefractionSandbox />
    </ExperimentPageShell>
  );
}
