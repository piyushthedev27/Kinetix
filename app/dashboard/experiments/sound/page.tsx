import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { SoundSandbox } from "@/components/dashboard/sandbox/SoundSandbox";

export default function SoundPage() {
  return (
    <ExperimentPageShell
      topicId="sound"
      slug="sound"
      grade="Class 8"
      eyebrow="Sound"
      title="Faster vibrations, higher pitch."
      subtitle="Change the frequency and amplitude, watch the waveform respond, and hear the difference for yourself."
      chatSummary="A sound source produces a waveform the student can shape by adjusting frequency and amplitude. Raising the frequency raises the pitch; raising the amplitude raises the loudness. The student can watch the waveform change and hear the result."
      suggestedQuestions={[
        "What is the difference between frequency and amplitude?",
        "Why does higher frequency mean higher pitch?",
        "What makes a sound louder?",
        "How does sound actually travel through air?",
      ]}
    >
      <SoundSandbox />
    </ExperimentPageShell>
  );
}
