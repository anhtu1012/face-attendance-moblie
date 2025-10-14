import { updateDependent } from "@/api/dependent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dtoUpdateDependent } from "@/models/auth/dtoUser";

export const useUpdateDependent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dependent: dtoUpdateDependent) => updateDependent(dependent.dpId, dependent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dependent"] });
        },
        onError: (error) => {
            console.error("Error updating dependent:", error);
        },
    });
};