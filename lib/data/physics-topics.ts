export interface PhysicsTopic {
  id: string;
  title: string;
  /** Route slug under /dashboard/experiments/[slug] — only set when a sandbox exists. */
  slug?: string;
}

export interface GradeGroup {
  grade: string;
  topics: PhysicsTopic[];
}

export const PHYSICS_TOPICS: GradeGroup[] = [
  {
    grade: "Class 6",
    topics: [
      { id: "motion-measurement", title: "Motion and Measurement of Distances", slug: "motion-measurement" },
      { id: "light-shadows-reflections", title: "Light, Shadows and Reflections", slug: "shadows" },
      { id: "electricity-circuits", title: "Electricity and Circuits", slug: "electricity-and-circuits" },
      { id: "fun-with-magnets", title: "Fun with Magnets", slug: "magnets" },
    ],
  },
  {
    grade: "Class 7",
    topics: [
      { id: "motion-and-time", title: "Motion and Time", slug: "motion-and-time" },
      { id: "heat", title: "Heat", slug: "heat" },
      { id: "electric-current-effects", title: "Electric Current and its Effects", slug: "electric-current-effects" },
      { id: "light-7", title: "Light", slug: "light-reflection" },
    ],
  },
  {
    grade: "Class 8",
    topics: [
      { id: "force-and-pressure", title: "Force and Pressure", slug: "force-and-pressure" },
      { id: "friction", title: "Friction", slug: "friction" },
      { id: "sound", title: "Sound", slug: "sound" },
      { id: "natural-phenomena", title: "Some Natural Phenomena (lightning, earthquakes)", slug: "natural-phenomena" },
      { id: "light-8", title: "Light", slug: "curved-mirrors" },
      { id: "chemical-effects-electric-current", title: "Chemical Effects of Electric Current", slug: "electrolysis" },
    ],
  },
  {
    grade: "Class 9",
    topics: [
      { id: "motion", title: "Motion", slug: "motion-graphs" },
      { id: "force-and-laws-of-motion", title: "Force and Laws of Motion", slug: "force-and-laws-of-motion" },
      { id: "gravitation", title: "Gravitation", slug: "gravitation" },
      { id: "work-and-energy", title: "Work and Energy", slug: "work-and-energy" },
      { id: "sound-9", title: "Sound", slug: "sound-interference" },
    ],
  },
  {
    grade: "Class 10",
    topics: [
      { id: "light-reflection-refraction", title: "Light — Reflection and Refraction", slug: "refraction" },
      { id: "human-eye-colourful-world", title: "The Human Eye and the Colourful World", slug: "human-eye" },
      { id: "electricity", title: "Electricity", slug: "electricity" },
      { id: "magnetic-effects-electric-current", title: "Magnetic Effects of Electric Current", slug: "magnetic-effects" },
      { id: "sources-of-energy", title: "Sources of Energy", slug: "sources-of-energy" },
    ],
  },
];
