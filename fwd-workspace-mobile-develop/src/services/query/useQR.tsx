import {useMutation, useQuery, useQueryClient} from 'react-query';
import {QueryKeys} from './config';

import {QrService, PostQRRequest} from '../api/api.service';

export const useQRCheckInOut = () => {
  const queryClient = useQueryClient();

  return useMutation(
    [QueryKeys.QR_CHECK_IN_OUT],
    (body: PostQRRequest) => QrService.toggleCheckInStatus({body}),
    {
      retry: false,
      onSuccess: () => {
        queryClient.refetchQueries([QueryKeys.QR_CHECK_IN_OUT_STATUS]);
        queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
      },
    },
  );
};

export const useGetQRCheckInStatus = () => {
  return useQuery([QueryKeys.QR_CHECK_IN_OUT_STATUS], () =>
    QrService.getCurrentCheckInStatus(),
  );
};
