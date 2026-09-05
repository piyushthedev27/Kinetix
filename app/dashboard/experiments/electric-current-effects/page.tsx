import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { ElectricEffectsSandbox } from "@/components/dashboard/sandbox/ElectricEffectsSandbox";

export default function ElectricCurrentEffectsPage() {
  return (
    <ExperimentPageShell
      topicId="electric-current-effects"
      slug="electric-current-effects"
      grade="Class 7"
      eyebrow="Electric Current and its Effects"
      title="One current, three effects."
      subtitle="Turn up the current and watch it heat a coil, deflect a compass, and light a bulb — all at once."
      chatSummary="A single adjustable current flows through three connected demonstrations at once: a heating coil, a compass needle near a wire, and a bulb. Raising the current increases the coil's heat, the compass deflection, and the bulb's brightness together."
      suggestedQuestions={[
        "Why does current heat up the coil?",
        "How does electric current create a magnetic effect on the compass?",
        "Why does the bulb get brighter with more current?",
        "Are these three effects related to each other?",
      ]}
    >
      <ElectricEffectsSandbox />
    </ExperimentPageShell>
  );
}
