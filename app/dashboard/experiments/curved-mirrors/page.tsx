import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { CurvedMirrorSandbox } from "@/components/dashboard/sandbox/CurvedMirrorSandbox";

export default function CurvedMirrorsPage() {
  return (
    <ExperimentPageShell
      topicId="light-8"
      slug="curved-mirrors"
      grade="Class 8"
      eyebrow="Light"
      title="Curved mirrors bend the rules."
      subtitle="Move the object, switch between concave and convex, and see whether the image is real or virtual, upright or flipped."
      chatSummary="An object sits in front of a mirror the student can switch between concave and convex, moving the object closer or farther away. Depending on the mirror type and distance, the resulting image is real or virtual, upright or inverted, magnified or reduced."
      suggestedQuestions={[
        "What's the difference between a concave and convex mirror?",
        "Why does a concave mirror sometimes flip the image?",
        "What is a real image versus a virtual image?",
        "Where are curved mirrors used in real life?",
      ]}
    >
      <CurvedMirrorSandbox />
    </ExperimentPageShell>
  );
}
