import { authClientPlugins, createAuthClientReact } from "@briefly/auth/client";

export const authClient = createAuthClientReact({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  plugins: authClientPlugins,
});
