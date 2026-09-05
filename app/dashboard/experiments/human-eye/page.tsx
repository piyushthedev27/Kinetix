import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { HumanEyeSandbox } from "@/components/dashboard/sandbox/HumanEyeSandbox";

export default function HumanEyePage() {
  return (
    <ExperimentPageShell
      topicId="human-eye-colourful-world"
      slug="human-eye"
      grade="Class 10"
      eyebrow="The Human Eye and the Colourful World"
      title="A lens problem your glasses solve."
      subtitle="Correct a short-sighted or long-sighted eye by dialing in the right lens power — or split white light into a spectrum."
      chatSummary="An eye model focuses light either too early (short-sightedness) or too late (long-sightedness) relative to the retina. The student dials in a corrective lens power to bring the focus back onto the retina. A second mode splits white light through a prism into a spectrum."
      suggestedQuestions={[
        "What causes short-sightedness and long-sightedness?",
        "How do glasses correct where light focuses?",
        "Why does a prism split white light into colors?",
        "What is the order of colors in the visible spectrum?",
      ]}
    >
      <HumanEyeSandbox />
    </ExperimentPageShell>
  );
}
