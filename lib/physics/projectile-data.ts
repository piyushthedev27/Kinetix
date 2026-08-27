import type { ProjectileExperiment } from "./projectile-model";
import {
  buildTrajectoryPoints,
  formatAngle,
  formatDistance,
  formatSpeed,
  formatTime,
} from "./physics-utils";

export const primaryProjectileExperiment: ProjectileExperiment = (() => {
  const model = buildTrajectoryPoints({
    angle: 38,
    velocity: 5.8,
    launchHeight: 0.42,
    targetAngle: 45,
  });

  const actualRange = model.actualRange;
  const theoryRange = model.theoryRange;

  return {
    id: "kx-2408-017",
    type: "projectile-motion",
    title: "Projectile Motion",
    createdAt: "2026-08-27T12:42:00+05:30",
    dateLabel: "Today · 12:42 PM",
    status: "replay",
    angle: 38,
    targetAngle: 45,
    velocity: 5.8,
    launchHeight: 0.42,
    flightTime: model.actualFlightTime,
    maxHeight: model.actualMaxHeight,
    range: actualRange,
    actualTrajectory: model.actualTrajectory,
    theoryTrajectory: model.theoryTrajectory,
    actualPath: model.actualPath,
    theoryPath: model.theoryPath,
    samples: model.samples,
    metrics: [
      { label: "Launch angle", value: formatAngle(38) },
      { label: "Initial velocity", value: formatSpeed(5.8) },
      { label: "Maximum height", value: formatDistance(model.actualMaxHeight) },
      { label: "Range", value: formatDistance(actualRange) },
      { label: "Flight time", value: formatTime(model.actualFlightTime) },
    ],
    summary: `38° → 45° theory | ${formatDistance(theoryRange)} predicted | ${formatDistance(actualRange)} measured`,
  };
})();

export const experimentMetrics = primaryProjectileExperiment.metrics.slice(0, 4);

export const history = [
  {
    id: "kx-2408-017",
    title: "Projectile Motion",
    date: "Today · 12:42 PM",
    angle: formatAngle(43),
    velocity: formatSpeed(6.0),
    range: formatDistance(5.8),
    comparison: "38° → 43°",
  },
  {
    id: "kx-2408-016",
    title: "Projectile Motion",
    date: "Yesterday · 4:11 PM",
    angle: formatAngle(38),
    velocity: formatSpeed(5.8),
    range: formatDistance(5.1),
    comparison: "5.1 m → 5.8 m",
  },
] as const;

