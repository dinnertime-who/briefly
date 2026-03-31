import { createDbClient } from "@briefly/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const db = createDbClient(process.env.DATABASE_URL!);

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  trustedOrigins: [process.env.WEB_URL ?? "http://localhost:3000"],
  emailAndPassword: { enabled: true },
  advanced: {
    database: {
      generateId: false,
    },
  },
  hooks: {}, // @Hook 데코레이터 사용을 위한 최소 설정
});
