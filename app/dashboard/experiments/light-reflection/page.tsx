import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { LightReflectionSandbox } from "@/components/dashboard/sandbox/LightReflectionSandbox";

export default function LightReflectionPage() {
  return (
    <ExperimentPageShell
      topicId="light-7"
      slug="light-reflection"
      grade="Class 7"
      eyebrow="Light"
      title="Light bounces off a mirror at a matching angle."
      subtitle="Set the angle the light arrives at, predict how it leaves, then reveal the reflected ray."
      chatSummary="A ray of light hits a flat mirror at an angle the student sets. The student predicts the angle at which it reflects, then reveals the reflected ray to confirm the law of reflection: angle of incidence equals angle of reflection."
      suggestedQuestions={[
        "What is the law of reflection?",
        "Why is the reflected angle equal to the incident angle?",
        "What's the difference between reflection and refraction?",
        "Where do we see reflection in daily life?",
      ]}
    >
      <LightReflectionSandbox />
    </ExperimentPageShell>
  );
}
