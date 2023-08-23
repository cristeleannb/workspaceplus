import {useMutation, useQuery, useQueryClient} from 'react-query';
import _ from 'lodash';

import {
  basePath,
  IRequestConfig,
  axios,
  getConfigs,
  WorkstationService,
  PostWorkstationReservationRequest,
  WorkstationListResponse,
  BranchService,
  BranchReservationService,
  PutWorkstationReservationRequest,
  EmployeeBranchReservationModelList,
  PutBranchReservationRequest,
} from '../api/api.service';
import {QueryKeys} from './config';

interface PeriodReqBody {
  month: number;
  year: number;
}

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

export const useGetWorkstations = (requestedDates: string[]) => {
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
    '/api/Workstation/GetWorkstations?' +
    convertToParam({requestedDates});

  const configs: IRequestConfig = getConfigs(
    'get',
    'application/json',
    url,
    {},
  );

  return useQuery<WorkstationListResponse>(
    [QueryKeys.GET_WORKSTATIONS, dates],
    // the generate swagger script can't handle array params properly
    // () => WorkstationService.getWorkstations({requestedDates}),
    () =>
      new Promise((resolve, reject) => {
        axios(configs, resolve, reject);
      }),
    {enabled: requestedDates.length > 0},
  );
};

export const useReserveWorkstation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [QueryKeys.RESERVE_WORKSTATION],
    (body: PostWorkstationReservationRequest[]) =>
      WorkstationService.reserveWorkstation({body}),
    {
      onSuccess: () => {
        queryClient.refetchQueries([QueryKeys.GET_UPCOMING_OFFICE_SCHEDULES]);
        queryClient.refetchQueries([QueryKeys.GET_UPCOMING_RESERVATIONS]);
        queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
      },
    },
  );
};

export const useGetUpcomingReservations = () => {
  return useQuery([QueryKeys.GET_UPCOMING_RESERVATIONS], () =>
    WorkstationService.upcomingReservations(),
  );
};

export const useGetWFOCount = () => {
  return useQuery([QueryKeys.GET_WFO_COUNT], () =>
    WorkstationService.upcomingUnscheduledWfoCount(),
  );
};

export const useCancelWSReservation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [QueryKeys.CANCEL_WS_RESERVATION],
    (planScheduleDatesId: number) =>
      WorkstationService.cancelWorkstationReservation({planScheduleDatesId}),
    {
      onSuccess: () => {
        queryClient.refetchQueries([QueryKeys.GET_UPCOMING_OFFICE_SCHEDULES]);
        queryClient.refetchQueries([QueryKeys.GET_UPCOMING_RESERVATIONS]);
        queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
      },
      retry: false,
    },
  );
};

export const useChangeWSReservation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [QueryKeys.CHANGE_WS_RESERVATION],
    ({
      planScheduleDatesId,
      body,
    }: {
      planScheduleDatesId: number;
      body: PutWorkstationReservationRequest;
    }) =>
      WorkstationService.changeWorkstationReservation({
        planScheduleDatesId,
        body,
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries([QueryKeys.GET_UPCOMING_RESERVATIONS]);
        queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
      },
    },
  );
};

export const useGetBranches = () => {
  return useQuery([QueryKeys.GET_BRANCHES], () => BranchService.getBranches());
};

export const useGetEmployeePlanScheduleForBranchCheckIn = (
  reqBody: PeriodReqBody,
) => {
  return useQuery(
    [QueryKeys.GET_EMPLOYEE_PLAN_SCHEDULE_FOR_BRANCH_CHECK_IN, reqBody],
    () =>
      BranchReservationService.getEmployeePlanScheduleForBranchCheckIn(reqBody),
  );
};

export const useUpcomingUnscheduleWFO = () => {
  return useQuery([QueryKeys.GET_UPCOMING_OFFICE_SCHEDULES], () =>
    WorkstationService.upcomingUnscheduledWfo(),
  );
};

export const useGetUpcomingUnscheduledWFB = () => {
  return useQuery([QueryKeys.GET_UPCOMING_BRANCH_SCHEDULES], () =>
    BranchService.upcomingUnscheduledWfb(),
  );
};

export const useReserveBranch = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [QueryKeys.RESERVE_BRANCH],
    (reservationData: EmployeeBranchReservationModelList) =>
      BranchReservationService.setBranchCheckInSchedule({
        body: reservationData,
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries([QueryKeys.GET_UPCOMING_BRANCH_SCHEDULES]);
        queryClient.refetchQueries([QueryKeys.GET_UPCOMING_RESERVATIONS]);
        queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
      },
    },
  );
};

export const useCancelWFBReservation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [QueryKeys.CANCEL_WFB_RESERVATION],
    (planScheduleDatesId: number) =>
      BranchReservationService.cancelBranchReservation({planScheduleDatesId}),
    {
      onSuccess: () => {
        queryClient.refetchQueries([QueryKeys.GET_UPCOMING_BRANCH_SCHEDULES]);
        queryClient.refetchQueries([QueryKeys.GET_UPCOMING_RESERVATIONS]);
        queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
      },
    },
  );
};

export const useChangeWFBReservation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [QueryKeys.CHANGE_WFB_RESERVATION],
    ({
      planScheduleDatesId,
      body,
    }: {
      planScheduleDatesId: number;
      body: PutBranchReservationRequest;
    }) =>
      BranchReservationService.changeBranchReservation({
        planScheduleDatesId,
        body,
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries([QueryKeys.GET_UPCOMING_RESERVATIONS]);
        queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
      },
    },
  );
};

export const useGetMonthPenalty = () => {
  return useQuery([QueryKeys.GET_MONTH_PENALTIES], () =>
    WorkstationService.getCurrentMonthWorkstationPenalties(),
  );
};

export const useGetWFBReservation = (planScheduleDatesId: number) => {
  return useQuery([QueryKeys.GET_WFB_RESERVATIONS], () =>
    BranchService.getBranchDetailsByPlanScheduleDatesId({
      planScheduleDatesId: planScheduleDatesId,
    }),
  );
};
