import { Geist } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/shared/api";

const geist = Geist({ subsets: ["latin"] });

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data } = await authClient.getSession({ fetchOptions: { headers: await headers() } });
  if (data?.session) redirect("/");

  return (
    <div className={`${geist.className} flex min-h-[100dvh]`}>
      {/* Left dark branding panel — hidden on mobile */}
      <aside
        className="hidden md:flex md:w-[45%] flex-col bg-zinc-950 relative overflow-hidden select-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgb(255 255 255 / 0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {/* Top: Logo */}
        <div className="px-10 pt-10">
          <div className="flex items-center gap-2">
            <BrieflyMark />
            <span className="text-white font-semibold tracking-tight text-sm">briefly</span>
          </div>
        </div>

        {/* Middle: Hero copy */}
        <div className="flex-1 flex flex-col justify-center px-10 py-12">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">Team Operations</p>
          <h1 className="text-2xl font-semibold text-white tracking-tight leading-snug mb-4">
            팀의 결정을
            <br />더 빠르게.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-[260px]">
            업무 현황을 실시간으로 파악하고, 팀원과 빠르게 협업하세요.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {["프로젝트 현황 한눈에 파악", "팀원 간 빠른 의사결정", "보고서 자동 생성 및 공유"].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <CheckIcon />
                <span className="text-xs text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: Testimonial */}
        <div className="px-10 pb-10">
          <div className="border-t border-white/8 pt-6">
            <blockquote className="text-xs text-zinc-400 leading-relaxed italic">
              &ldquo;Briefly 덕분에 주간 보고 준비 시간이 절반으로 줄었습니다.&rdquo;
            </blockquote>
            <p className="mt-2 text-xs text-zinc-600 not-italic">— 박재원, 클레어소프트 엔지니어링 팀장</p>
          </div>
        </div>
      </aside>

      {/* Right: Auth form panel */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background">
        {/* Mobile-only logo */}
        <div className="flex items-center gap-2 mb-8 md:hidden">
          <BrieflyMark dark />
          <span className="font-semibold tracking-tight text-sm text-foreground">briefly</span>
        </div>

        {children}
      </main>
    </div>
  );
}

function BrieflyMark({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        rx="4"
        fill={dark ? "oklch(0.205 0 0)" : "white"}
        stroke={dark ? "oklch(0.922 0 0)" : "white"}
        strokeWidth="1.5"
      />
      <path
        d="M6 7h8M6 10h5M6 13h7"
        stroke={dark ? "oklch(0.145 0 0)" : "oklch(0.205 0 0)"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="7" cy="7" r="6" stroke="oklch(0.439 0 0)" strokeWidth="1" />
      <path
        d="M4.5 7L6.5 9L9.5 5.5"
        stroke="oklch(0.708 0 0)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
