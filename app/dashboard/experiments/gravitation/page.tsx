import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { GravitationSandbox } from "@/components/dashboard/sandbox/GravitationSandbox";
import { GravitationSandbox3D } from "@/components/dashboard/sandbox/GravitationSandbox3D";

export default function GravitationPage() {
  return (
    <ExperimentPageShell
      topicId="gravitation"
      slug="gravitation"
      grade="Quantitative Physics"
      eyebrow="Gravitation"
      title="Does a heavier object really fall faster?"
      subtitle="Predict what happens, drop a ball and a feather together, then toggle air resistance and watch the answer change."
      chatSummary="A ball and a feather are dropped together. With air resistance on, the feather falls much slower; with air resistance off, both fall at the same rate — showing that gravity itself accelerates all objects equally, and it's air resistance that usually makes things look different."
      suggestedQuestions={[
        "Why do the ball and feather fall at the same rate with no air resistance?",
        "What is the difference between mass and gravity's pull?",
        "Why does air resistance slow the feather down more than the ball?",
        "What is g and why is it the same for all objects?",
      ]}
      sandbox3d={<GravitationSandbox3D />}
    >
      <GravitationSandbox />
    </ExperimentPageShell>
  );
}
