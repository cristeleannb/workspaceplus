import {RouteProp} from '@react-navigation/native';

import {StackLandingParamList} from '../navigators/StackLandingNavigator';

export type LandingScreenRouteProp = RouteProp<StackLandingParamList, 'Main'>;

export type ScheduleSubmitRouteProp = RouteProp<
  StackLandingParamList,
  'SubmitScheduleSuccess'
>;

export type SchedulePlanRouteProp = RouteProp<
  StackLandingParamList,
  'PlanSchedule'
>;

export type UnassignEmployeeCreditsRouteProp = RouteProp<
  StackLandingParamList,
  'UnassignedEmployeeCredits'
>;

export type AssignCreditsRouteProp = RouteProp<
  StackLandingParamList,
  'AssignCredits'
>;

export type ViewScheduleRouteProp = RouteProp<
  StackLandingParamList,
  'ViewSchedule'
>;

export type ScheduleRequestListRouteProp = RouteProp<
  StackLandingParamList,
  'WorkScheduleRequests'
>;

export type ScheduleRequestDetailRouteProp = RouteProp<
  StackLandingParamList,
  'DetailedScheduleRequest'
>;

export type ScheduleRequestDeclineRouteProp = RouteProp<
  StackLandingParamList,
  'DeclineWorkSchedule'
>;

export type ScheduleRequestDeclineSuccessRouteProp = RouteProp<
  StackLandingParamList,
  'DeclineWorkScheduleSuccess'
>;

export type BookingWFOSuccessScreenRouteProp = RouteProp<
  StackLandingParamList,
  'BookingWFOSuccessScreen'
>;

export type BookingWFBSuccessScreenRouteProp = RouteProp<
  StackLandingParamList,
  'BookingWFBSuccessScreen'
>;

export type ParkingSuccessScreenRouteProp = RouteProp<
  StackLandingParamList,
  'ParkingSuccessScreen'
>;

export type ParkingUpcomingReservationsRouteProp = RouteProp<
  StackLandingParamList,
  'ParkingUpcomingReservations'
>;

export type CheckInOutConfirmScreenRouteProp = RouteProp<
  StackLandingParamList,
  'CheckInOutConfirmScreen'
>;

export type WorkStationSelectScreenRouteProp = RouteProp<
  StackLandingParamList,
  'WorkStationSelect'
>;

export type TransferParkingDateSelectionScreenRouteProp = RouteProp<
  StackLandingParamList,
  'TransferParkingDateSelection'
>;

export type WorkStationWFBScreenRouteProp = RouteProp<
  StackLandingParamList,
  'WorkFromBranchScreen'
>;

export type WorkStationWFBViewScreenRouteProp = RouteProp<
  StackLandingParamList,
  'WorkFromBranchViewScreen'
>;

export type ParkingSelectScreenRouteProp = RouteProp<
  StackLandingParamList,
  'ParkingSelect'
>;
