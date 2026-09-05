import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { MotionAndTimeSandbox } from "@/components/dashboard/sandbox/MotionAndTimeSandbox";
import { MotionAndTimeSandbox3D } from "@/components/dashboard/sandbox/MotionAndTimeSandbox3D";

export default function MotionAndTimePage() {
  return (
    <ExperimentPageShell
      topicId="motion-and-time"
      slug="motion-and-time"
      grade="Exploring Physics"
      eyebrow="Motion and Time"
      title="Same finish line, two different speeds."
      subtitle="Set a speed for each racer, predict the winner, then watch the clock decide who covers the distance faster."
      chatSummary="Two racers move toward the same finish line at speeds the student sets. The student predicts which racer arrives first, then watches a live clock and distance readout confirm the outcome — speed is distance covered per unit time."
      suggestedQuestions={[
        "Why does the faster racer win even if they start together?",
        "How is speed calculated from distance and time?",
        "What would happen if both racers had the same speed?",
        "What's the difference between speed and velocity?",
      ]}
      sandbox3d={<MotionAndTimeSandbox3D />}
    >
      <MotionAndTimeSandbox />
    </ExperimentPageShell>
  );
}
