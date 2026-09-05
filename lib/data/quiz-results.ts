const STORAGE_KEY = "kx-quiz-results";
const MAX_RESULTS = 50;

export interface QuizResult {
  topicId: string;
  slug: string;
  title: string;
  score: number;
  total: number;
  takenAt: string;
}

function readAll(): QuizResult[] {
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

function writeAll(results: QuizResult[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — results just won't persist
  }
}

export function recordQuizResult(entry: Omit<QuizResult, "takenAt">) {
  const results = readAll();
  results.unshift({ ...entry, takenAt: new Date().toISOString() });
  writeAll(results.slice(0, MAX_RESULTS));
}

export function getQuizResults(limit?: number): QuizResult[] {
  const results = readAll();
  return typeof limit === "number" ? results.slice(0, limit) : results;
}

export function getBestScore(topicId: string): QuizResult | null {
  const attempts = readAll().filter((r) => r.topicId === topicId);
  if (attempts.length === 0) return null;
  return attempts.reduce((best, r) => (r.score / r.total > best.score / best.total ? r : best), attempts[0]);
}

export function clearQuizResults() {
  writeAll([]);
}
