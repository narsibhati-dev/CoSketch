import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRooms, createRoom, deleteLeaveRoom } from '@/api/room';

export interface RoomData {
  roomId: string;
  slug: string;
  createdAt: string;
  participants: string[];
  noOfParticipants: number;
}

export interface RoomResponse {
  success: boolean;
  message: string;
  data: {
    // userId: string;
    userName: string;
    rooms: RoomData[];
  };
}

// Hook for fetching and managing rooms
export const useRooms = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching, isError, error } = useQuery<
    RoomResponse,
    Error
  >({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: Infinity, // Disable automatic refetching once data is fetched
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnReconnect: false, // Prevent refetch on reconnect
    refetchOnMount: false, // Prevent refetch on mount
    enabled: true,
  });

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      refetch(); // Trigger refetch after mutation success
    },
    onError: err => {
      console.error('Error creating room:', err);
    },
  });

  const deleteLeaveRoomMutation = useMutation({
    mutationFn: deleteLeaveRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      refetch(); // Trigger refetch after mutation success
    },
    onError: err => {
      console.error('Error leaving room:', err);
    },
  });

  return {
    // userId: data?.data.userId ?? '',
    userName: data?.data.userName ?? '',
    rooms: data?.data.rooms ?? [],
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    createRoom: createRoomMutation.mutateAsync,
    leaveRoom: deleteLeaveRoomMutation.mutateAsync,
  };
};
