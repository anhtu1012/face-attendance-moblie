import { dtoSubmittedForm } from "@/models/form/dtoSubmittedForm";
import { getSubmittedForm } from "@/services/form/api";
import { useQuery } from "@tanstack/react-query";

interface UseGetSubmittedFormParams {
  userId: string;
  enabled?: boolean;
}

export const useGetSubmittedForm = ({
  userId,
  enabled = true,
}: UseGetSubmittedFormParams) => {
  const { data, isLoading, error, refetch, isFetching } =
    useQuery<dtoSubmittedForm>({
      queryKey: ["submittedForm", userId],
      queryFn: async () => {
        const res = await getSubmittedForm(userId);
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
