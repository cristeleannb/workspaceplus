import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {NavigationKey} from '../config';
import {
  LandingScreen,
  DetailedScheduleRequestScreen,
  WorkScheduleRequestsScreen,
  DeclineWorkScheduleScreen,
  DeclineWorkScheduleSuccessScreen,
  AssignCreditsScreen,
  UnassignedEmployeeCreditsScreen,
  ViewScheduleScreen,
  PlanScheduleLoadingScreen,
  PlanScheduleScreen,
  SubmitScheduleSuccessScreen,
  ManageTeamScreen,
  WorkforceMonitoringScreen,
  RequestReportScreen,
  RequestReportSuccessScreen,
  BookWorkstationScreen,
  WorkStationSelectScreen,
  UpcomingReservationsScreen,
  WorkFromBranchScreen,
  BookingWFOSuccessScreen,
  WorkstationSelectDateScreen,
  ReserveParkingLandingScreen,
  QRScanScreen,
  UploadQRScreen,
  CheckInOutConfirmScreen,
  ParkingSelectScreen,
  ParkingSelectDateScreen,
  ParkingSuccessScreen,
  ParkingUpcomingReservationsScreen,
  TransferParkingScreen,
  TransferParkingSuccessScreen,
  BookingWFBSuccessScreen,
  TransferParkingDateSelectionScreen,
  WFBReservationViewScreen,
  WFBSelectDateScreen,
  NotificationListScreen,
  TransferParkingEmployeeListScreen,
} from '@/screens';
import {
  EmployeePlanScheduleModel,
  QRResponse,
  UpcomingParkingReservationResponse,
  UpcomingReservationResponse,
} from '@/services/api/api.service';
import {QRScanStatus} from '@/types';

export type StackLandingParamList = {
  [NavigationKey.SCREEN_LANDING]?: {
    switchSuccess?: boolean;
    submitScheduleSuccess?: boolean;
    wsQRStatus?: QRScanStatus;
  };
  [NavigationKey.SCREEN_PLAN_SCHEDULE_LOADER]: undefined;
  [NavigationKey.SCREEN_VIEW_SCHEDULE]?: {
    success?: boolean;
  };
  [NavigationKey.SCREEN_PLAN_SCHEDULE]?: {
    date: string;
  };
  [NavigationKey.SCREEN_SUBMIT_SCHEDULE_SUCCESS]: {
    name: string;
  };
  [NavigationKey.SCREEN_MANAGE_TEAM]: undefined;
  [NavigationKey.SCREEN_WORK_SCHEDULE_REQUESTS]?: {
    success?: boolean;
  };
  [NavigationKey.SCREEN_UNASSIGNED_EMPLOYEE_CREDITS]?: {
    success?: boolean;
  };
  [NavigationKey.SCREEN_WORKFORCE_MONITORING]: undefined;
  [NavigationKey.SCREEN_REQUEST_REPORT]: undefined;
  [NavigationKey.SCREEN_REQUEST_REPORT_SUCCESS]: undefined;

  [NavigationKey.SCREEN_DETAILED_SCHEDULE_REQUEST]: {
    item: EmployeePlanScheduleModel;
  };
  [NavigationKey.SCREEN_DECLINE_WORK_SCHEDULE]: {
    item: EmployeePlanScheduleModel;
  };
  [NavigationKey.SCREEN_DECLINE_WORK_SCHEDULE_SUCCESS]: {
    item: EmployeePlanScheduleModel;
  };
  [NavigationKey.SCREEN_ASSIGN_CREDITS]: {
    selectedIds: string[];
    assigned: boolean;
  };
  [NavigationKey.SCREEN_BOOK_WORKSTATION]: undefined;
  [NavigationKey.SCREEN_WORKSTATION_SELECT]: {
    viewReservation?: UpcomingReservationResponse;
    changeReservation?: UpcomingReservationResponse;
    cancelReservation?: UpcomingReservationResponse;
  };
  [NavigationKey.SCREEN_UPCOMING_RESERVATIONS]: undefined;
  [NavigationKey.SCREEN_PARKING_UPCOMING_RESERVATIONS]: {
    reservations: any;
  };
  [NavigationKey.SCREEN_WORK_FROM_BRANCH]: {
    changeReservation?: UpcomingReservationResponse;
    cancelReservation?: UpcomingReservationResponse;
  };
  [NavigationKey.SCREEN_WORK_FROM_BRANCH_VIEW]: {
    planScheduleDatesId: number;
  };
  [NavigationKey.SCREEN_BOOKING_WFO_SUCCESS]: {
    type: 'reserve' | 'change' | 'cancel';
    workstation: string;
    selectedDates: string[];
  };
  [NavigationKey.SCREEN_BOOKING_WFB_SUCCESS]: {
    type: 'reserve' | 'change' | 'cancel';
    workstation: string;
    selectedDates: string[];
  };
  [NavigationKey.SCREEN_WFB_SELECT_DATE]: undefined;
  [NavigationKey.SCREEN_PARKING_SUCCESS]: {
    type: 'reserve' | 'change' | 'cancel';
    parkingSlot: string;
    selectedDates: string[];
  };
  [NavigationKey.SCREEN_WS_SELECT_DATE]: undefined;
  [NavigationKey.SCREEN_RESERVE_PARKING]: undefined;
  [NavigationKey.SCREEN_QR_SCAN]: undefined;
  [NavigationKey.SCREEN_QR_UPLOAD]: undefined;
  [NavigationKey.SCREEN_CHECK_IN_OUT_CONFIRM]: {
    qrResponse: QRResponse;
  };
  [NavigationKey.SCREEN_PARKING_SELECT]: {
    viewReservation?: UpcomingParkingReservationResponse;
    changeReservation?: UpcomingParkingReservationResponse;
    cancelReservation?: UpcomingParkingReservationResponse;
  };
  [NavigationKey.SCREEN_TRANSFER_PARKING]: undefined;
  [NavigationKey.SCREEN_TRANSFER_PARKING_SUCCESS]: undefined;
  [NavigationKey.SCREEN_TRANSFER_PARKING_DATE_SELECTION]: undefined;
  [NavigationKey.SCREEN_TRANSFER_PARKING_EMPLOYEE_SELECTION]: undefined;
  [NavigationKey.SCREEN_PS_SELECT_DATE]: undefined;
  [NavigationKey.SCREEN_NOTIFICATION_LIST]: undefined;
};

