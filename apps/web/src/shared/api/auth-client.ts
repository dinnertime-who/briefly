import { authPlugins, createAuthClientReact } from "@briefly/auth";

export const authClient = createAuthClientReact({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  plugins: authPlugins,
});
