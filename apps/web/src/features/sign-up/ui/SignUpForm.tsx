"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/shared/api";
import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldTitle,
  Input,
  Spinner,
} from "@/shared/ui";
import { signUpSchema } from "../model/schema";

type FieldErrors = { name?: string; email?: string; password?: string };

export function SignUpForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = signUpSchema.safeParse(raw);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setServerError(null);
    setIsPending(true);

    try {
      const { error } = await authClient.signUp.email({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        if (error.status === 422 || error.message?.includes("already")) {
          setServerError("이미 사용 중인 이메일입니다.");
        } else {
          setServerError("계정 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setServerError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field data-invalid={fieldErrors.name ? "true" : undefined}>
          <FieldTitle>이름</FieldTitle>
          <Input
            type="text"
            name="name"
            placeholder="홍길동"
            autoComplete="name"
            aria-invalid={!!fieldErrors.name}
            disabled={isPending}
          />
          {fieldErrors.name && <FieldError>{fieldErrors.name}</FieldError>}
        </Field>

        <Field data-invalid={fieldErrors.email ? "true" : undefined}>
          <FieldTitle>이메일</FieldTitle>
          <Input
            type="email"
            name="email"
            placeholder="name@company.com"
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
            disabled={isPending}
          />
          {fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}
        </Field>

        <Field data-invalid={fieldErrors.password ? "true" : undefined}>
          <FieldTitle>비밀번호</FieldTitle>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!!fieldErrors.password}
            disabled={isPending}
          />
          {fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full mt-1" size="lg" disabled={isPending}>
        {isPending && <Spinner className="mr-1.5" />}
        {isPending ? "계정 생성 중..." : "계정 만들기"}
      </Button>
    </form>
  );
}
