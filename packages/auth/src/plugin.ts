import type { BetterAuthPlugin } from "better-auth";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { admin, organization } from "better-auth/plugins";

export const authPlugins: BetterAuthPlugin[] = [
  admin(), //
  organization(),
];

export const authClientPlugins: BetterAuthPlugin[] = [
  adminClient(), //
  organizationClient(),
];
