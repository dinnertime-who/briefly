import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Text } from "@react-email/components";

export type VerifyEmailProps = {
  username: string;
  verificationUrl: string;
};

export function VerifyEmail({ username, verificationUrl }: VerifyEmailProps) {
  return (
    <Html lang="ko">
      <Head />
      <Preview>Briefly 이메일 주소를 인증해주세요</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>이메일 주소 인증</Heading>
          <Text style={paragraph}>안녕하세요, {username}님!</Text>
          <Text style={paragraph}>
            Briefly에 가입해주셔서 감사합니다. 아래 버튼을 클릭하여 이메일 주소를 인증해주세요.
          </Text>
          <Button style={button} href={verificationUrl}>
            이메일 인증하기
          </Button>
          <Text style={hint}>버튼이 작동하지 않는 경우 아래 링크를 브라우저에 직접 붙여넣으세요.</Text>
          <Text style={link}>{verificationUrl}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            이 이메일은 Briefly 회원가입 시 자동으로 발송됩니다. 본인이 요청하지 않은 경우 이 이메일을 무시하셔도
            됩니다.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "40px",
  borderRadius: "8px",
  maxWidth: "600px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 24px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#444444",
  margin: "0 0 16px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "24px 0",
};

const hint = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#888888",
  margin: "16px 0 4px",
};

const link = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#666666",
  wordBreak: "break-all" as const,
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "24px 0",
};

const footer = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "#aaaaaa",
  margin: "0",
};
