import type { BetterAuthPlugin } from "better-auth";
import { admin } from "better-auth/plugins";

export const authPlugins: BetterAuthPlugin[] = [
  admin(), //
];
