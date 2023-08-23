import {useMutation, useQuery, useQueryClient} from 'react-query';

import {
  EmployeePlanScheduleForPostingModel,
  EmployeePlanScheduleModel,
  EmployeePlanScheduleService,
  EmployeeWorkingCreditService,
  HolidayService,
} from '../api/api.service';

import {QueryKeys} from './config';

interface PeriodReqBody {
  month: number;
  year: number;
}

export const useGetWorkingCredits = (reqBody: PeriodReqBody) => {
  return useQuery([QueryKeys.WORKING_CREDITS, reqBody], () =>
    EmployeeWorkingCreditService.getEmployeeWorkingCredit(reqBody),
  );
};

export const useGetPlanSchedule = (reqBody: PeriodReqBody) => {
  return useQuery([QueryKeys.PLAN_SCHEDULE, reqBody], () =>
    EmployeePlanScheduleService.getEmployeePlanSchedule(reqBody),
  );
};

export const useSavePlanSchedule = () => {
  return useMutation(
    [QueryKeys.SAVE_PLAN_SCHEDULE],
    (reqBody: EmployeePlanScheduleModel) =>
      EmployeePlanScheduleService.saveEmployeePlanSchedule({
        body: reqBody,
      }),
    {
      retry: false,
    },
  );
};

export const useSaveChangeSchedule = () => {
  return useMutation(
    [QueryKeys.SAVE_CHANGE_SCHEDULE],
    (reqBody: EmployeePlanScheduleForPostingModel) =>
      EmployeePlanScheduleService.saveEmployeePlanScheduleChangeSchedule({
        body: reqBody,
      }),
  );
};

export const useRefetchPlanSchedule = (reqBody: PeriodReqBody) => {
  const queryClient = useQueryClient();

  const refetch = () => {
    queryClient.refetchQueries([
      QueryKeys.PLAN_SCHEDULE,
      {
        month: reqBody.month,
        year: reqBody.year,
      },
    ]);
  };

  return {
    refetch,
  };
};

interface ScheduleRequestBody extends PeriodReqBody {
  recordStatuses: string;
}

export const useGetScheduleRequests = (reqBody: ScheduleRequestBody) => {
  return useQuery(
    [
      QueryKeys.SCHEDULE_REQUEST_LIST,
      {
        month: reqBody.month,
        year: reqBody.year,
      },
    ],
    () =>
      EmployeePlanScheduleService.getEmployeePlanScheduleByRecordStatus(
        reqBody,
      ),
  );
};

export const useSetScheduleRequestApproval = () => {
  const queryClient = useQueryClient();

  return useMutation(
    [QueryKeys.SCHEDULE_REQUEST_APPROVAL],
    (reqBody: EmployeePlanScheduleModel[]) =>
      EmployeePlanScheduleService.setEmployeePlanScheduleApproval({
        body: reqBody,
      }),
    {
      onSuccess: (_, variables) => {
        queryClient.refetchQueries([
          QueryKeys.SCHEDULE_REQUEST_LIST,
          {
            month: variables?.[0].month,
            year: variables?.[0].year,
          },
        ]);
      },
    },
  );
};

export const useSetScheduleRequestDecline = () => {
  const queryClient = useQueryClient();

  return useMutation(
    [QueryKeys.SCHEDULE_REQUEST_DECLINE],
    (reqBody: EmployeePlanScheduleModel[]) =>
      EmployeePlanScheduleService.setEmployeePlanScheduleApproval({
        body: reqBody,
      }),
    {
      onSuccess: (_, variables) => {
        queryClient.refetchQueries([
          QueryKeys.SCHEDULE_REQUEST_LIST,
          {
            month: variables?.[0].month,
            year: variables?.[0].year,
          },
        ]);
      },
    },
  );
};

export const useGetHoliday = (reqBody: PeriodReqBody) => {
  return useQuery(
    [QueryKeys.HOLIDAY, reqBody],
    () => HolidayService.holiday(reqBody),
    {
      retry: false,
    },
  );
};

export const useGetEmployeeScheduleById = (planScheduleId: number) => {
  return useQuery([QueryKeys.HOLIDAY, planScheduleId], () =>
    EmployeePlanScheduleService.getEmployeePlanScheduleById({
      employeeHasPlanScheduleId: planScheduleId,
    }),
  );
};
