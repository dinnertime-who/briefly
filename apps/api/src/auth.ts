import { authConfig, betterAuth, drizzleAdapter } from "@briefly/auth";
import { createDbClient } from "@briefly/db";

const db = createDbClient(process.env.DATABASE_URL!);

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  trustedOrigins: [process.env.WEB_URL ?? "http://localhost:3000"],
  ...authConfig,
});
