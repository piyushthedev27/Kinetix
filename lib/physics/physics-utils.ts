import { SCENE, type ScenePoint } from "./projectile-model";

const GRAVITY = 9.81;

export function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function formatAngle(angle: number) {
  return `${Math.round(angle)}°`;
}

export function formatDistance(value: number) {
  const rounded = value >= 10 ? value.toFixed(0) : value.toFixed(1);
  return `${rounded} m`;
}

export function formatSpeed(value: number) {
  return `${value.toFixed(1)} m/s`;
}

export function formatTime(value: number) {
  return `${value.toFixed(2)} s`;
}

export function pointsToPath(points: ScenePoint[]) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
}

export function buildTrajectoryPoints({
  angle,
  velocity,
  launchHeight = 0.42,
  sampleCount = 26,
  targetAngle,
}: {
  angle: number;
  velocity: number;
  launchHeight?: number;
  sampleCount?: number;
  targetAngle?: number;
}) {
  const actualRadians = degToRad(angle);
  const targetRadians = degToRad(targetAngle ?? angle);
  const actualVx = velocity * Math.cos(actualRadians);
  const actualVy = velocity * Math.sin(actualRadians);
  const targetVx = velocity * Math.cos(targetRadians);
  const targetVy = velocity * Math.sin(targetRadians);

  const solveFlightTime = (vy: number) => {
    const discriminant = vy * vy + 2 * GRAVITY * launchHeight;
    return (vy + Math.sqrt(Math.max(discriminant, 0))) / GRAVITY;
  };

  const actualFlightTime = solveFlightTime(actualVy);
  const theoryFlightTime = solveFlightTime(targetVy);
  const actualRange = actualVx * actualFlightTime;
  const theoryRange = targetVx * theoryFlightTime;
  const actualMaxHeight = launchHeight + (actualVy * actualVy) / (2 * GRAVITY);
  const theoryMaxHeight = launchHeight + (targetVy * targetVy) / (2 * GRAVITY);
  const maxRange = Math.max(actualRange, theoryRange, 0.01);
  const maxHeight = Math.max(actualMaxHeight, theoryMaxHeight, launchHeight + 0.25);
  const xScale = (SCENE.rightX - SCENE.baseX) / maxRange;
  const yScale = (SCENE.baseY - SCENE.topY) / maxHeight;

  const mapPoint = (x: number, y: number): ScenePoint => ({
    x: SCENE.baseX + x * xScale,
    y: SCENE.baseY - y * yScale,
  });

  const sampleAt = (elapsed: number, currentVx: number, currentVy: number) => {
    const x = currentVx * elapsed;
    const y = Math.max(0, launchHeight + currentVy * elapsed - 0.5 * GRAVITY * elapsed * elapsed);
    return mapPoint(x, y);
  };

  const actualTrajectory: ScenePoint[] = [];
  const theoryTrajectory: ScenePoint[] = [];

  for (let index = 0; index <= sampleCount; index += 1) {
    const actualT = (actualFlightTime * index) / sampleCount;
    const theoryT = (theoryFlightTime * index) / sampleCount;
    actualTrajectory.push(sampleAt(actualT, actualVx, actualVy));
    theoryTrajectory.push(sampleAt(theoryT, targetVx, targetVy));
  }

  const samples = [0.08, 0.3, 0.5, 0.7, 0.92].map((progress, index) => {
    const time = actualFlightTime * progress;
    const x = actualVx * time;
    const y = Math.max(0, launchHeight + actualVy * time - 0.5 * GRAVITY * time * time);
    return {
      id: `sample-${index}`,
      time,
      progress: Math.round(progress * 100),
      angle,
      speed: velocity,
      height: y,
      range: x,
      point: mapPoint(x, y),
    };
  });

  return {
    actualTrajectory,
    theoryTrajectory,
    actualPath: pointsToPath(actualTrajectory),
    theoryPath: pointsToPath(theoryTrajectory),
    actualFlightTime,
    actualRange,
    actualMaxHeight,
    theoryRange,
    theoryMaxHeight,
    samples,
  };
}

