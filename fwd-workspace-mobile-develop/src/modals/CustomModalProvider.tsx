import React from 'react';
import {Easing} from 'react-native';
import {
  ModalOptions,
  ModalProvider,
  ModalStackConfig,
  createModalStack,
} from 'react-native-modalfy';

import {
  LogoutModal,
  ClearDateSelectionModal,
  OutOfCreditsModal,
  DraftScheduleModal,
  SubmitScheduleModal,
  SubmitScheduleSuccessModal,
  ApproveMultipleScheduleSelectionModal,
  SelectDateFilterTypeModal,
  ManageTeamCalendarModeSelectionMdal,
  LockedDateModal,
  BookSlotModal,
  SelectParkingFloorModal,
  BookParkingSlotModal,
  BookTandemParkingSlotWarningModal,
  BookTandemParkingSlotConfirmationModal,
  ChangeParkingReservationModal,
  CancelParkingReservationModal,
  QRWrongSlotModal,
  QRErrorModal,
  CheckOutModal,
  MissedGracePeriodModal,
  BlockedParkingReservationModal,
  BookSeatModal,
  WorkStationAreaModal,
  WorkStationBookConfirmModal,
  WorkStationBranchModal,
  TimePickerModal,
  CheckInOutModal,
  ScheduleQuickViewModal,
  ParkingQuickViewModal,
  WorkstationErrorModal,
  PlanScheduleMaxWFOModal,
  NoCameraPermissionModal,
} from './components';
import {
  EmployeePlanScheduleModel,
  ParkingFloor,
  DivisionEntity,
} from '@/services/api/api.service';
import {WSDirectReportViewType, QRScanStatus} from '@/types';

export interface ModalStackParamsList {
  LogoutModal: {
    onYesPress: () => void;
  };
  ClearDateSelectionModal: {
    onYesPress: () => void;
    onNoPress: () => void;
    selectionType: 'all' | 'selected';
  };
  OutOfCreditsModal: {
    onYesPress: () => void;
  };
  DraftScheduleModal: {
    onYesPress: () => void;
    onNoPress: () => void;
    draftSchedule: EmployeePlanScheduleModel;
  };
  SubmitScheduleModal: {
    onYesPress: () => void;
    onNoPress: () => void;
  };
  SubmitScheduleSuccessModal: {
    onYesPress: () => void;
  };
  ApproveMultipleScheduleSelectionModal: {
    onYesPress: () => void;
    onNoPress: () => void;
    scheduleRequests: EmployeePlanScheduleModel[];
  };
  SelectDateFilterTypeModal: {
    onSelect: (type: string) => void;
  };
  SelectParkingFloorModal: {
    selectedFloor: ParkingFloor;
    parkingFloorsList: ParkingFloor[];
    onSelect: (floor: ParkingFloor) => void;
  };
  ManageTeamCalendarModeSelectionMdal: {
    currentMode: WSDirectReportViewType;
    onSelect: (mode: WSDirectReportViewType) => void;
  };
  LockedDateModal: {
    onOkayPress: () => void;
  };
  BookSlotModal: {
    onPressView: () => void;
    onPressChange: () => void;
    onPressTransfer?: () => void;
    onPressCancel: () => void;
    label?: string;
    date?: Date;
    isPermanent?: boolean;
  };
  BookParkingSlotModal: {
    onYesPress: () => void;
    onNoPress: () => void;
  };
  BookTandemParkingSlotWarningModal: {
    onYesPress: () => void;
    onNoPress: () => void;
  };
  BookTandemParkingSlotConfirmationModal: {
    onYesPress: () => void;
    onNoPress: () => void;
  };
  ChangeParkingReservationModal: {
    onYesPress: () => void;
    onNoPress: () => void;
  };
  CancelParkingReservationModal: {
    onYesPress: () => void;
    onNoPress: () => void;
  };
  QRWrongSlotModal: {
    onScanQR: () => void;
    onUploadQR: () => void;
  };
  QRErrorModal: {
    onScanQR: () => void;
    onUploadQR: () => void;
  };
  CheckOutModal: {
    onYesPress: () => void;
    onNoPress: () => void;
  };
  MissedGracePeriodModal: {
    onBookAnotherParkingSlot: () => void;
    onContactPeopleAndCulture: () => void;
    penaltyStrike: number;
    /**
     * 1 - enabled
     *
     * 2 - blocked
     */
    reservationStatus: 1 | 2;
    type: 'workstation' | 'parking';
    penalizedUntil?: Date;
  };
  BlockedParkingReservationModal: {
    onContactPeopleAndCulture: () => void;
    reservationStatus: 1 | 2;
    blockDate: Date;
  };
  BookSeatModal: {
    onPressView: () => void;
    onPressChange: () => void;
    onPressCancel: () => void;
    onPressCheckInOut?: () => void;
    checkIn?: {
      status: boolean | null;
    };
    viewOnly?: boolean;
    label?: string;
    date?: Date;
  };
  WorkStationAreaModal: {
    onPressArea: (area: DivisionEntity) => void;
    areaList: DivisionEntity[];
    selectedId?: number;
  };
  WorkStationBookConfirmModal: {
    title: string;
    description?: string;
    onPressYes: () => void;
    onPressNo: () => void;
  };
  WorkStationBranchModal: {
    onPressBranch: (id: number) => void;
    initialSelection?: boolean;
    branchCityList: {
      cityId?: number;
      cityName?: string;
    }[];
    selectedCityId?: number;
  };
  TimePickerModal: {
    date: Date;
    label: string;
    onPressSave: (selectedTime: Date) => void;
  };
  CheckInOutModal: {
    status: QRScanStatus;
    onPressScanQR?: () => void;
    onPressUploadQR?: () => void;
    onPressBookWS?: () => void;
    onPressContact?: () => void;
  };
  ScheduleQuickViewModal: {
    title: string;
    type: string;
    canTransferParking?: boolean;
    onPressPlanSchedule: () => void;
    onPressViewParking?: () => void;
    onPressParkingCheckIn?: () => void;
    onPressTransferParking?: () => void;
    checkIn?: {
      status: boolean | null;
    };
    viewOnly?: boolean;
  };
  WorkstationErrorModal: {
    onPressYes: () => void;
  };
  ParkingQuickViewModal: {
    slot: string;
    onTransferParking: () => void;
  };
  PlanScheduleMaxWFOModal: {
    dates: Date[];
  };
  NoCameraPermissionModal: undefined;
}

