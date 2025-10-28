import { updateDependent } from "@/api/dependent";
import { dtoDependent } from "@/models/auth/dtoUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateDependent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dependent: dtoDependent) => updateDependent(dependent),
        onSuccess: (_, dependent) => {
            queryClient.invalidateQueries({ queryKey: ["dependents", dependent.dpUserId] });
        },
        onError: (error) => {
            console.error("Error updating dependent:", error);
        },
    });
};