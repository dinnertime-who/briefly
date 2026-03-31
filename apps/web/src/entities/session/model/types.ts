import type { AuthInfer } from "@/shared/api";

export type Session = AuthInfer["Session"];
export type SessionUser = AuthInfer["Session"]["user"];
