import {useMutation, useQuery, useQueryClient} from 'react-query';

import {
  EmployeeWorkingCreditService,
  EmployeeWorkingCreditsModel,
  WorkingCreditService,
} from '../api/api.service';

import {QueryKeys} from './config';

interface PeriodReqBody {
  month: number;
  year: number;
}

export const useGetMonthWorkingCredits = (body: PeriodReqBody) => {
  return useQuery([QueryKeys.MONTH_WORKING_CREDITS, body], () =>
    WorkingCreditService.getWorkingCredits(body),
  );
};

export const useGetTeamMembersForCreditAssignment = (body: PeriodReqBody) => {
  return useQuery([QueryKeys.GET_TEAM_WORKING_CREDITS, body], () =>
    EmployeeWorkingCreditService.getEmployeeWorkingCreditsForAssignment(body),
  );
};

export const useSaveTeamMembersCredits = () => {
  const queryClient = useQueryClient();

  return useMutation(
    [QueryKeys.SAVE_TEAM_WORKING_CREDITS],
    (reqBody: {body: EmployeeWorkingCreditsModel[]; period: PeriodReqBody}) =>
      EmployeeWorkingCreditService.savingEmployeeWorkingCredit({
        body: reqBody.body,
      }),
    {
      onSuccess: (_, variables) => {
        queryClient.refetchQueries([
          QueryKeys.GET_TEAM_WORKING_CREDITS,
          variables.period,
        ]);
      },
    },
  );
};

export const useGetCreditAssignmentAvailability = () => {
  return useQuery([QueryKeys.WORKING_CREDITS_AVAILABILITY], () =>
    EmployeeWorkingCreditService.checkEmployeeCreditAssignmentValidity(),
  );
};
