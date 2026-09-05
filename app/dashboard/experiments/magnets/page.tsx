import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { MagnetsSandbox } from "@/components/dashboard/sandbox/MagnetsSandbox";
import { MagnetsSandbox3D } from "@/components/dashboard/sandbox/MagnetsSandbox3D";

export default function MagnetsPage() {
  return (
    <ExperimentPageShell
      topicId="fun-with-magnets"
      slug="magnets"
      grade="Foundation Physics"
      eyebrow="Fun with Magnets"
      title="Some poles pull. Some poles push."
      subtitle="Choose which poles face each other, predict what happens, then release the magnet and watch."
      chatSummary="Two bar magnets face each other. When unlike poles (N and S) face each other they attract; when like poles (N and N) face each other they repel. The student predicts attract or repel before releasing the movable magnet."
      suggestedQuestions={[
        "Why do unlike poles attract?",
        "What would happen if I flipped the magnet around?",
        "Do magnets only work on other magnets?",
        "What is a magnetic field?",
      ]}
      sandbox3d={<MagnetsSandbox3D />}
    >
      <MagnetsSandbox />
    </ExperimentPageShell>
  );
}
