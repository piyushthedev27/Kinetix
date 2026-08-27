import type { ProjectileExperiment } from "@/lib/physics/projectile-model";

export type ExplanationRequest = {
  experimentId: string;
  angle: number;
  velocity: number;
  range: number;
  maxHeight: number;
  flightTime: number;
  targetAngle: number;
  previousRange?: number;
};

export type ExplanationResponse = {
  headline: string;
  body: string;
  insight: string;
  provider: "development-fallback" | "groq";
};

export function toExplanationRequest(experiment: ProjectileExperiment, previousRange?: number): ExplanationRequest {
  return {
    experimentId: experiment.id,
    angle: experiment.angle,
    velocity: experiment.velocity,
    range: experiment.range,
    maxHeight: experiment.maxHeight,
    flightTime: experiment.flightTime,
    targetAngle: experiment.targetAngle,
    previousRange,
  };
}

/** Safe local fallback. A server-only Groq adapter can satisfy the same contract later. */
export function createDevelopmentExplanation(request: ExplanationRequest): ExplanationResponse {
  const delta = request.angle - request.targetAngle;
  const direction = delta < 0 ? "lower" : delta > 0 ? "higher" : "on target";
  const comparison = request.previousRange
    ? ` Your latest range is ${Math.abs(request.range - request.previousRange).toFixed(1)} m ${request.range >= request.previousRange ? "longer" : "shorter"} than the previous attempt.`
    : "";

  return {
    headline: `Your launch angle was ${Math.round(request.angle)}°`,
    body: `The ${Math.abs(Math.round(delta))}° difference from the ${Math.round(request.targetAngle)}° reference made the launch ${direction}. That changed the balance between upward and forward velocity, producing a ${request.range.toFixed(1)} m range.${comparison}`,
    insight: `Try a launch closer to ${Math.round(request.targetAngle)}° and compare the replay again.`,
    provider: "development-fallback",
  };
}
