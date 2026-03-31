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
import { signInSchema } from "../model/schema";

type FieldErrors = { email?: string; password?: string };

export function SignInForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = signInSchema.safeParse(raw);
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
      const { error } = await authClient.signIn.email({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        setServerError("이메일 또는 비밀번호가 올바르지 않습니다.");
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
            autoComplete="current-password"
            aria-invalid={!!fieldErrors.password}
            disabled={isPending}
          />
          {fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full mt-1" size="lg" disabled={isPending}>
        {isPending && <Spinner className="mr-1.5" />}
        {isPending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
