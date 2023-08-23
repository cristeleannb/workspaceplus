import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {observer} from 'mobx-react';
import {
  addMonths,
  format,
  getDate,
  getHours,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameMonth,
  isWithinInterval,
  setDate,
} from 'date-fns';

import {useStores} from '@/stores';
import {addYears, subYears} from 'date-fns/esm';

type TimeFrameType = 'within' | 'outside' | null;

interface Period {
  month: number;
  year: number;
}
export type TTimeframe = {
  currentDate: Date;
  currentMonthPeriod: Period;
  getDayPeriod: string | null;
  creditsAssignmentDeadline: string;
  assignCreditsMonthPeriod: Period;
  assignCreditsCurrentMonthPeriodFormatted: string;
  withinCreditsAssignmentPeriod: boolean;
  planScheduleDate: Date;
  planSchedulePeriod: Period;
  planScheduleDeadline: string;
  planScheduleTimeframeStatus: TimeFrameType;
  withinApprovalTimeframe: boolean;
  manageScheduleRequestsDeadline: string;
  minCalendarDate: Date;
  maxcalendarDate: Date;
  isPlanScheduleCurrentMonth: boolean;
};

export const TimeframeContext = createContext<TTimeframe | null>(null);

export const TimeframeProvider: React.FC = observer(({children}) => {
  const {appSettingStore} = useStores();
  const appSetting = appSettingStore.appSetting;
  const [currentDate] = useState(new Date());
  const [assignCreditsDate, setAssignCreditsDate] = useState(new Date());
  const [planScheduleDate, setPlanScheduleDate] = useState(new Date());

  const currentMonthPeriod = useMemo(() => {
    return {
      month: getMonth(currentDate) + 1,
      year: getYear(currentDate),
    };
  }, [currentDate]);

  const getDayPeriod = useMemo(() => {
    const hours = getHours(currentDate);

    if (hours >= 0 && hours < 12) {
      return 'Morning';
    } else if (hours >= 12 && hours < 18) {
      return 'Afternoon';
    } else if (hours >= 18) {
      return 'Evening';
    } else {
      return null;
    }
  }, [currentDate]);

  /**
   * Credits Assignment
   */
  const assignCreditsMonthPeriod = useMemo(() => {
    return {
      month: getMonth(assignCreditsDate) + 1,
      year: getYear(assignCreditsDate),
    };
  }, [assignCreditsDate]);

  const creditsAssignmentDeadline = useMemo(() => {
    return `${format(currentDate, 'MMMM')} ${
      appSetting.workCreditAssignmentEndDay
    }`;
  }, [currentDate, appSetting]);

  const assignCreditsCurrentMonthPeriodFormatted = useMemo(() => {
    return `${format(assignCreditsDate, 'MMMM yyyy')}`;
  }, [assignCreditsDate]);

  const withinCreditsAssignmentPeriod = useMemo(() => {
    if (
      appSetting &&
      appSetting.workCreditAssignmentStartDay &&
      appSetting.workCreditAssignmentEndDay
    ) {
      const day = getDate(currentDate);
      const withinInterval =
        day >= appSetting.workCreditAssignmentStartDay &&
        day <= appSetting.workCreditAssignmentEndDay;
      return withinInterval;
    } else {
      return false;
    }
  }, [currentDate, appSetting]);

  /**
   * Plan Schedule
   */
  const planSchedulePeriod = useMemo(() => {
    return {
      month: getMonth(planScheduleDate) + 1,
      year: getYear(planScheduleDate),
    };
  }, [planScheduleDate]);

  const planScheduleDeadline = useMemo(() => {
    return `${format(currentDate, 'MMMM')} ${
      appSetting.employeePlanScheduleAssignmentEndDay
    }`;
  }, [currentDate, appSetting]);

  const planScheduleTimeframeStatus = useMemo<TimeFrameType>(() => {
    const minDeadlineDate = setDate(
      planScheduleDate,
      appSetting.employeePlanScheduleAssignmentStartDay || 0,
    );
    const maxDeadlineDate = setDate(
      planScheduleDate,
      appSetting.employeePlanScheduleAssignmentEndDay || 0,
    );

    if (
      isWithinInterval(planScheduleDate, {
        start: minDeadlineDate,
        end: maxDeadlineDate,
      })
    ) {
      return 'within';
    } else if (isBefore(planScheduleDate, minDeadlineDate)) {
      return 'outside';
    } else if (isAfter(planScheduleDate, maxDeadlineDate)) {
      return 'outside';
    } else {
      return null;
    }
  }, [planScheduleDate, appSetting]);

  /**
   * Schedule Requests
   */
  const manageScheduleRequestsDeadline = useMemo(() => {
    return `${format(currentDate, 'MMMM')} ${
      appSetting.employeePlanScheduleApprovalEndDay
    }`;
  }, [currentDate, appSetting]);

  const withinApprovalTimeframe = useMemo(() => {
    if (
      appSetting &&
      appSetting.employeePlanScheduleApprovalStartDay &&
      appSetting.employeePlanScheduleApprovalEndDay
    ) {
      const day = getDate(currentDate);
      const withinInterval =
        day >= appSetting.employeePlanScheduleApprovalStartDay &&
        day <= appSetting.employeePlanScheduleApprovalEndDay;
      return withinInterval;
    } else {
      return false;
    }
  }, [currentDate, appSetting]);

  const calendarLimit = useMemo(() => {
    return {
      minDate: subYears(currentDate, 1),
      maxDate: addYears(currentDate, 1),
    };
  }, [currentDate]);

  const isPlanScheduleCurrentMonth = useMemo(() => {
    return isSameMonth(currentDate, planScheduleDate);
  }, [currentDate, planScheduleDate]);

  useEffect(() => {
    const day = getDate(currentDate);
    let creditsDateTime = currentDate;
    let planScheduleDateTime = currentDate;

    if (day >= (appSetting?.workCreditAssignmentStartDay || 0)) {
      creditsDateTime = addMonths(currentDate, 1);
    }

    if (day >= (appSetting?.employeePlanScheduleAssignmentStartDay || 0)) {
      planScheduleDateTime = addMonths(currentDate, 1);
    }

    setAssignCreditsDate(creditsDateTime);
    setPlanScheduleDate(planScheduleDateTime);
  }, [currentDate, appSetting]);

  return (
    <TimeframeContext.Provider
      value={{
        currentDate,
        currentMonthPeriod,
        getDayPeriod,
        creditsAssignmentDeadline,
        assignCreditsMonthPeriod,
        assignCreditsCurrentMonthPeriodFormatted,
        withinCreditsAssignmentPeriod,
        planScheduleDate,
        planSchedulePeriod,
        planScheduleDeadline,
        planScheduleTimeframeStatus,
        withinApprovalTimeframe,
        manageScheduleRequestsDeadline,
        minCalendarDate: calendarLimit.minDate,
        maxcalendarDate: calendarLimit.maxDate,
        isPlanScheduleCurrentMonth,
      }}>
      {children}
    </TimeframeContext.Provider>
  );
});

export const useTimeframe = () => {
  const _context = useContext(TimeframeContext);

  if (!_context) {
    throw new Error('You have forgotten to use TimeframeProvider.');
  }

  return _context;
};
