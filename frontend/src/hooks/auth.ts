"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { me, type CurrentUser } from "@/lib/auth";
import { qk } from "@/lib/queryKeys";

export function useMe(): UseQueryResult<CurrentUser> {
  return useQuery({
    queryKey: qk.me,
    queryFn: me,
    staleTime: 60_000,
  });
}
