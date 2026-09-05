const STORAGE_KEY = "kx-experiment-visits";
const MAX_VISITS = 20;

export interface ExperimentVisit {
  id: string;
  slug: string;
  title: string;
  grade: string;
  visitedAt: string;
}

function readAll(): ExperimentVisit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(visits: ExperimentVisit[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — visits just won't persist
  }
}

export function recordVisit(entry: Omit<ExperimentVisit, "visitedAt">) {
  const visits = readAll().filter((v) => v.id !== entry.id);
  visits.unshift({ ...entry, visitedAt: new Date().toISOString() });
  writeAll(visits.slice(0, MAX_VISITS));
}

export function getVisits(limit?: number): ExperimentVisit[] {
  const visits = readAll();
  return typeof limit === "number" ? visits.slice(0, limit) : visits;
}

export function getVisitedTopicIds(): Set<string> {
  return new Set(readAll().map((v) => v.id));
}

export function clearVisits() {
  writeAll([]);
}
