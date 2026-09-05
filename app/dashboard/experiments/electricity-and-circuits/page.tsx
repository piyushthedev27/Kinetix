import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { ElectricityAndCircuitsSandbox } from "@/components/dashboard/sandbox/ElectricityAndCircuitsSandbox";

export default function ElectricityAndCircuitsPage() {
  return (
    <ExperimentPageShell
      topicId="electricity-circuits"
      slug="electricity-and-circuits"
      grade="Class 6"
      eyebrow="Electricity and Circuits"
      title="A bulb only lights up in a complete loop."
      subtitle="Open the switch, break the wire, add more cells — predict what happens to the bulb before you check."
      chatSummary="A simple circuit has a battery, a switch, a wire, and a bulb. The bulb only lights when the switch is closed and the wire forms an unbroken loop; more battery cells make it brighter. The student predicts whether the bulb will light before checking."
      suggestedQuestions={[
        "Why doesn't the bulb light when the switch is open?",
        "What happens if the wire is broken?",
        "Why does adding more cells make the bulb brighter?",
        "What is a complete circuit?",
      ]}
    >
      <ElectricityAndCircuitsSandbox />
    </ExperimentPageShell>
  );
}
