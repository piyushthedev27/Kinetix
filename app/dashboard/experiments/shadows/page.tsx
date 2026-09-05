import { ExperimentPageShell } from "@/components/dashboard/experiment/ExperimentPageShell";
import { ShadowsSandbox } from "@/components/dashboard/sandbox/ShadowsSandbox";

export default function ShadowsPage() {
  return (
    <ExperimentPageShell
      topicId="light-shadows-reflections"
      slug="shadows"
      grade="Class 6"
      eyebrow="Light, Shadows and Reflections"
      title="Move the light. Watch the shadow change."
      subtitle="Predict what happens when the light rises, then check the shadow's length for yourself."
      chatSummary="A light source shines on an opaque object standing on the ground, casting a shadow. The student can move the light higher or farther away and predict whether the shadow gets longer or shorter, then check the measured shadow length."
      suggestedQuestions={[
        "Why does raising the light make the shadow shorter?",
        "What makes a shadow form in the first place?",
        "Would the shadow disappear if the light were directly overhead?",
        "How is this related to reflection?",
      ]}
    >
      <ShadowsSandbox />
    </ExperimentPageShell>
  );
}
