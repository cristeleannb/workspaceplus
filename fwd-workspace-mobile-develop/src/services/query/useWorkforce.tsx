import {useMutation, useQuery} from 'react-query';

import {DashboardService, WorkforceMonitoringService} from '../api/api.service';
import {QueryKeys} from './config';

interface WorkforceDirectReportsDateRange {
  dateStart?: string | undefined;
  dateEnd?: string | undefined;
}

export const useGetEmployeeAttendance = (
  reqBody: WorkforceDirectReportsDateRange,
) => {
  return useQuery([QueryKeys.WORKFORCE_ATTENDANCE_SUMMARY, reqBody], () =>
    WorkforceMonitoringService.getEmployeeAttendance(reqBody),
  );
};

export const useGetSummaryReport = (
  reqBody: WorkforceDirectReportsDateRange,
) => {
  return useQuery([QueryKeys.WORKFORCE_SUMMARY_REPORT, reqBody], () =>
    WorkforceMonitoringService.getSummaryReport(reqBody),
  );
};

export const useGetWorkforceAllReports = (
  reqBody: WorkforceDirectReportsDateRange,
) => {
  return useQuery([QueryKeys.WORKFORCE_ALL_REPORTS, reqBody], () =>
    WorkforceMonitoringService.getAllEmployeesReport(reqBody),
  );
};

export const useGetWorkforceDirectReports = (
  reqBody: WorkforceDirectReportsDateRange,
) => {
  return useQuery([QueryKeys.WORKFORCE_DIRECT_REPORTS, reqBody], () =>
    WorkforceMonitoringService.getExComManagerReport(reqBody),
  );
};

export const useGetDashboardCurrentSchedule = () => {
  return useQuery([QueryKeys.DASHBOARD_CURRENT_SCHEDULE], () =>
    DashboardService.dashboardCurrentSchedules(),
  );
};

export const useExtractReport = () => {
  return useMutation([QueryKeys.WORKFORCE_EXTRACT_REPORT], (emails: string) =>
    WorkforceMonitoringService.sendEmployeesReport({
      email: emails,
    }),
  );
};