const {Navigator, Screen} = createStackNavigator<StackLandingParamList>();

export const StackLandingNavigator = () => {
  return (
    <Navigator
      initialRouteName={NavigationKey.SCREEN_LANDING}
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name={NavigationKey.SCREEN_LANDING} component={LandingScreen} />
      <Screen
        name={NavigationKey.SCREEN_PLAN_SCHEDULE_LOADER}
        component={PlanScheduleLoadingScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_VIEW_SCHEDULE}
        component={ViewScheduleScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_PLAN_SCHEDULE}
        component={PlanScheduleScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_SUBMIT_SCHEDULE_SUCCESS}
        component={SubmitScheduleSuccessScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_MANAGE_TEAM}
        component={ManageTeamScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_DETAILED_SCHEDULE_REQUEST}
        component={DetailedScheduleRequestScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_WORK_SCHEDULE_REQUESTS}
        component={WorkScheduleRequestsScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_DECLINE_WORK_SCHEDULE_SUCCESS}
        component={DeclineWorkScheduleSuccessScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_DECLINE_WORK_SCHEDULE}
        component={DeclineWorkScheduleScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_UNASSIGNED_EMPLOYEE_CREDITS}
        component={UnassignedEmployeeCreditsScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_ASSIGN_CREDITS}
        component={AssignCreditsScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_WORKFORCE_MONITORING}
        component={WorkforceMonitoringScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_REQUEST_REPORT}
        component={RequestReportScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_REQUEST_REPORT_SUCCESS}
        component={RequestReportSuccessScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_BOOK_WORKSTATION}
        component={BookWorkstationScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_WORKSTATION_SELECT}
        component={WorkStationSelectScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_UPCOMING_RESERVATIONS}
        component={UpcomingReservationsScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_PARKING_UPCOMING_RESERVATIONS}
        component={ParkingUpcomingReservationsScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_WORK_FROM_BRANCH}
        component={WorkFromBranchScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_WORK_FROM_BRANCH_VIEW}
        component={WFBReservationViewScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_BOOKING_WFO_SUCCESS}
        component={BookingWFOSuccessScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_BOOKING_WFB_SUCCESS}
        component={BookingWFBSuccessScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_WFB_SELECT_DATE}
        component={WFBSelectDateScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_WS_SELECT_DATE}
        component={WorkstationSelectDateScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_PS_SELECT_DATE}
        component={ParkingSelectDateScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_RESERVE_PARKING}
        component={ReserveParkingLandingScreen}
      />
      <Screen name={NavigationKey.SCREEN_QR_SCAN} component={QRScanScreen} />
      <Screen
        name={NavigationKey.SCREEN_QR_UPLOAD}
        component={UploadQRScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_CHECK_IN_OUT_CONFIRM}
        component={CheckInOutConfirmScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_PARKING_SELECT}
        component={ParkingSelectScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_PARKING_SUCCESS}
        component={ParkingSuccessScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_TRANSFER_PARKING}
        component={TransferParkingScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_TRANSFER_PARKING_SUCCESS}
        component={TransferParkingSuccessScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_TRANSFER_PARKING_DATE_SELECTION}
        component={TransferParkingDateSelectionScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_TRANSFER_PARKING_EMPLOYEE_SELECTION}
        component={TransferParkingEmployeeListScreen}
      />
      <Screen
        name={NavigationKey.SCREEN_NOTIFICATION_LIST}
        component={NotificationListScreen}
      />
    </Navigator>
  );
};
