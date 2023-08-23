import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';

import {InAppNotificationService} from '../api/api.service';
import {QueryKeys} from './config';

export interface TPaginationParam {
  pageSize?: number;
  pageNumber?: number;
}

export const useGetNotificationList = (params?: TPaginationParam) => {
  return useInfiniteQuery(
    [QueryKeys.GET_NOTIFICATION_LIST],
    async content => {
      const result = await InAppNotificationService.getInAppNotifications({
        ...(params || {}),
        pageNumber: content.pageParam || 0,
      });

      return {
        data: result.data,
        pageParams: {
          pageSize: result.pageSize,
          pageNumber: result.pageNumber,
        },
        nextPageNumber: (result.pageNumber || 0) + 1,
      };
    },
    {
      getNextPageParam: lastPage => {
        if (lastPage.data && lastPage.data?.length > 0) {
          return lastPage.nextPageNumber;
        } else {
          return undefined;
        }
      },
    },
  );
};

export const useGetNotificationStatus = () => {
  return useQuery([QueryKeys.GET_NOTIFICATION_STATUS], () =>
    InAppNotificationService.getNotificationsCount(),
  );
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation(
    [QueryKeys.READ_NOTIFICATION],
    (notificationIds: number[]) =>
      InAppNotificationService.setNotificationsAsRead({
        body: notificationIds,
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries([QueryKeys.GET_NOTIFICATION_LIST]);
        queryClient.refetchQueries([QueryKeys.GET_NOTIFICATION_STATUS]);
      },
    },
  );
};

export const useMarkAllAsReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation(
    [QueryKeys.MARK_ALL_AS_READ_NOTIFICATION],
    () => InAppNotificationService.markAllNotificationsAsRead(),
    {
      onSuccess: () => {
        queryClient.refetchQueries([QueryKeys.GET_NOTIFICATION_LIST]);
        queryClient.refetchQueries([QueryKeys.GET_NOTIFICATION_STATUS]);
      },
    },
  );
};
