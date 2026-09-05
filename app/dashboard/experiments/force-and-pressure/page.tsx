import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { ForceAndPressureSandbox } from "@/components/dashboard/sandbox/ForceAndPressureSandbox";
import { ForceAndPressureSandbox3D } from "@/components/dashboard/sandbox/ForceAndPressureSandbox3D";

export default function ForceAndPressurePage() {
  return (
    <ExperimentPageShell
      topicId="force-and-pressure"
      slug="force-and-pressure"
      grade="Applied Physics"
      eyebrow="Force and Pressure"
      title="Same force, different area, very different result."
      subtitle="Pick a shape and a force, then watch how much it sinks in — pressure is force spread over an area."
      chatSummary="An object presses down on a soft surface with an adjustable force, and the student can change the contact area (e.g. a flat base vs. a pointed one). The same force sinks in far more when spread over a smaller area, showing pressure = force / area."
      suggestedQuestions={[
        "Why does a smaller area cause more sinking for the same force?",
        "What is the formula for pressure?",
        "Why do knives have thin blades?",
        "How is this related to why snowshoes work?",
      ]}
      sandbox3d={<ForceAndPressureSandbox3D />}
    >
      <ForceAndPressureSandbox />
    </ExperimentPageShell>
  );
}
