import { authConfig, betterAuth, drizzleAdapter } from "@briefly/auth";
import { sendVerificationEmail } from "@briefly/email";
import { createDbClient } from "@briefly/db";

const db = createDbClient(process.env.DATABASE_URL!);

const emailConfig = {
  apiKey: process.env.RESEND_API_KEY!,
  from: process.env.EMAIL_FROM ?? "Briefly <noreply@mail.briefly.com>",
};

export const auth = betterAuth({
  ...authConfig,
  database: drizzleAdapter(db, { provider: "pg" }),
  trustedOrigins: [process.env.WEB_URL ?? "http://localhost:3000"],
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(emailConfig, {
        to: user.email,
        username: user.name ?? user.email,
        verificationUrl: url,
      });
    },
  },
});
