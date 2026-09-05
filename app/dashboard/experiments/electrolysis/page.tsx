import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { ElectrolysisSandbox } from "@/components/dashboard/sandbox/ElectrolysisSandbox";

export default function ElectrolysisPage() {
  return (
    <ExperimentPageShell
      topicId="chemical-effects-electric-current"
      slug="electrolysis"
      grade="Class 8"
      eyebrow="Chemical Effects of Electric Current"
      title="Current can trigger a chemical reaction."
      subtitle="Turn up the voltage and watch bubbles form faster at each electrode."
      chatSummary="Two electrodes sit in a conducting liquid with a voltage the student can adjust. Raising the voltage speeds up the chemical reaction, producing bubbles faster at each electrode — a demonstration of the chemical effects of electric current."
      suggestedQuestions={[
        "Why does current cause bubbles to form at the electrodes?",
        "What is electrolysis used for?",
        "Why does raising the voltage speed up the reaction?",
        "What is happening chemically at each electrode?",
      ]}
    >
      <ElectrolysisSandbox />
    </ExperimentPageShell>
  );
}
