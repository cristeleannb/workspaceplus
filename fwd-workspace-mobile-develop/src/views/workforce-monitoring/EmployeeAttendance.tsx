import React, {useMemo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {useNavigation} from '@react-navigation/core';
import {format} from 'date-fns';

import {Avatar, FWDColors, More, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {
  Hub,
  ParkingP,
  PinLocationAlt,
  TableOffice,
  Wfo,
} from '@/components/pictograms';
import {
  useGetDashboardCurrentSchedule,
  useGetQRCheckInStatus,
} from '@/services/query';
import {useModal} from 'react-native-modalfy';
import {ModalStackParamsList} from '@/modals';
import {NavigationKey} from '@/navigations';
import {useTransferParking} from '@/hooks/useTransferParking';
import {WorkType, CheckStatus} from '@/services/api/api.service';
import {AccountRole} from '@/types';

interface SetupData {
  setuplabel: string | null;
  setupIcon: React.ReactElement<SvgProps> | null;
  workstationlabel?: string | null;
  workstationIcon?: React.ReactElement<SvgProps> | null;
  parkinglabel?: string | null;
  parkingIcon?: React.ReactElement<SvgProps> | null;
  parkingTransferredTo?: string;
  workstationNote?: string;
  parkingNote?: string;
}

interface EmployeeAttendanceProps {
  accountRole?: number;
}

export const EmployeeAttendance = ({accountRole}: EmployeeAttendanceProps) => {
  const navigation = useNavigation();
  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const {setSelectedSlot} = useTransferParking();

  const {data: currentSchedule} = useGetDashboardCurrentSchedule();
  const {data: qrStatus} = useGetQRCheckInStatus();

  const currentSetup: SetupData = useMemo(() => {
    let setuplabel = '';
    let setupIcon = null;
    let workstationlabel = '';
    let parkinglabel = '';
    let parkingTransferredTo = '';
    let workstationNote = '';
    let parkingNote = '';

    switch (currentSchedule?.workType) {
      case WorkType.WFA:
        setuplabel = 'Working From Anywhere';
        setupIcon = <PinLocationAlt width={24} height={24} />;
        break;

      case WorkType.WFO:
        setuplabel = 'Working From Office';
        setupIcon = <Wfo width={24} height={24} />;
        workstationlabel = currentSchedule?.seatCode
          ? currentSchedule.seatCode + ' Workstation'
          : '';

        if (currentSchedule?.parkingCode) {
          parkinglabel = `Basement ${currentSchedule?.parkingFloor || 0}, ${
            currentSchedule?.parkingCode || ''
          }`;
        }

        if (currentSchedule?.parkingTransferredToName?.trim()) {
          parkingTransferredTo = currentSchedule?.parkingTransferredToName;
        }

        if (workstationlabel && !currentSchedule.workstationIsPermanent) {
          if (
            currentSchedule.workstationIsPenalized &&
            currentSchedule.workstationSchedule
          ) {
            workstationNote = `Missed check-in at ${format(
              new Date(currentSchedule.workstationSchedule),
              'h:mmaa',
            )}`;
          } else {
            if (
              !currentSchedule.workstationCheckIn &&
              !currentSchedule.workstationCheckOut
            ) {
              workstationNote = 'Pending check-in';
            } else if (
              !!currentSchedule.workstationCheckIn &&
              !currentSchedule.workstationCheckOut
            ) {
              workstationNote = `Checked-in at ${format(
                new Date(currentSchedule.workstationCheckIn),
                'h:mmaa',
              )}`;
            } else if (
              !!currentSchedule.workstationCheckIn &&
              !!currentSchedule.workstationCheckOut
            ) {
              workstationNote = `Released at ${format(
                new Date(currentSchedule.workstationCheckOut),
                'h:mmaa',
              )}`;
            }
          }
        }

        if (parkinglabel && !currentSchedule.parkingIsPermanent) {
          if (
            currentSchedule.parkingIsPenalized &&
            currentSchedule.parkingSchedule
          ) {
            parkingNote = `Missed check-in at ${format(
              new Date(currentSchedule.parkingSchedule),
              'h:mmaa',
            )}`;
          } else {
            if (
              !currentSchedule.parkingCheckIn &&
              !currentSchedule.parkingCheckOut
            ) {
              parkingNote = 'Pending check-in';
            } else if (
              !!currentSchedule.parkingCheckIn &&
              !currentSchedule.parkingCheckOut
            ) {
              parkingNote = `Checked-in at ${format(
                new Date(currentSchedule.parkingCheckIn),
                'h:mmaa',
              )}`;
            } else if (
              !!currentSchedule.parkingCheckIn &&
              !!currentSchedule.parkingCheckOut
            ) {
              parkingNote = `Released at ${format(
                new Date(currentSchedule.parkingCheckOut),
                'h:mmaa',
              )}`;
            }
          }
        }
        break;

      case WorkType.WFB:
        setuplabel = 'Working From Branch';
        setupIcon = <Hub width={24} height={24} />;
        if (currentSchedule.branchId && currentSchedule.branchName) {
          workstationlabel = currentSchedule.branchName;
        }
        break;

      default:
        break;
    }

    return {
      setuplabel: setuplabel,
      setupIcon: setupIcon,
      workstationlabel: workstationlabel,
      workstationIcon: <TableOffice width={24} height={24} />,
      parkinglabel: parkinglabel,
      parkingIcon: <ParkingP width={24} height={24} />,
      parkingTransferredTo: parkingTransferredTo,
      workstationNote: workstationNote,
      parkingNote: parkingNote,
    };
  }, [currentSchedule]);

  const showWorksAt = useMemo(() => {
    return (
      !!currentSchedule &&
      (currentSchedule.workType === WorkType.WFO ||
        currentSchedule.workType === WorkType.WFB)
    );
  }, [currentSchedule]);

  const showParking = useMemo(() => {
    return (
      !!currentSchedule &&
      (currentSchedule.workType === WorkType.WFO ||
        currentSchedule.workType === WorkType.WFB)
    );
  }, [currentSchedule]);

  const currentAccountRole = useMemo(() => {
    return accountRole;
  }, [accountRole]);

  const onQuickViewPress = (title: string, modalType: string) => {
    const checkInStatus =
      qrStatus?.parkingCheckStatus === CheckStatus.NotApplicable
        ? true
        : qrStatus?.parkingCheckStatus === CheckStatus.CheckedIn
        ? false
        : null;

    openModal('ScheduleQuickViewModal', {
      title: title,
      type: modalType,
      canTransferParking: !!currentSchedule?.parkingIsPermanent,
      checkIn: {status: checkInStatus},
      viewOnly: !!currentSchedule?.parkingIsPenalized,
      onPressPlanSchedule: () => {
        closeModal('ScheduleQuickViewModal');

        navigation.navigate(NavigationKey.DRAWER_MAIN, {
          screen: NavigationKey.STACK_LANDING,
          params: {
            screen: NavigationKey.SCREEN_PLAN_SCHEDULE_LOADER,
          },
        });
      },
      onPressParkingCheckIn: () => {
        closeModal('ScheduleQuickViewModal');

        navigation.navigate(NavigationKey.DRAWER_MAIN, {
          screen: NavigationKey.STACK_LANDING,
          params: {
            screen: NavigationKey.SCREEN_QR_SCAN,
          },
        });
      },
      onPressViewParking: () => {
        closeModal('ScheduleQuickViewModal');

        navigation.navigate(NavigationKey.DRAWER_MAIN, {
          screen: NavigationKey.STACK_LANDING,
          params: {
            screen: NavigationKey.SCREEN_PARKING_SELECT,
            params: currentSchedule
              ? {
                  viewReservation: {...currentSchedule},
                }
              : {},
          },
        });
      },
      onPressTransferParking: () => {
        closeModal('ScheduleQuickViewModal');

        if (currentSchedule?.parkingSlotId) {
          setSelectedSlot({
            slot: currentSchedule?.parkingCode || '',
            slotId: currentSchedule?.parkingSlotId,
            floor: currentSchedule.parkingFloor,
          });

          navigation.navigate(NavigationKey.DRAWER_MAIN, {
            screen: NavigationKey.STACK_LANDING,
            params: {
              screen: NavigationKey.SCREEN_TRANSFER_PARKING,
            },
          });
        }
      },
    });
  };

  const onPressViewSeat = () => {
    if (currentSchedule && qrStatus) {
      const label =
        currentSchedule.workType === WorkType.WFO
          ? `Seat ${currentSchedule.seatCode}`
          : currentSchedule?.branchNamePrefix || '';

      const date =
        currentSchedule.workType === WorkType.WFO
          ? currentSchedule.workstationSchedule
          : currentSchedule.branchSchedule;

      const checkInStatus =
        qrStatus.workstationCheckStatus === CheckStatus.NotApplicable
          ? true
          : qrStatus.workstationCheckStatus === CheckStatus.CheckedIn
          ? false
          : null;

      openModal('BookSeatModal', {
        label: label || '',
        date,
        checkIn: {status: checkInStatus},
        viewOnly: !!currentSchedule?.workstationIsPenalized,
        onPressView: () => {
          closeModal('BookSeatModal');
          // encountered a timing issue, adding a timeout of 150ms
          setTimeout(() => {
            if (currentSchedule.workType === WorkType.WFO) {
              navigation.navigate(NavigationKey.DRAWER_MAIN, {
                screen: NavigationKey.STACK_LANDING,
                params: {
                  screen: NavigationKey.SCREEN_WORKSTATION_SELECT,
                  params: currentSchedule
                    ? {
                        viewReservation: {...currentSchedule},
                      }
                    : {},
                },
              });
            } else if (currentSchedule.workType === WorkType.WFB) {
              if (currentSchedule.planScheduleDatesId !== undefined) {
                navigation.navigate(NavigationKey.DRAWER_MAIN, {
                  screen: NavigationKey.STACK_LANDING,
                  params: {
                    screen: NavigationKey.SCREEN_WORK_FROM_BRANCH_VIEW,
                    params: {
                      planScheduleDatesId: currentSchedule.planScheduleDatesId,
                    },
                  },
                });
              }
            }
          }, 150);
        },
        onPressCheckInOut: () => {
          closeModal('BookSeatModal');

          setTimeout(() => {
            navigation.navigate(NavigationKey.DRAWER_MAIN, {
              screen: NavigationKey.STACK_LANDING,
              params: {
                screen: NavigationKey.SCREEN_QR_SCAN,
              },
            });
          }, 150);
        },
        onPressChange: () => {
          closeModal('BookSeatModal');
        },
        onPressCancel: () => {
          closeModal('BookSeatModal');
        },
      });
    }
  };

  return currentSchedule?.workType ? (
    <View style={{marginTop: spacer(24)}}>
      <>
        <Typography
          label="Today you're"
          color={FWDColors.grey3}
          variant="l3-b"
          style={{marginBottom: spacer(8)}}
        />
        <View style={[layoutStyles.row, layoutStyles.betweenStart]}>
          <View style={[layoutStyles.row, layoutStyles.startCenter]}>
            {currentSetup.setupIcon}
            <Typography
              label={currentSetup.setuplabel || ''}
              variant="h1"
              color={FWDColors.greenDarker}
              style={{marginLeft: spacer(8)}}
            />
          </View>
          <TouchableOpacity
            onPress={() =>
              onQuickViewPress(currentSetup.setuplabel || '', 'workstation')
            }>
            {currentAccountRole ===
            AccountRole.CEO ? null : currentAccountRole ===
              AccountRole.ExCom ? null : currentAccountRole ===
              AccountRole.SpecialExcom ? null : (
              <More width={24} height={24} color={FWDColors.orange} />
            )}
          </TouchableOpacity>
        </View>
      </>

      {showWorksAt && (
        <>
          <Typography
            label="Working at"
            color={FWDColors.grey3}
            variant="l3-b"
            style={{marginTop: spacer(16), marginBottom: spacer(8)}}
          />
          <View style={[layoutStyles.row, layoutStyles.betweenStart]}>
            <View
              style={[
                layoutStyles.row,
                layoutStyles.startStart,
                layoutStyles.cover,
              ]}>
              {currentSetup.workstationIcon}
              <View
                style={[
                  layoutStyles.cover,
                  {
                    marginLeft: spacer(8),
                    marginTop: spacer(2),
                  },
                ]}>
                <Typography
                  label={currentSetup.workstationlabel || 'No reservation'}
                  variant={currentSetup.workstationlabel ? 'h1' : 'b4-b'}
                  color={
                    currentSetup.workstationlabel
                      ? FWDColors.greenDarker
                      : FWDColors.grey3
                  }
                />
                {!!currentSetup.workstationNote && (
                  <View
                    style={[
                      layoutStyles.cover,
                      {
                        marginTop: spacer(4),
                      },
                    ]}>
                    <Typography
                      label={currentSetup.workstationNote}
                      color={FWDColors.grey3}
                      variant="l3-b"
                    />
                  </View>
                )}
              </View>
            </View>
            {currentSetup.workstationlabel ? (
              <TouchableOpacity onPress={onPressViewSeat}>
                <More width={24} height={24} color={FWDColors.orange} />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </>
      )}

      {showParking && (
        <>
          <Typography
            label="Parking at"
            color={FWDColors.grey3}
            variant="l3-b"
            style={{marginTop: spacer(16), marginBottom: spacer(8)}}
          />
          <View style={[layoutStyles.row, layoutStyles.betweenStart]}>
            <View
              style={[
                layoutStyles.row,
                layoutStyles.startStart,
                layoutStyles.cover,
              ]}>
              {currentSetup.parkingIcon}
              <View
                style={[
                  layoutStyles.cover,
                  {
                    marginLeft: spacer(8),
                    marginTop: spacer(2),
                  },
                ]}>
                <Typography
                  label={currentSetup.parkinglabel || 'No reservation'}
                  variant={currentSetup.parkinglabel ? 'h1' : 'b4-b'}
                  color={
                    currentSetup.parkinglabel
                      ? FWDColors.greenDarker
                      : FWDColors.grey3
                  }
                />
                {!!currentSetup.parkingNote && (
                  <View
                    style={[
                      layoutStyles.cover,
                      {
                        marginTop: spacer(4),
                      },
                    ]}>
                    <Typography
                      label={currentSetup.parkingNote}
                      color={FWDColors.grey3}
                      variant="l3-b"
                    />
                  </View>
                )}
              </View>
            </View>
            {currentSetup.parkinglabel ? (
              <TouchableOpacity
                onPress={() =>
                  onQuickViewPress(currentSetup?.parkinglabel || '', 'parking')
                }>
                <More width={24} height={24} color={FWDColors.orange} />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </>
      )}

      {!!currentSetup.parkingTransferredTo &&
        currentSetup.parkingTransferredTo !== '' && (
          <View
            style={[
              layoutStyles.row,
              layoutStyles.cover,
              layoutStyles.startCenter,
              {
                marginTop: spacer(12),
                paddingHorizontal: spacer(8),
                paddingVertical: spacer(4),
                backgroundColor: FWDColors.greyLight,
                borderRadius: spacer(8),
              },
            ]}>
            <Avatar
              size={24}
              gender={currentSchedule.parkingTransferredToGender}
            />
            <Typography
              label="Transferred to "
              variant="l3-b"
              color={FWDColors.greenDarker}
              style={{marginLeft: spacer(8)}}
            />
            <Typography
              label={currentSetup.parkingTransferredTo}
              variant="l3-bold"
              color={FWDColors.greenDarker}
            />
          </View>
        )}
    </View>
  ) : (
    <></>
  );
};
