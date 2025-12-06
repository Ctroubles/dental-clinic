"use client"

import { useEffect } from "react"
import {
  FetchQueryOptions,
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "./errors"

export function makeQuery<
  TParams = void,
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = unknown[],
>(
  opts:
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    | ((
        params: TParams
      ) => UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>)
): {
  useHook: (
    ...args: TParams extends void | undefined
      ? [
          params?: TParams,
          options?: Partial<
            Omit<
              UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
              "queryKey" | "queryFn"
            >
          >,
        ]
      : [
          params: TParams,
          options?: Partial<
            Omit<
              UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
              "queryKey" | "queryFn"
            >
          >,
        ]
  ) => UseQueryResult<TData, TError>
} {
  const useHook = (
    ...args: TParams extends void | undefined
      ? [
          params?: TParams,
          options?: Partial<
            Omit<
              UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
              "queryKey" | "queryFn"
            >
          >,
        ]
      : [
          params: TParams,
          options?: Partial<
            Omit<
              UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
              "queryKey" | "queryFn"
            >
          >,
        ]
  ) => {
    const [params, options] = args
    const baseOpts = typeof opts === "function" ? opts(params as TParams) : opts
    const result = useQuery<TQueryFnData, TError, TData, TQueryKey>({
      ...{
        ...baseOpts,
      },
      ...options,
    })

    useEffect(() => {
      if (result.isError) {
        toast.error("Error", {
          description:
            result.error instanceof ApiError
              ? result.error.message
              : "Unknown error",
        })
      }
    }, [result.error, result.isError])

    return result
  }

  return { useHook }
}

export function makeMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
  TParams = void,
>(
  opts:
    | UseMutationOptions<TData, TError, TVariables, TContext>
    | ((
        params: TParams
      ) => UseMutationOptions<TData, TError, TVariables, TContext>)
): {
  useMut: (
    params: TParams,
    options?: Partial<
      Omit<
        UseMutationOptions<TData, TError, TVariables, TContext>,
        "mutationFn"
      >
    >
  ) => ReturnType<typeof useMutation<TData, TError, TVariables, TContext>>
} {
  const useMut = (
    params: TParams,
    options?: Partial<
      Omit<
        UseMutationOptions<TData, TError, TVariables, TContext>,
        "mutationFn"
      >
    >
  ) => {
    const baseOpts = typeof opts === "function" ? opts(params) : opts
    const result = useMutation<TData, TError, TVariables, TContext>({
      ...{
        onError: error => {
          toast.error("Error", {
            description:
              error instanceof Error ? error.message : "Unknown error",
          })
        },
        ...baseOpts,
      },
      ...options,
    })

    return result
  }
  return { useMut }
}

export function makePrefetch<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = unknown[],
  TParams = void,
>(
  opts:
    | FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    | ((
        params: TParams
      ) => FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>)
): (
  qc: QueryClient,
  params: TParams,
  options?: Partial<
    Omit<
      FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
      "queryKey" | "queryFn"
    >
  >
) => Promise<void> {
  const prefetch = (
    qc: QueryClient,
    params: TParams,
    options?: Partial<
      Omit<
        FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "queryKey" | "queryFn"
      >
    >
  ) => {
    const baseOpts = typeof opts === "function" ? opts(params) : opts
    return qc.prefetchQuery<TQueryFnData, TError, TData, TQueryKey>({
      ...{
        ...baseOpts,
      },
      ...options,
    })
  }

  return prefetch
}
