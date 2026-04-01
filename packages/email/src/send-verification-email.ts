import { render } from "@react-email/render";
import { createElement } from "react";
import { createResendClient } from "./resend";
import { VerifyEmail } from "./templates";

export type EmailConfig = {
  apiKey: string;
  from: string;
};

export type SendVerificationEmailOptions = {
  to: string;
  username: string;
  verificationUrl: string;
};

export async function sendVerificationEmail(config: EmailConfig, options: SendVerificationEmailOptions) {
  const resend = createResendClient(config.apiKey);
  const html = await render(
    createElement(VerifyEmail, {
      username: options.username,
      verificationUrl: options.verificationUrl,
    }),
  );

  await resend.emails.send({
    from: config.from,
    to: options.to,
    subject: "이메일 주소를 인증해주세요",
    html,
  });
}