const config: ModalStackConfig = {
  LogoutModal: LogoutModal,
  ClearDateSelectionModal: ClearDateSelectionModal,
  OutOfCreditsModal: OutOfCreditsModal,
  DraftScheduleModal: DraftScheduleModal,
  SubmitScheduleModal: SubmitScheduleModal,
  SubmitScheduleSuccessModal: SubmitScheduleSuccessModal,
  ApproveMultipleScheduleSelectionModal: ApproveMultipleScheduleSelectionModal,
  SelectDateFilterTypeModal: SelectDateFilterTypeModal,
  ManageTeamCalendarModeSelectionMdal: ManageTeamCalendarModeSelectionMdal,
  LockedDateModal: LockedDateModal,
  BookSlotModal: BookSlotModal,
  BookParkingSlotModal: BookParkingSlotModal,
  BookTandemParkingSlotWarningModal: BookTandemParkingSlotWarningModal,
  BookTandemParkingSlotConfirmationModal:
    BookTandemParkingSlotConfirmationModal,
  ChangeParkingReservationModal: ChangeParkingReservationModal,
  CancelParkingReservationModal: CancelParkingReservationModal,
  QRWrongSlotModal: QRWrongSlotModal,
  QRErrorModal: QRErrorModal,
  CheckOutModal: CheckOutModal,
  MissedGracePeriodModal: MissedGracePeriodModal,
  BlockedParkingReservationModal: BlockedParkingReservationModal,
  BookSeatModal: BookSeatModal,
  WorkStationAreaModal: WorkStationAreaModal,
  WorkStationBookConfirmModal: WorkStationBookConfirmModal,
  WorkStationBranchModal: WorkStationBranchModal,
  TimePickerModal: TimePickerModal,
  CheckInOutModal: CheckInOutModal,
  SelectParkingFloorModal: SelectParkingFloorModal,
  ScheduleQuickViewModal: ScheduleQuickViewModal,
  ParkingQuickViewModal: ParkingQuickViewModal,
  WorkstationErrorModal: WorkstationErrorModal,
  PlanScheduleMaxWFOModal: PlanScheduleMaxWFOModal,
  NoCameraPermissionModal: NoCameraPermissionModal,
};

const defaultOptions: ModalOptions = {
  position: 'center',
  backBehavior: 'none',
  backdropOpacity: 0.4,
  animateInConfig: {
    easing: Easing.bezier(0.42, -0.03, 0.27, 0.95),
    duration: 250,
  },
  animateOutConfig: {
    easing: Easing.bezier(0.42, -0.03, 0.27, 0.95),
    duration: 250,
  },
  transitionOptions: animatedValue => ({
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {perspective: 350},
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [1.4, 1.2, 1],
          extrapolate: 'clamp',
        }),
      },
    ],
  }),
};

const stack = createModalStack<ModalStackParamsList>(config, defaultOptions);

export const CustomModalProvider: React.FC = ({children}) => {
  return <ModalProvider stack={stack}>{children}</ModalProvider>;
};
