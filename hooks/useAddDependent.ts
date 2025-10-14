import { dtoUpdateDependent } from "@/models/auth/dtoUser";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { createDependent } from "@/api/dependent";
export const useAddDependent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dependent: dtoUpdateDependent) => createDependent(dependent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dependent"] });
        },
        onError: (error) => {
            console.error("Error adding dependent:", error);
        },
    });
};