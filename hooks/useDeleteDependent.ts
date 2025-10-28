import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDependent } from "@/api/dependent";

export const useDeleteDependent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dpId: string) => deleteDependent(dpId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dependent"] });
        },
        onError: (error) => {
            console.error("Error deleting dependent:", error);
        },
    });
};
