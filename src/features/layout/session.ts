import type { AdminUser, UserRole } from "@/types/layout";

export const AUTH_STAGE_KEY = "xperp-mock-auth-stage";
export const AUTH_AUTHENTICATED_KEY = "xperp-mock-authenticated";
export const AUTH_USER_KEY = "xperp-mock-auth-user";
export const AUTH_PROFILE_KEY = "xperp-mock-auth-profile";
export const AUTH_OTP_FAILURES_KEY = "xperp-mock-otp-failures";
export const AUTH_OTP_LOCKED_KEY = "xperp-mock-otp-locked";

export type AuthProfile = AdminUser & {
  userId: string;
};

export const DEFAULT_AUTH_PROFILE: AuthProfile = {
  userId: "chat1004",
  id: "chat1004",
  name: "박운영",
  role: "MASTER",
  department: "운영 관리자"
};

const MOCK_AUTH_USERS: Record<string, AuthProfile> = {
  test0000: DEFAULT_AUTH_PROFILE,
  test1111: {
    userId: "test1111",
    id: "op2031",
    name: "김운영",
    role: "OPERATOR",
    department: "운영 담당"
  }
};

const parseProfile = (value: string | null): AuthProfile | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<AuthProfile>;
    if (!parsed.userId || !parsed.id || !parsed.name || !parsed.role || !parsed.department) {
      return null;
    }

    return parsed as AuthProfile;
  } catch {
    return null;
  }
};

export const resolveMockAuthProfile = (userId: string): AuthProfile => {
  return MOCK_AUTH_USERS[userId] ?? DEFAULT_AUTH_PROFILE;
};

export const readStoredAuthProfile = (): AuthProfile => {
  if (typeof window === "undefined") {
    return DEFAULT_AUTH_PROFILE;
  }

  const sessionProfile = parseProfile(window.sessionStorage.getItem(AUTH_PROFILE_KEY));
  if (sessionProfile) return sessionProfile;

  const localProfile = parseProfile(window.localStorage.getItem(AUTH_PROFILE_KEY));
  if (localProfile) return localProfile;

  const userId = window.sessionStorage.getItem(AUTH_USER_KEY) ?? window.localStorage.getItem(AUTH_USER_KEY) ?? "";
  return resolveMockAuthProfile(userId);
};

export const storeAuthProfile = (profile: AuthProfile, remember: boolean) => {
  if (typeof window === "undefined") return;

  const serialized = JSON.stringify(profile);
  window.sessionStorage.setItem(AUTH_PROFILE_KEY, serialized);

  if (remember) {
    window.localStorage.setItem(AUTH_PROFILE_KEY, serialized);
  } else {
    window.localStorage.removeItem(AUTH_PROFILE_KEY);
  }
};

export const clearAuthProfile = () => {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(AUTH_PROFILE_KEY);
  window.localStorage.removeItem(AUTH_PROFILE_KEY);
};

export const getAllowedRoles = (role: UserRole) => role;
