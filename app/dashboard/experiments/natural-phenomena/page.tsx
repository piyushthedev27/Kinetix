import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { NaturalPhenomenaSandbox } from "@/components/dashboard/sandbox/NaturalPhenomenaSandbox";

export default function NaturalPhenomenaPage() {
  return (
    <ExperimentPageShell
      topicId="natural-phenomena"
      slug="natural-phenomena"
      grade="Class 8"
      eyebrow="Some Natural Phenomena"
      title="Sudden charge. Spreading waves."
      subtitle="Build up static charge until lightning strikes, or set an earthquake's epicenter and watch the seismic waves travel outward."
      chatSummary="Two demonstrations: building static charge until it discharges as a lightning-like spark, and setting an earthquake epicenter to watch seismic waves ripple outward across a map. Both show natural phenomena caused by energy building up and suddenly releasing or spreading."
      suggestedQuestions={[
        "How does lightning actually form?",
        "Why do earthquakes create waves that spread outward?",
        "What is static electricity?",
        "Can earthquakes be predicted?",
      ]}
    >
      <NaturalPhenomenaSandbox />
    </ExperimentPageShell>
  );
}
