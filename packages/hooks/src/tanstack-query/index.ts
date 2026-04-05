export { getQueryClient } from "./client";
export { TanstackQueryProvider } from "./provider";

// Hooks
export {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";

// Types — useQuery
export type {
  UseQueryOptions,
  UseQueryResult,
  DefinedUseQueryResult,
} from "@tanstack/react-query";

// Types — useInfiniteQuery
export type {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  DefinedUseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";

// Types — useMutation
export type {
  UseMutationOptions,
  UseMutationResult,
  MutationFunction,
  MutateFunction,
  MutateOptions,
  UseMutateFunction,
} from "@tanstack/react-query";

// Types — useSuspenseQuery
export type {
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";

// Types — 공통
export type { QueryKey, QueryFunctionContext } from "@tanstack/react-query";

// Option factories
export { queryOptions, mutationOptions, infiniteQueryOptions } from "@tanstack/react-query";
