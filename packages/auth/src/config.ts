import type { BetterAuthOptions } from "better-auth";
import { authPlugins } from "./plugin";

export const authConfig: BetterAuthOptions = {
  emailAndPassword: { enabled: true },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: authPlugins,
  hooks: {},
};
