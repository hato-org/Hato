import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useClient } from "../../modules/client";

export const useApi = <
TQueryFnData = unknown,
TError = unknown,
TData = TQueryFnData,
TQueryKey extends [string, Record<string, unknown>] = [string, Record<string, unknown>]
>(
  queryKey: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError, TQueryFnData, TQueryKey>, "queryKey">
) => {
  const { client } = useClient();

  return useQuery<TData, TError, TQueryFnData, TQueryKey>(queryKey, async () => {
    return (
      (await client.get<TData>(queryKey[0], { params: queryKey[1] })).data
			);
		},
		{ ...options }
	);
};
