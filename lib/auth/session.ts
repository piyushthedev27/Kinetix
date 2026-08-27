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

/** Client adapter boundary for a future identity provider. It never stores secrets. */
export const developmentSession = {
  user: { id: "student-001", name: "Alex", email: "alex@example.com" } satisfies KinetixUser,
};
