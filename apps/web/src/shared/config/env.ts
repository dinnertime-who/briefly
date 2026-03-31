export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
} as const;
