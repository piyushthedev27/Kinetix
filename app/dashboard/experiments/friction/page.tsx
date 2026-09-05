import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { FrictionSandbox } from "@/components/dashboard/sandbox/FrictionSandbox";

export default function FrictionPage() {
  return (
    <ExperimentPageShell
      topicId="friction"
      slug="friction"
      grade="Class 8"
      eyebrow="Friction"
      title="Same push, different surfaces."
      subtitle="Pick a surface, set a force, predict where it stops — then see how much the surface changes the answer."
      chatSummary="The student slides a block across ice, wood, or sandpaper with an adjustable force. Rougher surfaces create more friction, which slows the block down faster and shortens the sliding distance for the same push. The student predicts the stopping distance, then checks it against the ruler."
      suggestedQuestions={[
        "What is friction?",
        "Why does sandpaper stop the block sooner than ice?",
        "Does friction depend on how hard I push?",
        "Where do we see friction in everyday life?",
      ]}
    >
      <FrictionSandbox />
    </ExperimentPageShell>
  );
}
