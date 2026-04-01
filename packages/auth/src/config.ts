import { hash, type Options, verify } from "@node-rs/argon2";
import type { BetterAuthOptions } from "better-auth";
import { authPlugins } from "./plugin";

const ARGON2_OPTIONS: Options = {
  algorithm: 2, // Argon2id
  memoryCost: 65536, // 64MB (2^16 KiB)
  timeCost: 3, // 반복 횟수
  parallelism: 1, // 병렬 스레드 수
};

export const authConfig: BetterAuthOptions = {
  emailAndPassword: {
    enabled: true, //
    requireEmailVerification: true,
    password: {
      hash: (password) => hash(password, ARGON2_OPTIONS),
      verify: ({ password, hash: storedHash }) => verify(storedHash, password),
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: authPlugins,
  hooks: {},
};
