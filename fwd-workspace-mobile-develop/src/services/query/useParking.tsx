import {useMutation, useQuery, useQueryClient} from 'react-query';
import _ from 'lodash';

import {
  basePath,
  IRequestConfig,
  axios,
  getConfigs,
  ParkingService,
  ParkingSlotListResponse,
  PostParkingRequest,
  PostParkingReservationRequest,
  PutParkingReservationRequest,
  ParkingSlotForTransferModel,
} from '../api/api.service';
import {QueryKeys} from './config';

/**
 * `convertToParam` not applicable to nested object
 */
const convertToParam = (data: any): string => {
  let dataString = '';

  if (data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];

        if (dataString.length > 0) {
          dataString += '&';
        }

        if (Array.isArray(value)) {
          let arrayValue = '';
          value.forEach((item, index) => {
            if (index > 0) {
              arrayValue += '&';
            }
            arrayValue += `${key}=${item}`;
          });

          dataString += arrayValue;
        } else {
          dataString += `${key}=${value}`;
        }
      }
    }
  }

  return dataString;
};

export const useGetParkingSlots = (requestedDates: string[]) => {
  const dates = requestedDates.reduce(
    (res, current) => _.assign(res, {[current]: current}),
    {},
  );

  /**
   * DISCLAIMER
   *
   * we have used this approach for now because the swagger
   * generated service for API cannot properly handle an
   * array of params.
   *
   * should be properly updated in the future.
   * 13DEC2021
   */
  let url =
    basePath +
    '/api/Parking/GetParkingSlots?' +
    convertToParam({requestedDates});

  const configs: IRequestConfig = getConfigs(
    'get',
    'application/json',
    url,
    {},
  );

  return useQuery<ParkingSlotListResponse>(
    [QueryKeys.GET_PARKING_SLOTS, dates],
    // the generate swagger script can't handle array params properly
    // () => ParkingService.getParkingSlots({requestedDates}),
    () =>
      new Promise((resolve, reject) => {
        axios(configs, resolve, reject);
      }),
    {enabled: requestedDates.length > 0},
  );
};

export const useGetParkingFloors = () => {
  return useQuery([QueryKeys.GET_PARKING_FLOORS], () =>
    ParkingService.getParkingFloors(),
  );
};

export const useGetUpcomingParkingReservations = () => {
  return useQuery([QueryKeys.GET_UPCOMING_PARKING_RESERVATIONS], () =>
    ParkingService.upcomingReservations(),
  );
};

export const useUpcomingUnscheduledParkingDates = () => {
  return useQuery([QueryKeys.GET_UPCOMING_UNSCHED_PARKING_DATES], () =>
    ParkingService.upcomingUnscheduledParkingDates(),
  );
};

export const useGetMonthParkingPenalty = () => {
  return useQuery([QueryKeys.GET_MONTH_PARKING_PENALTIES], () =>
    ParkingService.getCurrentMonthParkingPenalties(),
  );
};

export const useGetEmployeesForTransferParkingSlot = (reqBody: {
  employeeName: string;
}) => {
  return useQuery(
    [QueryKeys.GET_EMPLOYEES_FOR_TRANSFER_PARKING_SLOT, reqBody],
    () => ParkingService.getEmployeesForTransferParkingSlot(reqBody),
  );
};

export const useReserveParking = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [QueryKeys.RESERVE_PARKING],
    (reqBody: PostParkingReservationRequest[]) =>
      ParkingService.reserveParking({body: reqBody}),
    {
      onSuccess: () => {
        queryClient.refetchQueries([
          QueryKeys.GET_UPCOMING_UNSCHED_PARKING_DATES,
        ]);
        queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
      },
    },
  );
};

export const useChangePSReservation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [QueryKeys.CHANGE_PS_RESERVATION],
    ({
      planScheduleDatesId,
      body,
    }: {
      planScheduleDatesId: number;
      body: PutParkingReservationRequest;
    }) =>
      ParkingService.changeParkingReservation({
        planScheduleDatesId,
        body,
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries([
          QueryKeys.GET_UPCOMING_PARKING_RESERVATIONS,
        ]);
        queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
      },
    },
  );
};

export const useCancelPSReservation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [QueryKeys.CANCEL_PS_RESERVATION],
    (planScheduleDatesId: number) =>
      ParkingService.cancelParkingReservation({planScheduleDatesId}),
    {
      onSuccess: () => {
        queryClient.refetchQueries([
          QueryKeys.GET_UPCOMING_UNSCHED_PARKING_DATES,
        ]);
        queryClient.refetchQueries([
          QueryKeys.GET_UPCOMING_PARKING_RESERVATIONS,
        ]);
        queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
      },
      retry: false,
    },
  );
};

export const useAddParkingSlots = () => {
  return useMutation(
    [QueryKeys.ADD_PARKING_SLOTS],
    (reqBody: PostParkingRequest) =>
      ParkingService.addParkingSlots({
        body: reqBody,
      }),
  );
};

export const useTransferParkingSlotToEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [QueryKeys.TRANSFER_PARKING_SLOT],
    (reqBody: ParkingSlotForTransferModel[]) =>
      ParkingService.setParkingSlotTransfer({
        body: reqBody,
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
      },
    },
  );
};
