import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { MotionMeasurementSandbox } from "@/components/dashboard/sandbox/MotionMeasurementSandbox";

export default function MotionMeasurementPage() {
  return (
    <ExperimentPageShell
      topicId="motion-measurement"
      slug="motion-measurement"
      grade="Class 6"
      eyebrow="Motion and Measurement of Distances"
      title="Push it. Watch it move. Read the ruler."
      subtitle="Click the object or press Start to apply a force. When it comes to rest, read the ruler to measure how far it travelled."
      chatSummary="The student pushes an object with an adjustable force on a track that has a small amount of air friction. The object decelerates and stops; the student predicts the stopping point beforehand, then reads it off a ruler. The lesson is that a changing position over time is Motion, and reading the ruler from start to end is Measurement of Distance."
      suggestedQuestions={[
        "How does this experiment work?",
        "Why does it stop? Shouldn't it keep moving?",
        "What is friction?",
        "How is distance calculated?",
      ]}
    >
      <MotionMeasurementSandbox />
    </ExperimentPageShell>
  );
}
