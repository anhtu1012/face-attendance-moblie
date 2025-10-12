
import { RootState } from '@/lib/store';
import { getUserById } from '@/api/user';
import { dtoGetUser } from '@/models/auth/dtoUser';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

export const useGetUserProfile = () => {
  const userId = useSelector((state: RootState) => state.auth.userProfile.id);
  const { data, isLoading, error, refetch } = useQuery<dtoGetUser>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId || ""),
    enabled: !!userId,
    staleTime: 0,        
    gcTime: 0,       
    refetchOnMount: true, 
    refetchOnWindowFocus: true,
  });
  
  return {
    userProfile: data,
    isLoading,
    error,
    refetch,
    userId,
  };
};