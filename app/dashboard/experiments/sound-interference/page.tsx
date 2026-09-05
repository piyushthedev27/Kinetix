import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { SoundInterferenceSandbox } from "@/components/dashboard/sandbox/SoundInterferenceSandbox";

export default function SoundInterferencePage() {
  return (
    <ExperimentPageShell
      topicId="sound-9"
      slug="sound-interference"
      grade="Class 9"
      eyebrow="Sound"
      title="Two sounds can add up — or cancel out."
      subtitle="Shift the phase between two identical sound sources and predict whether the result gets louder or quieter."
      chatSummary="Two identical sound sources overlap, and the student can shift the phase between them. When the waves line up, they add together for a louder sound; when they're out of phase, they cancel and the sound gets quieter — this is wave interference."
      suggestedQuestions={[
        "What is constructive versus destructive interference?",
        "Why do two sounds sometimes cancel each other out?",
        "What does 'phase' mean for a wave?",
        "Where is sound interference used in real life?",
      ]}
    >
      <SoundInterferenceSandbox />
    </ExperimentPageShell>
  );
}
