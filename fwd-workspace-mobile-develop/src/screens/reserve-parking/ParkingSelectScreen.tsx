import React, {useEffect, useMemo, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/core';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useModal} from 'react-native-modalfy';
import {
  addHours,
  format,
  getHours,
  isToday,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import _ from 'lodash';
import {observer} from 'mobx-react';

import {
  Button,
  Close,
  FWDColors,
  Typography,
  Workspace,
  AngleDownThin,
  AngleRightThin,
  Parking,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {
  NavigationHeader,
  ParkingMap,
  ParkingDateItem,
  ParkingStatus,
  BookingDate,
} from '@/views';
import {ModalStackParamsList} from '@/modals';
import {NavigationKey, ParkingSelectScreenRouteProp} from '@/navigations';
import {
  useCancelPSReservation,
  useChangePSReservation,
  useGetParkingFloors,
  useGetParkingSlots,
  useReserveParking,
  useUpcomingUnscheduledParkingDates,
} from '@/services/query';
import {
  ParkingFloor,
  PostParkingReservationRequest,
  UpcomingParkingReservationResponse,
} from '@/services/api/api.service';
import {ParkingDates} from '@/types';
import {useParkingDate} from '@/hooks/useParkingDate';

const ParkingSelectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ParkingSelectScreenRouteProp>();

  const {changeReservation, cancelReservation, viewReservation} = route.params;

  const insets = useSafeAreaInsets();
  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const {
    parkingDates,
    setParkingDates,
    setCanDelete,
    onUnselectSchedule,
    onChangeTime,
    clearData,
  } = useParkingDate();

  const [viewOnly] = useState(viewReservation ? true : false);
  const [isTandem, setIsTandem] = useState(false);

  const scheduledDate = (date?: Date) => {
    return date ? new Date(date) : new Date();
  };

  const [selectedDates, setSelectedDates] = useState<string[]>(
    changeReservation
      ? [scheduledDate(changeReservation.parkingSchedule).toISOString()]
      : cancelReservation
      ? [scheduledDate(cancelReservation.parkingSchedule).toISOString()]
      : [],
  );

  const {data: parkingFloorList} = useGetParkingFloors();
  const {data: parkingSlotList, refetch: refetchParkingSlotList} =
    useGetParkingSlots(selectedDates);

  const {mutateAsync: reserveParkingSlot} = useReserveParking();
  const {mutateAsync: changePSReservation} = useChangePSReservation();
  const {mutateAsync: cancelPSReservation} = useCancelPSReservation();

  const {data: upcomingSched, refetch: upcomingRefetchSched} =
    useUpcomingUnscheduledParkingDates();

  const parkingFloors = parkingFloorList?.parkingFloors?.sort(
    (a, b) => (a.floor || 0) - (b.floor || 0),
  );

  const [selectedFloor, setSelectedFloor] = useState<ParkingFloor | undefined>(
    changeReservation
      ? {
          floor: changeReservation.parkingFloor,
        }
      : cancelReservation
      ? {
          floor: cancelReservation.parkingFloor,
        }
      : viewReservation
      ? {
          floor: viewReservation.parkingFloor,
        }
      : undefined,
  );

  const [selectedSlot, setSelectedSlot] = useState<
    | {
        parkingSlotId?: string;
        parkingCode?: string;
        parkingFloor?: number;
      }
    | undefined
  >(
    changeReservation
      ? {
          parkingSlotId: changeReservation.parkingSlotId?.toString(),
          parkingCode: changeReservation.parkingCode,
          parkingFloor: changeReservation.parkingFloor,
        }
      : cancelReservation
      ? {
          parkingSlotId: cancelReservation.parkingSlotId?.toString(),
          parkingCode: cancelReservation.parkingCode,
          parkingFloor: cancelReservation.parkingFloor,
        }
      : viewReservation
      ? {
          parkingSlotId: viewReservation.parkingSlotId?.toString(),
          parkingCode: viewReservation.parkingCode,
          parkingFloor: viewReservation.parkingFloor,
        }
      : undefined,
  );

  const [initialSelected] = useState<string | undefined>(
    changeReservation
      ? changeReservation.parkingSlotId?.toString()
      : cancelReservation
      ? cancelReservation.parkingSlotId?.toString()
      : viewReservation
      ? viewReservation.parkingSlotId?.toString()
      : undefined,
  );

  const onPressParkingSlot = (
    parkingSlotId?: string,
    parkingCode?: string,
    parkingFloor?: number,
    isTandemParking?: boolean,
  ) => {
    setIsTandem(isTandemParking || false);
    setSelectedSlot({parkingSlotId, parkingCode, parkingFloor});
  };

  const canSelectSchedule = useMemo(() => {
    if (!!changeReservation || !!cancelReservation) {
      return false;
    } else {
      return true;
    }
  }, [changeReservation, cancelReservation]);

  const hasSelectedSchedule = useMemo(() => {
    const selectedSchedules = _.filter(
      parkingDates,
      parkingDate => !!parkingDate.selected,
    );
    return selectedSchedules.length > 0;
  }, [parkingDates]);

  const onPressFloorSelect = () => {
    openModal('SelectParkingFloorModal', {
      selectedFloor: {floor: selectedFloor?.floor},
      parkingFloorsList: parkingFloors || [],
      onSelect: floor => {
        setSelectedFloor(floor);
        closeModal('SelectParkingFloorModal');
      },
    });
  };

  const handleChangeSlot = async () => {
    try {
      if (
        !selectedSlot?.parkingSlotId ||
        !changeReservation ||
        !changeReservation?.planScheduleDatesId ||
        !changeReservation?.parkingSlotId
      ) {
        return;
      }

      const response = await changePSReservation({
        planScheduleDatesId: changeReservation.planScheduleDatesId,
        body: {
          parkingSlotId: selectedSlot.parkingSlotId,
          date: setMinutes(
            setSeconds(new Date(parkingDates?.[0]?.date || Date.now()), 0),
            0,
          ),
        },
      });

      const parkingSlot = `Basement ${selectedSlot?.parkingFloor}, ${selectedSlot?.parkingCode}`;

      const dates = [formatDate(response?.parkingSchedule)];

      // reset states
      refetchParkingSlotList();
      upcomingRefetchSched();
      setSelectedSlot(undefined);

      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_PARKING_SUCCESS,
          params: {
            type: 'change',
            parkingSlot,
            selectedDates: dates,
          },
        },
      });

      setSelectedSlot(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReserveParking = async () => {
    try {
      const data = selectedDates.map(date => {
        const d: PostParkingReservationRequest = {
          parkingSlotId: selectedSlot?.parkingSlotId,
          date: setMinutes(setSeconds(new Date(date), 0), 0),
        };

        return d;
      });

      const response = await reserveParkingSlot(data);

      const parkingSlot = `Basement ${selectedSlot?.parkingFloor}, ${selectedSlot?.parkingCode}`;

      const dates = response.map(({parkingSchedule}) => {
        return formatDate(parkingSchedule);
      });

      // reset states
      refetchParkingSlotList();
      upcomingRefetchSched();
      setSelectedSlot(undefined);

      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_PARKING_SUCCESS,
          params: {
            type: 'reserve',
            parkingSlot,
            selectedDates: dates,
          },
        },
      });

      setSelectedSlot(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const onPressReserveSlot = () => {
    if (!cancelReservation) {
      const title = changeReservation
        ? 'Are you sure you want to change your reservation?'
        : 'Are you sure you want book this parking slot?';

      openModal('WorkStationBookConfirmModal', {
        title: title,
        description: isTandem
          ? 'This is a shared parking slot. Whoever arrives first is required to park at the back.'
          : 'Only dates with complete information will be reserved.',
        onPressYes: async () => {
          if (changeReservation) {
            await handleChangeSlot();
          } else {
            await handleReserveParking();
          }
          closeModal('WorkStationBookConfirmModal');
        },
        onPressNo: () => {
          closeModal('WorkStationBookConfirmModal');
        },
      });
    }
  };

  const onPressViewAll = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_PS_SELECT_DATE,
      },
    });
  };

  const showCancelErrorModal = () => {
    openModal('WorkstationErrorModal', {
      onPressYes: () => {
        closeModal('WorkstationErrorModal');
        navigation.goBack();
      },
    });
  };

  const showCancelReservationModal = (
    psCancel: UpcomingParkingReservationResponse,
  ) => {
    openModal('WorkStationBookConfirmModal', {
      title: 'Are you sure you want to cancel this reservation?',
      onPressYes: async () => {
        const planScheduleDatesId = psCancel.planScheduleDatesId;

        if (!planScheduleDatesId) {
          closeModal('WorkStationBookConfirmModal');
          return;
        }

        try {
          const cancelData = await cancelPSReservation(planScheduleDatesId);
          closeModal('WorkStationBookConfirmModal');

          const dates = [`${formatDate(psCancel.parkingSchedule)}`];

          const parkingSlot = `Basement ${cancelData.parkingFloor || ''}, ${
            cancelData.parkingCode || ''
          }`;

          navigation.navigate(NavigationKey.DRAWER_MAIN, {
            screen: NavigationKey.STACK_LANDING,
            params: {
              screen: NavigationKey.SCREEN_PARKING_SUCCESS,
              params: {
                type: 'cancel',
                parkingSlot,
                selectedDates: dates,
              },
            },
          });
        } catch (error: any) {
          closeModal('WorkStationBookConfirmModal');

          setTimeout(() => {
            if (error?.status === 409) {
              showCancelErrorModal();
            } else {
              navigation.goBack();
            }
          }, 150);
        }
      },
      onPressNo: () => {
        closeModal('WorkStationBookConfirmModal');
        navigation.goBack();
      },
    });
  };

  const slotLabel = useMemo(() => {
    const code = selectedSlot?.parkingCode
      ? `${selectedSlot.parkingCode} - `
      : '';

    if (selectedDates.length === 1) {
      return code + format(new Date(selectedDates[0]), 'd MMM, h aa');
    } else {
      return code + selectedDates.length + ' Days';
    }
  }, [selectedDates, selectedSlot]);

  const formatDate = (date?: Date, formatString = 'EEE, d MMM, h aa') => {
    return date ? format(new Date(date), formatString) : '';
  };

  useEffect(() => {
    if (parkingFloors) {
      const initialFloor = parkingFloors.find(f => f.floor === 2);
      setSelectedFloor(initialFloor);
    }
  }, [parkingFloors]);

  useEffect(() => {
    if (!!changeReservation || !!cancelReservation) {
      setCanDelete(false);
      setParkingDates(
        changeReservation
          ? [
              {
                id: changeReservation.planScheduleDatesId || 0,
                date: scheduledDate(changeReservation.parkingSchedule),
                selected: true,
              },
            ]
          : cancelReservation
          ? [
              {
                id: cancelReservation.planScheduleDatesId || 0,
                date: scheduledDate(cancelReservation.parkingSchedule),
                selected: true,
              },
            ]
          : [],
      );

      return;
    } else {
      setCanDelete(true);
    }

    if (upcomingSched && upcomingSched.length > 0) {
      let dates: ParkingDates[] = [];

      _.forEach(upcomingSched, (d, index) => {
        if (d.scheduleDate) {
          dates.push({
            id: d.planScheduleDatesId || index,
            date: setHours(new Date(d.scheduleDate), 9),
          });
        }
      });

      dates = _.sortBy(dates, d => new Date(d.date));

      if (dates.length > 0) {
        dates[0].selected = true;
        if (isToday(dates[0].date) && getHours(new Date()) >= 9) {
          dates[0].date = addHours(new Date(), 1);
        }
      }

      setParkingDates(dates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeReservation, cancelReservation, upcomingSched]);

  useEffect(() => {
    const dateSelected = parkingDates.filter(d => d.selected);
    if (dateSelected.length) {
      const dates = _.map(dateSelected, d => d.date.toISOString());
      setSelectedDates(dates);
    }
  }, [parkingDates]);

  useEffect(() => {
    if (cancelReservation) {
      showCancelReservationModal(cancelReservation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelReservation]);

  useEffect(() => {
    return () => {
      clearData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView
      edges={['top']}
      style={[layoutStyles.cover, {backgroundColor: FWDColors.orange}]}>
      <View style={[layoutStyles.cover, {backgroundColor: FWDColors.white}]}>
        <View
          style={[
            layoutStyles.cover,
            {
              backgroundColor: FWDColors.transparent,
              paddingBottom: spacer(insets.bottom),
            },
          ]}>
          <View
            style={[
              layoutStyles.cover,
              {
                backgroundColor: FWDColors.orange,
              },
            ]}>
            <NavigationHeader
              flat
              height={72}
              title={
                <View style={{marginLeft: spacer(12)}}>
                  <Typography
                    label="Reserve a Parking"
                    variant="l3-b"
                    color={FWDColors.white}
                  />
                  <TouchableOpacity
                    activeOpacity={0.75}
                    style={[layoutStyles.row, layoutStyles.startCenter]}
                    onPress={onPressFloorSelect}>
                    <View
                      style={[
                        layoutStyles.centerCenter,
                        {
                          marginRight: spacer(4),
                          padding: spacer(2),
                        },
                      ]}>
                      <Workspace
                        height={18}
                        width={18}
                        color={FWDColors.white}
                      />
                    </View>

                    {viewOnly ? (
                      <Typography
                        label={
                          viewReservation && viewReservation.parkingFloor
                            ? `Basement ${viewReservation.parkingFloor}`
                            : 'Select an area'
                        }
                        variant="h2"
                        color={FWDColors.white}
                      />
                    ) : (
                      <Typography
                        label={
                          selectedFloor && selectedFloor.floor
                            ? `Basement ${selectedFloor.floor}`
                            : 'Select an area'
                        }
                        variant="h2"
                        color={FWDColors.white}
                      />
                    )}

                    <View
                      style={[
                        layoutStyles.centerCenter,
                        {
                          marginRight: spacer(4),
                          padding: spacer(2),
                        },
                      ]}>
                      <AngleDownThin
                        height={18}
                        width={18}
                        color={FWDColors.white}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              }
              titleStyles={[layoutStyles.startCenter, {left: spacer(32)}]}
              leftAction={
                <Button
                  iconOnly
                  icon={<Close />}
                  size="small"
                  color="light"
                  onPress={navigation.goBack}
                />
              }
            />

            {!viewOnly && (
              <View
                style={{
                  padding: spacer(16),
                  backgroundColor: FWDColors.greyLight,
                  zIndex: spacer(1),
                }}>
                <View style={[layoutStyles.row, layoutStyles.betweenCenter]}>
                  <Typography
                    label="Select Date/s"
                    variant="l3-m"
                    color={FWDColors.greenDarker}
                  />

                  {parkingDates.length > 5 && (
                    <TouchableOpacity
                      onPress={onPressViewAll}
                      activeOpacity={0.75}
                      style={[layoutStyles.row, layoutStyles.startCenter]}>
                      <Typography
                        label="View All"
                        variant="l3-m"
                        color={FWDColors.orange}
                      />
                      <AngleRightThin
                        width={12}
                        height={12}
                        color={FWDColors.orange}
                        style={{marginLeft: spacer(6)}}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <ScrollView
                  horizontal
                  bounces={false}
                  style={{marginTop: spacer(12)}}>
                  {parkingDates.slice(0, 5).map(parkingDate => (
                    <ParkingDateItem
                      key={parkingDate.id}
                      date={parkingDate.date}
                      selected={parkingDate.selected}
                      viewOnly={!canSelectSchedule}
                      onUnselect={() => onUnselectSchedule(parkingDate.id)}
                      onChangeTime={() => onChangeTime(parkingDate.id)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            <View
              style={[
                layoutStyles.cover,
                layoutStyles.overflowHidden,
                {backgroundColor: FWDColors.white},
              ]}>
              {viewOnly ? (
                <ParkingMap
                  parkingFloor={viewReservation?.parkingFloor}
                  initialSelected={initialSelected}
                  viewOnly={viewOnly}
                  parkingSlotList={parkingSlotList}
                  onPressParkingSlot={onPressParkingSlot}
                />
              ) : (
                <ParkingMap
                  parkingFloor={selectedFloor?.floor}
                  initialSelected={initialSelected}
                  viewOnly={viewOnly}
                  parkingSlotList={parkingSlotList}
                  onPressParkingSlot={onPressParkingSlot}
                />
              )}
            </View>
          </View>

          <View
            style={[
              {
                backgroundColor: FWDColors.white,
                borderTopLeftRadius: spacer(16),
                borderTopRightRadius: spacer(16),
                marginTop: spacer(-16),
              },
            ]}>
            <View
              style={[
                layoutStyles.row,
                layoutStyles.betweenCenter,
                {
                  paddingVertical: spacer(12),
                  paddingHorizontal: spacer(24),
                },
              ]}>
              <ParkingStatus text="Available" color={FWDColors.orange} />
              <ParkingStatus text="Reserved" color={FWDColors.orange20} />
              <ParkingStatus text="Selected" color={FWDColors.greenDark} />
            </View>

            {viewOnly ? (
              <View
                style={[
                  {
                    padding: spacer(24),
                    paddingTop: spacer(8),
                    borderTopWidth: spacer(1),
                    borderTopColor: FWDColors.grey1,
                  },
                ]}>
                <Typography
                  label="Parking Slot"
                  variant="l3-b"
                  color={FWDColors.grey3}
                />

                <View
                  style={[
                    layoutStyles.row,
                    layoutStyles.startStart,
                    {marginTop: spacer(4)},
                  ]}>
                  <View
                    style={[
                      layoutStyles.centerCenter,
                      {
                        paddingHorizontal: spacer(2),
                        marginRight: spacer(6),
                      },
                    ]}>
                    <Parking width={20} height={20} color={FWDColors.orange} />
                  </View>

                  <Typography
                    label={`Basement ${viewReservation?.parkingFloor}, ${viewReservation?.parkingCode}`}
                    variant="h1"
                    style={[layoutStyles.cover]}
                  />
                </View>

                <View style={{marginTop: spacer(8), marginBottom: spacer(4)}}>
                  <Typography
                    label="Selected Dates"
                    variant="l3-b"
                    color={FWDColors.grey3}
                  />
                </View>

                <BookingDate
                  text={formatDate(viewReservation?.parkingSchedule)}
                />
              </View>
            ) : (
              <View
                style={[
                  layoutStyles.row,
                  layoutStyles.startCenter,
                  {
                    paddingVertical: spacer(24),
                    paddingHorizontal: spacer(20),
                    borderTopWidth: spacer(1),
                    borderTopColor: FWDColors.grey1,
                  },
                ]}>
                <View style={[layoutStyles.cover, {marginRight: spacer(12)}]}>
                  <Typography
                    label={selectedSlot?.parkingCode || ''}
                    variant="l2-b"
                    color={FWDColors.grey4}
                  />

                  {selectedDates.length > 0 ? (
                    <Typography
                      label={slotLabel}
                      variant="h2"
                      color={FWDColors.greenDarker}
                      style={{marginTop: spacer(4)}}
                    />
                  ) : (
                    <Typography
                      label="No Slot Selected"
                      variant="h2"
                      color={FWDColors.grey4}
                      style={{marginTop: spacer(4)}}
                    />
                  )}
                </View>

                <Button
                  label={hasSelectedSchedule ? 'Reserve Slot' : 'Pick a slot'}
                  disabled={!hasSelectedSchedule || !selectedSlot}
                  onPress={onPressReserveSlot}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default observer(ParkingSelectScreen);
