import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { WorkAndEnergySandbox } from "@/components/dashboard/sandbox/WorkAndEnergySandbox";
import { WorkAndEnergySandbox3D } from "@/components/dashboard/sandbox/WorkAndEnergySandbox3D";

export default function WorkAndEnergyPage() {
  return (
    <ExperimentPageShell
      topicId="work-and-energy"
      slug="work-and-energy"
      grade="Quantitative Physics"
      eyebrow="Work and Energy"
      title="Energy doesn't disappear — it changes form."
      subtitle="Release a ball into a valley and watch potential energy trade places with kinetic energy, swing after swing."
      chatSummary="A ball is released on a curved track and swings back and forth like a pendulum. At the top of each swing it has maximum potential energy and zero speed; at the bottom it has maximum kinetic energy and top speed. Total energy stays constant — it just keeps changing form."
      suggestedQuestions={[
        "What is potential energy versus kinetic energy?",
        "Why does the ball slow down as it rises?",
        "Does the ball ever lose energy?",
        "What is the law of conservation of energy?",
      ]}
      sandbox3d={<WorkAndEnergySandbox3D />}
    >
      <WorkAndEnergySandbox />
    </ExperimentPageShell>
  );
}
