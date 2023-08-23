import React, {createContext, useContext, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import _ from 'lodash';

import {
  EmployeePlanScheduleForTransferModel,
  ParkingSlotForTransferModel,
  PlanScheduleDatesModelWithCheckIns,
} from '@/services/api/api.service';
import {useGetEmployeesForTransferParkingSlot} from '@/services/query';
import {format} from 'date-fns';

export type TTransferParkingSlot = {
  slot: string;
  slotId: string;
  floor?: number;
};

export type TTransferParking = {
  employeeList: EmployeePlanScheduleForTransferModel[];
  selectedEmployee: EmployeePlanScheduleForTransferModel | null;
  formattedSelectedDates: string | null;
  isFetchingData: boolean;
  selectEmployeeForTransfer: (employeeId: string) => void;
  setSearchKey: (value: string) => void;
  schedulesSelected: PlanScheduleDatesModelWithCheckIns[];
  setSchedulesSelected: (dates: PlanScheduleDatesModelWithCheckIns[]) => void;
  selectedSlot: TTransferParkingSlot | undefined;
  setSelectedSlot: (slot: TTransferParkingSlot) => void;
  selectedDatesForRequest: ParkingSlotForTransferModel[];
  selectedDatesSuccess: string[];
  newTransferParking: () => void;
  clearTransferParking: () => void;
};

export const TransferParkingContext = createContext<TTransferParking | null>(
  null,
);

export const TransferParkingProvider: React.FC = observer(({children}) => {
  const [selectedSlot, setSelectedSlot] = useState<TTransferParkingSlot>();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>();
  const [searchKey, setSearchKey] = useState<string>('');
  const [schedulesSelected, setSchedulesSelected] = useState<
    PlanScheduleDatesModelWithCheckIns[]
  >([]);

  const {
    data: employeeSearchResultData,
    isLoading,
    isFetching,
  } = useGetEmployeesForTransferParkingSlot({
    employeeName: searchKey || '',
  });

  const selectEmployeeForTransfer = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };

  const clearTransferParking = () => {
    setSelectedSlot(undefined);
    setSelectedEmployeeId(undefined);
    setSearchKey('');
    setSchedulesSelected([]);
  };

  const newTransferParking = () => {
    setSelectedEmployeeId(undefined);
    setSearchKey('');
    setSchedulesSelected([]);
  };

  const employeeList = useMemo(() => {
    return employeeSearchResultData?.employeePlanScheduleForTransferList || [];
  }, [employeeSearchResultData]);

  const selectedEmployee = useMemo(() => {
    if (selectedEmployeeId) {
      const employeeData = _.find(employeeList, employee => {
        return employee.employeeKeyId === selectedEmployeeId;
      });

      return employeeData ? employeeData : null;
    } else {
      return null;
    }
  }, [selectedEmployeeId, employeeList]);

  const formattedSelectedDates = useMemo(() => {
    if (schedulesSelected && schedulesSelected.length > 0) {
      const currentMonth = format(
        new Date(schedulesSelected[0].scheduleDate || new Date()),
        'MMMM',
      );

      const days = _.chain(schedulesSelected)
        .map(schedule =>
          format(new Date(schedule.scheduleDate || new Date()), 'd'),
        )
        .sortBy(d => d)
        .value()
        .join(',');

      return `${currentMonth} ${days}`;
    } else {
      return null;
    }
  }, [schedulesSelected]);

  const selectedDatesForRequest = useMemo(() => {
    if (!selectedSlot) {
      return [];
    }

    const requestDates: ParkingSlotForTransferModel[] = _.map(
      schedulesSelected,
      schedule => ({
        planScheduleDatesId: schedule.planScheduleDatesId,
        parkingSlotId: selectedSlot.slotId,
      }),
    );

    return requestDates;
  }, [schedulesSelected, selectedSlot]);

  const selectedDatesSuccess = useMemo(() => {
    return _.chain(schedulesSelected)
      .map(schedule => new Date(schedule.scheduleDate || new Date()))
      .sortBy(d => d)
      .map(d => format(d, 'EEE, MMMM dd'))
      .value();
  }, [schedulesSelected]);

  const isFetchingData = useMemo(() => {
    return isLoading || isFetching;
  }, [isLoading, isFetching]);

  return (
    <TransferParkingContext.Provider
      value={{
        employeeList,
        selectedEmployee,
        schedulesSelected,
        formattedSelectedDates,
        isFetchingData,
        selectEmployeeForTransfer,
        setSearchKey,
        setSchedulesSelected,
        selectedSlot,
        setSelectedSlot,
        selectedDatesForRequest,
        selectedDatesSuccess,
        newTransferParking,
        clearTransferParking,
      }}>
      {children}
    </TransferParkingContext.Provider>
  );
});

export const useTransferParking = () => {
  const _context = useContext(TransferParkingContext);

  if (!_context) {
    throw new Error('You have forgotten to use TransferParkingProvider.');
  }

  return _context;
};
