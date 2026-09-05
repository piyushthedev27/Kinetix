import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { MagneticEffectsSandbox } from "@/components/dashboard/sandbox/MagneticEffectsSandbox";

export default function MagneticEffectsPage() {
  return (
    <ExperimentPageShell
      topicId="magnetic-effects-electric-current"
      slug="magnetic-effects"
      grade="Class 10"
      eyebrow="Magnetic Effects of Electric Current"
      title="A wire with current is also a magnet."
      subtitle="Turn up the current, flip its direction, and predict which way a nearby compass needle will swing."
      chatSummary="A current-carrying wire sits near a compass. The student adjusts the current's strength and direction and predicts which way the compass needle will deflect, demonstrating that electric current produces its own magnetic field."
      suggestedQuestions={[
        "Why does a current-carrying wire act like a magnet?",
        "What determines which way the compass needle points?",
        "What is the right-hand rule?",
        "How is this effect used in electromagnets?",
      ]}
    >
      <MagneticEffectsSandbox />
    </ExperimentPageShell>
  );
}
