import Link from "next/link";
import { SignUpForm } from "@/features/sign-up";
import { ROUTES } from "@/shared/config";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui";

export function SignUpView() {
  return (
    <div className="w-full max-w-[360px]">
      <Card className="shadow-none border-0 ring-1 ring-foreground/8">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold tracking-tight">계정 만들기</CardTitle>
          <CardDescription>팀에 합류해 업무를 함께 관리하세요</CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <SignUpForm />
        </CardContent>

        <CardFooter className="border-t justify-center">
          <p className="text-xs text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
            >
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
