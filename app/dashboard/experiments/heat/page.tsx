import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { HeatSandbox } from "@/components/dashboard/sandbox/HeatSandbox";
import { HeatSandbox3D } from "@/components/dashboard/sandbox/HeatSandbox3D";

export default function HeatPage() {
  return (
    <ExperimentPageShell
      topicId="heat"
      slug="heat"
      grade="Exploring Physics"
      eyebrow="Heat"
      title="Heat is particles moving faster."
      subtitle="Turn up the temperature and watch a tidy solid shake loose into a liquid, then a gas."
      chatSummary="A block of particles starts as a tightly packed solid. As the student raises the temperature, particles vibrate faster and eventually break free — melting into a liquid, then evaporating into a gas — illustrating that heat is particle motion energy."
      suggestedQuestions={[
        "Why does heating make particles move faster?",
        "What is actually happening when a solid melts?",
        "Is there a difference between heat and temperature?",
        "Why do gases spread out more than liquids?",
      ]}
      sandbox3d={<HeatSandbox3D />}
    >
      <HeatSandbox />
    </ExperimentPageShell>
  );
}
