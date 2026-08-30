export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

export type KinetixUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthState = {
  status: AuthStatus;
  user: KinetixUser | null;
  error?: string;
};

const TOKEN_KEY = "kinetix_auth_token";

/**
 * Stores the authentication token.
 * Note: This uses localStorage which is appropriate for a prototype.
 * A production version should move to httpOnly cookies to avoid XSS token theft.
 */
export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/** Client adapter boundary for a future identity provider. It never stores secrets. */
// Keeping developmentSession commented out for offline demo mode reference
// export const developmentSession = {
//   user: { id: "student-001", name: "Alex", email: "alex@example.com" } satisfies KinetixUser,
// };
