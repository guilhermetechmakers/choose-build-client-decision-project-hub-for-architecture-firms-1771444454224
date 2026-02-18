import { api, type ApiError } from "@/lib/api";

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupPayload {
  email: string;
  password: string;
  name?: string;
  companyName?: string;
  adminContact?: string;
}

export interface InviteTokenPayload {
  token: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  user?: { id: string; email: string; name?: string };
}

/** Login with email/password; backend may set secure cookies for refresh. */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  return api.post<AuthSession>("/auth/login", credentials);
}

/** Sign up (firm or individual); triggers email verification when applicable. */
export async function signup(payload: SignupPayload): Promise<AuthSession> {
  return api.post<AuthSession>("/auth/signup", payload);
}

/** Validate invite token and return session or redirect URL (client invite flow). */
export async function redeemInviteToken(payload: InviteTokenPayload): Promise<{ valid: boolean; redirect?: string; session?: AuthSession }> {
  return api.post("/auth/invite/redeem", payload);
}

/** Optional: list sessions (requires auth). */
export async function listSessions(): Promise<{ sessions: unknown[] }> {
  return api.get("/auth/sessions");
}

/** Optional: revoke a session (requires auth). */
export async function revokeSession(sessionId: string): Promise<void> {
  return api.delete(`/auth/sessions/${sessionId}`);
}

export type { ApiError };
