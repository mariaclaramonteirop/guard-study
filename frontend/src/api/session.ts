const SESSION_KEY = 'guard-study-session';

export type SessionUser = {
  id: number;
  role: string;
  name: string;
};

export function getSessionUser(): SessionUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<SessionUser>;
    if (parsed.id === undefined || parsed.name === undefined || parsed.role === undefined) {
      return null;
    }

    return {
      id: Number(parsed.id),
      role: String(parsed.role),
      name: String(parsed.name),
    };
  } catch {
    return null;
  }
}

export function setSessionUser(user: SessionUser): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSessionUser(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}
