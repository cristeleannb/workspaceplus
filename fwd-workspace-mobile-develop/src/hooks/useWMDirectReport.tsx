import React, {createContext, useContext, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  // isWeekend,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import _ from 'lodash';

import {ManageTeamWorkforceTypes, WSDirectReportViewType} from '@/types';
import {useGetWorkforceDirectReports} from '@/services/query/useWorkforce';
import {useTimeframe} from './useTimeframe';
import {EmployeePlanScheduleBranchWorkstationModel} from '@/services/api/api.service';

export type WMDirectReportType = {
  [key: string]: {
    [key: string]: EmployeePlanScheduleBranchWorkstationModel[];
  };
};

interface WMDirectReportDateRange {
  dateStart: Date;
  dateEnd: Date;
}

type WMDirectReportBottomSheetTab = ManageTeamWorkforceTypes | null;

export type TWMDirectReport = {
  initialDate: Date;
  viewDate: Date;
  updateViewDate: (date: Date) => void;
  viewMode: WSDirectReportViewType;
  updateViewMode: (mode: WSDirectReportViewType) => void;
  viewEmployeeBottomSheet: boolean;
  selectedDate: Date;
  updateSelectedDate: (date: Date) => void;
  viewDateRange: WMDirectReportDateRange;
  bottomSheetTab: WMDirectReportBottomSheetTab;
  updateBottomSheetTab: (tab: WMDirectReportBottomSheetTab) => void;
  reportData: WMDirectReportType;
};

export const WMDirectReportContext = createContext<TWMDirectReport | null>(
  null,
);

export const WMDirectReportProvider: React.FC = observer(({children}) => {
  const {currentDate} = useTimeframe();
  const [viewDate, setViewDate] = useState(currentDate);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [viewMode, setViewMode] = useState<WSDirectReportViewType>('Weekly');
  const [bottomSheetTab, setBottomSheetTab] =
    useState<WMDirectReportBottomSheetTab>(null);

  const viewDateRange = useMemo<WMDirectReportDateRange>(() => {
    let dateStart: Date = viewDate;
    let dateEnd: Date = viewDate;

    if (viewMode === 'Weekly') {
      dateStart = startOfWeek(viewDate);
      dateEnd = endOfWeek(viewDate);
    } else if (viewMode === 'Monthly') {
      dateStart = startOfMonth(viewDate);
      dateEnd = endOfMonth(viewDate);
    }

    dateStart = startOfDay(dateStart);
    dateEnd = endOfDay(dateEnd);

    return {
      dateStart,
      dateEnd,
    };
  }, [viewMode, viewDate]);

  const {data: workforceReport} = useGetWorkforceDirectReports({
    dateStart: viewDateRange.dateStart.toISOString(),
    dateEnd: viewDateRange.dateEnd.toISOString(),
  });

  const viewEmployeeBottomSheet = useMemo(() => {
    return !!bottomSheetTab;
  }, [bottomSheetTab]);

  const updateViewMode = (mode: WSDirectReportViewType) => {
    if (viewMode !== mode) {
      setViewMode(mode);
    }
  };

  const updateViewDate = (date: Date) => {
    setViewDate(date);
  };

  const updateSelectedDate = (date: Date) => {
    setSelectedDate(date);
  };

  const updateBottomSheetTab = (tab: WMDirectReportBottomSheetTab) => {
    if (bottomSheetTab !== tab) {
      setBottomSheetTab(tab);
    }
  };

  const reportData: WMDirectReportType = useMemo(() => {
    let report = {};
    if (workforceReport) {
      // const filteredReport = _.filter(
      //   workforceReport.employeePlanScheduleWorkstationCollection || [],
      //   i => {
      //     if (i.scheduleDate) {
      //       return !isWeekend(new Date(i.scheduleDate));
      //     } else {
      //       return false;
      //     }
      //   },
      // );

      return _.mapValues(
        _.groupBy(
          workforceReport.employeePlanScheduleWorkstationCollection || [],
          i => format(new Date(i.scheduleDate || new Date()), 'yyyy-MM-dd'),
        ),
        app => _.groupBy(app, i => i.workTypeCode),
      );
    }

    return report;
  }, [workforceReport]);

  return (
    <WMDirectReportContext.Provider
      value={{
        initialDate: currentDate,
        viewDate,
        updateViewDate,
        viewMode,
        updateViewMode,
        viewEmployeeBottomSheet,
        selectedDate,
        updateSelectedDate,
        viewDateRange,
        bottomSheetTab,
        updateBottomSheetTab,
        reportData,
      }}>
      {children}
    </WMDirectReportContext.Provider>
  );
});

export const useWMDirectReport = () => {
  const _context = useContext(WMDirectReportContext);

  if (!_context) {
    throw new Error('You have forgotten to use WMDirectReportProvider.');
  }

  return _context;
};
