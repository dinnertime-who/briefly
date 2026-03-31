import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일 주소를 입력해주세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
