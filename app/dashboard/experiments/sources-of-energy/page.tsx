import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { SourcesOfEnergySandbox } from "@/components/dashboard/sandbox/SourcesOfEnergySandbox";
import { SourcesOfEnergySandbox3D } from "@/components/dashboard/sandbox/SourcesOfEnergySandbox3D";

export default function SourcesOfEnergyPage() {
  return (
    <ExperimentPageShell
      topicId="sources-of-energy"
      slug="sources-of-energy"
      grade="Advanced Physics"
      eyebrow="Sources of Energy"
      title="Renewable or not?"
      subtitle="Sort each energy source, then check which ones nature replenishes — and which ones we're using up."
      chatSummary="The student sorts a set of energy sources (solar, wind, coal, oil, etc.) into renewable and non-renewable categories, then checks their answers — renewable sources are naturally replenished, while non-renewable ones are finite and being used up."
      suggestedQuestions={[
        "What makes an energy source renewable?",
        "Why are fossil fuels considered non-renewable?",
        "What are some examples of renewable energy sources?",
        "Why does it matter whether an energy source is renewable?",
      ]}
      sandbox3d={<SourcesOfEnergySandbox3D />}
    >
      <SourcesOfEnergySandbox />
    </ExperimentPageShell>
  );
}
