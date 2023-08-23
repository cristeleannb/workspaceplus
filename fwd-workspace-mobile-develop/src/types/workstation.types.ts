export type QRScanStatus =
  | 'wrong-seat'
  | 'not-working'
  | 'missed-time'
  | 'wrong-slot';

export interface WorkDates {
  date: Date;
  id: number;
  selected?: boolean;
}

export interface ParkingDates {
  date: Date;
  id: number;
  selected?: boolean;
}

/**
 * - Employee has no reserved slot for this day.
 * - Employee did not reserve this workstation.
 * - You have missed the 1 hour grace period.
 */
export enum WSQRErrorMsgStatus {
  'no-reservation' = 'Employee has no reserved slot for this day.',
  'wrong-seat' = 'Employee did not reserve this workstation.',
  'missed-time' = 'You have missed the 1 hour grace period.',
  'wrong-slot' = 'Employee did not reserve this parking slot.',
}
