import React, {createContext, useContext, useState} from 'react';
import {observer} from 'mobx-react';
import {format} from 'date-fns';
import _ from 'lodash';

import {ParkingDates} from '@/types';
import {useModal} from 'react-native-modalfy';
import {ModalStackParamsList} from '@/modals';

export type TParkingDate = {
  parkingDates: ParkingDates[];
  setParkingDates: (dates: ParkingDates[]) => void;
  canDelete: boolean;
  setCanDelete: (canDelete: boolean) => void;
  onChangeTime: (id: number) => void;
  onUnselectSchedule: (id: number) => void;
  clearData: () => void;
};

export const ParkingDateContext = createContext<TParkingDate | null>(null);

export const ParkingDateProvider: React.FC = observer(({children}) => {
  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const [parkingDates, setParkingDates] = useState<ParkingDates[]>([]);
  const [canDelete, setCanDelete] = useState(true);

  const onChangeTime = (id: number) => {
    const parkingDatesCopy = [...parkingDates];
    const parkingDateIndex = _.findIndex(
      parkingDatesCopy,
      parkingDate => parkingDate.id === id,
    );

    if (parkingDateIndex >= 0) {
      const parkingDateData = parkingDatesCopy[parkingDateIndex];

      openModal('TimePickerModal', {
        date: parkingDateData.date,
        label: format(parkingDateData.date, 'EEE, d MMM'),
        onPressSave: selectedDate => {
          closeModal('TimePickerModal');
          parkingDateData.date = selectedDate;
          parkingDateData.selected = true;
          parkingDatesCopy[parkingDateIndex] = parkingDateData;
          setParkingDates(parkingDatesCopy);
        },
      });
    }
  };

  const onUnselectSchedule = (id: number) => {
    if (canDelete) {
      const parkingDatesCopy = [...parkingDates];
      const parkingDateIndex = _.findIndex(
        parkingDatesCopy,
        parkingDate => parkingDate.id === id,
      );

      if (parkingDateIndex >= 0) {
        const parkingDateData = parkingDatesCopy[parkingDateIndex];
        parkingDateData.selected = false;
        parkingDatesCopy[parkingDateIndex] = parkingDateData;
        setParkingDates(parkingDatesCopy);
      }
    }
  };

  const clearData = () => {
    setParkingDates([]);
    setCanDelete(true);
  };

  return (
    <ParkingDateContext.Provider
      value={{
        parkingDates,
        setParkingDates,
        canDelete,
        setCanDelete,
        onChangeTime,
        onUnselectSchedule,
        clearData,
      }}>
      {children}
    </ParkingDateContext.Provider>
  );
});

export const useParkingDate = () => {
  const _context = useContext(ParkingDateContext);

  if (!_context) {
    throw new Error('You have forgotten to use ParkingDateProvider.');
  }

  return _context;
};
