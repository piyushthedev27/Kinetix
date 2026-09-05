import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { MotionGraphSandbox } from "@/components/dashboard/sandbox/MotionGraphSandbox";
import { MotionGraphSandbox3D } from "@/components/dashboard/sandbox/MotionGraphSandbox3D";

export default function MotionGraphsPage() {
  return (
    <ExperimentPageShell
      topicId="motion"
      slug="motion-graphs"
      grade="Quantitative Physics"
      eyebrow="Motion"
      title="The graph is the story of the motion."
      subtitle="Launch the object and watch its distance-time and speed-time graphs draw themselves in real time."
      chatSummary="An object moves under settings the student controls, while distance-time and speed-time graphs draw themselves live alongside the motion. The shape of each graph — its slope, curve, or flat sections — directly reflects what the object is doing."
      suggestedQuestions={[
        "What does the slope of a distance-time graph tell us?",
        "How is a speed-time graph different from a distance-time graph?",
        "What does a flat line on the speed-time graph mean?",
        "How can I read acceleration from a speed-time graph?",
      ]}
      sandbox3d={<MotionGraphSandbox3D />}
    >
      <MotionGraphSandbox />
    </ExperimentPageShell>
  );
}
