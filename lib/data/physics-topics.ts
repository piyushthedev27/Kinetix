import type { LucideIcon } from "lucide-react";
import {
  Footprints,
  Sun,
  Zap,
  Magnet,
  Timer,
  Thermometer,
  PlugZap,
  Lightbulb,
  Weight,
  Grip,
  Volume2,
  CloudLightning,
  Aperture,
  FlaskConical,
  LineChart,
  Rocket,
  Orbit,
  Gauge,
  AudioWaveform,
  Sparkles,
  Eye,
  Compass,
  Leaf,
} from "lucide-react";

export interface PhysicsTopic {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Route slug under /dashboard/experiments/[slug] — only set when a sandbox exists. */
  slug?: string;
}

export interface GradeGroup {
  grade: string;
  description: string;
  topics: PhysicsTopic[];
}

export const PHYSICS_TOPICS: GradeGroup[] = [
  {
    grade: "Class 6",
    description: "Build your understanding of the physical world.",
    topics: [
      { id: "motion-measurement", title: "Motion and Measurement of Distances", description: "Push it, measure it, and read the result on a ruler.", icon: Footprints, slug: "motion-measurement" },
      { id: "light-shadows-reflections", title: "Light, Shadows and Reflections", description: "See how moving a light source changes a shadow's shape.", icon: Sun, slug: "shadows" },
      { id: "electricity-circuits", title: "Electricity and Circuits", description: "Build a simple circuit and discover what makes a bulb light up.", icon: Zap, slug: "electricity-and-circuits" },
      { id: "fun-with-magnets", title: "Fun with Magnets", description: "Find out which poles pull together and which push apart.", icon: Magnet, slug: "magnets" },
    ],
  },
  {
    grade: "Class 7",
    description: "Go deeper into motion, heat, and electricity.",
    topics: [
      { id: "motion-and-time", title: "Motion and Time", description: "Race two objects and see how speed decides the winner.", icon: Timer, slug: "motion-and-time" },
      { id: "heat", title: "Heat", description: "Turn up the temperature and watch matter change state.", icon: Thermometer, slug: "heat" },
      { id: "electric-current-effects", title: "Electric Current and its Effects", description: "One current, three effects — heat, light, and magnetism.", icon: PlugZap, slug: "electric-current-effects" },
      { id: "light-7", title: "Light", description: "Bounce a light ray off a mirror and predict where it goes.", icon: Lightbulb, slug: "light-reflection" },
    ],
  },
  {
    grade: "Class 8",
    description: "Explore forces, waves, and everyday phenomena.",
    topics: [
      { id: "force-and-pressure", title: "Force and Pressure", description: "Same force, different area — feel the difference in pressure.", icon: Weight, slug: "force-and-pressure" },
      { id: "friction", title: "Friction", description: "Compare how far something slides on ice, wood, and sandpaper.", icon: Grip, slug: "friction" },
      { id: "sound", title: "Sound", description: "Change the pitch and loudness of a sound wave — and hear it.", icon: Volume2, slug: "sound" },
      { id: "natural-phenomena", title: "Some Natural Phenomena (lightning, earthquakes)", description: "Build up static charge until lightning strikes, or trigger a seismic wave.", icon: CloudLightning, slug: "natural-phenomena" },
      { id: "light-8", title: "Light", description: "Explore how curved mirrors form real and virtual images.", icon: Aperture, slug: "curved-mirrors" },
      { id: "chemical-effects-electric-current", title: "Chemical Effects of Electric Current", description: "Watch electrolysis produce bubbles as voltage rises.", icon: FlaskConical, slug: "electrolysis" },
    ],
  },
  {
    grade: "Class 9",
    description: "Quantify motion, energy, and the forces behind them.",
    topics: [
      { id: "motion", title: "Motion", description: "Watch distance-time and speed-time graphs draw themselves.", icon: LineChart, slug: "motion-graphs" },
      { id: "force-and-laws-of-motion", title: "Force and Laws of Motion", description: "Push different masses and test Newton's second law.", icon: Rocket, slug: "force-and-laws-of-motion" },
      { id: "gravitation", title: "Gravitation", description: "Drop a ball and a feather together — does mass matter?", icon: Orbit, slug: "gravitation" },
      { id: "work-and-energy", title: "Work and Energy", description: "Watch energy trade places between potential and kinetic.", icon: Gauge, slug: "work-and-energy" },
      { id: "sound-9", title: "Sound", description: "Combine two sound waves and hear them add up or cancel out.", icon: AudioWaveform, slug: "sound-interference" },
    ],
  },
  {
    grade: "Class 10",
    description: "Master optics, electricity, and magnetism.",
    topics: [
      { id: "light-reflection-refraction", title: "Light — Reflection and Refraction", description: "Watch a ray of light bend as it enters water or glass.", icon: Sparkles, slug: "refraction" },
      { id: "human-eye-colourful-world", title: "The Human Eye and the Colourful World", description: "Correct a short-sighted eye, then split light into a rainbow.", icon: Eye, slug: "human-eye" },
      { id: "electricity", title: "Electricity", description: "Dial in voltage and resistance and test Ohm's Law.", icon: PlugZap, slug: "electricity" },
      { id: "magnetic-effects-electric-current", title: "Magnetic Effects of Electric Current", description: "Flip a current's direction and watch a compass respond.", icon: Compass, slug: "magnetic-effects" },
      { id: "sources-of-energy", title: "Sources of Energy", description: "Sort energy sources into renewable and non-renewable.", icon: Leaf, slug: "sources-of-energy" },
    ],
  },
];
