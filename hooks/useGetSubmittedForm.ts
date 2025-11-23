import { dtoSubmittedForm } from "@/models/form/dtoSubmittedForm";
import { getSubmittedForm } from "@/services/form/api";
import { useQuery } from "@tanstack/react-query";

interface UseGetSubmittedFormParams {
  userId: string;
  offset?: number;
  limit?: number;
  enabled?: boolean;
}

export const useGetSubmittedForm = ({
  userId,
  offset,
  limit,
  enabled = true,
}: UseGetSubmittedFormParams) => {
  const { data, isLoading, error, refetch, isFetching } =
    useQuery<dtoSubmittedForm>({
      queryKey: ["submittedForm", userId],
      queryFn: async () => {
        const res = await getSubmittedForm(userId, offset, limit);
        return res.data;
      },
      enabled: enabled && !!userId,
      // staleTime: Infinity,
    });

  return {
    submittedFormListData: data,
    isLoading,
    submittedFormError: error,
    refetch,
    isFetching,
  };
};
