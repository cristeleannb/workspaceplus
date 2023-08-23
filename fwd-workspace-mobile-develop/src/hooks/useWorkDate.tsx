import React, {createContext, useContext, useState} from 'react';
import {observer} from 'mobx-react';
import {format} from 'date-fns';
import _ from 'lodash';

import {WorkDates} from '@/types';
import {useModal} from 'react-native-modalfy';
import {ModalStackParamsList} from '@/modals';

export type TWorkDate = {
  workDates: WorkDates[];
  setWorkDates: (dates: WorkDates[]) => void;
  canDelete: boolean;
  setCanDelete: (canDelete: boolean) => void;
  onChangeTime: (id: number) => void;
  onUnselectSchedule: (id: number) => void;
  clearData: () => void;
};

export const WorkDateContext = createContext<TWorkDate | null>(null);

export const WorkDateProvider: React.FC = observer(({children}) => {
  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const [workDates, setWorkDates] = useState<WorkDates[]>([]);
  const [canDelete, setCanDelete] = useState(true);

  const onChangeTime = (id: number) => {
    const workDatesCopy = [...workDates];
    const workDateIndex = _.findIndex(
      workDatesCopy,
      workDate => workDate.id === id,
    );

    if (workDateIndex >= 0) {
      const workDateData = workDatesCopy[workDateIndex];

      openModal('TimePickerModal', {
        date: workDateData.date,
        label: format(workDateData.date, 'EEE, d MMM'),
        onPressSave: selectedDate => {
          closeModal('TimePickerModal');
          workDateData.date = selectedDate;
          workDateData.selected = true;
          workDatesCopy[workDateIndex] = workDateData;
          setWorkDates(workDatesCopy);
        },
      });
    }
  };

  const onUnselectSchedule = (id: number) => {
    if (canDelete) {
      const workDatesCopy = [...workDates];
      const workDateIndex = _.findIndex(
        workDatesCopy,
        workDate => workDate.id === id,
      );

      if (workDateIndex >= 0) {
        const workDateData = workDatesCopy[workDateIndex];
        workDateData.selected = false;
        workDatesCopy[workDateIndex] = workDateData;
        setWorkDates(workDatesCopy);
      }
    }
  };

  const clearData = () => {
    setWorkDates([]);
    setCanDelete(true);
  };

  return (
    <WorkDateContext.Provider
      value={{
        workDates,
        setWorkDates,
        canDelete,
        setCanDelete,
        onChangeTime,
        onUnselectSchedule,
        clearData,
      }}>
      {children}
    </WorkDateContext.Provider>
  );
});

export const useWorkDate = () => {
  const _context = useContext(WorkDateContext);

  if (!_context) {
    throw new Error('You have forgotten to use WorkDateProvider.');
  }

  return _context;
};
