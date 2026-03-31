import Link from "next/link";
import { SignInForm } from "@/features/sign-in";
import { ROUTES } from "@/shared/config";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui";

export function SignInView() {
  return (
    <div className="w-full max-w-[360px]">
      <Card className="shadow-none border-0 ring-1 ring-foreground/8">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold tracking-tight">다시 오셨군요</CardTitle>
          <CardDescription>이메일과 비밀번호로 로그인하세요</CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <SignInForm />
        </CardContent>

        <CardFooter className="border-t justify-center">
          <p className="text-xs text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
            >
              회원가입
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
