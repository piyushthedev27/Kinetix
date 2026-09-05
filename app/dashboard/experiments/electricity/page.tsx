import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { ElectricityQuantitativeSandbox } from "@/components/dashboard/sandbox/ElectricityQuantitativeSandbox";

export default function ElectricityPage() {
  return (
    <ExperimentPageShell
      topicId="electricity"
      slug="electricity"
      grade="Class 10"
      eyebrow="Electricity"
      title="Voltage pushes, resistance resists."
      subtitle="Set a voltage and a resistance, predict the current, then check it against Ohm's Law."
      chatSummary="A simple circuit has an adjustable voltage source and an adjustable resistor. The student predicts the resulting current, then checks it against Ohm's Law: current equals voltage divided by resistance."
      suggestedQuestions={[
        "What is Ohm's Law?",
        "Why does increasing resistance decrease current?",
        "What's the difference between voltage and current?",
        "How is electrical power related to voltage and current?",
      ]}
    >
      <ElectricityQuantitativeSandbox />
    </ExperimentPageShell>
  );
}
