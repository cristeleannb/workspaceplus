import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/core';
import {useModal} from 'react-native-modalfy';
import BottomSheet from '@gorhom/bottom-sheet';
import {observer} from 'mobx-react';
import {
  format,
  setHours,
  addHours,
  isToday,
  getHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import _ from 'lodash';

import {
  Button,
  Close,
  FWDColors,
  Typography,
  Workspace,
  AngleDownThin,
  DynamicBottomSheet,
  AngleRightThin,
  Left,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {
  NavigationHeader,
  WorkStationStatus,
  WorkStationDateItem,
  WorkStationHelperBottomSheet,
  WorkstationMap,
  BookingDate,
  FullScreenLoader,
} from '@/views';
import {ModalStackParamsList} from '@/modals';
import {useStores} from '@/stores';
import {NavigationKey, WorkStationSelectScreenRouteProp} from '@/navigations';
import {WorkDates} from '@/types';

import {
  useGetDivisionList,
  useGetWorkstations,
  useReserveWorkstation,
  useCancelWSReservation,
  useChangeWSReservation,
  useUpcomingUnscheduleWFO,
} from '@/services/query';
import {
  PostWorkstationReservationRequest,
  DivisionEntity,
  UpcomingReservationResponse,
} from '@/services/api/api.service';
import {TableOffice} from '@/components/pictograms';
import {useWorkDate} from '@/hooks/useWorkDate';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

const scheduledDate = (date?: Date) => {
  return date ? new Date(date) : new Date();
};

const formatDate = (date?: Date, formatString = 'EEE, d MMM, h aa') => {
  return date ? format(new Date(date), formatString) : '';
};

const WorkStationSelectScreen = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const route = useRoute<WorkStationSelectScreenRouteProp>();

  const {changeReservation, cancelReservation, viewReservation} = route.params;

  const [viewOnly] = useState(viewReservation ? true : false);

  const {appSettingStore} = useStores();
  const {
    workDates,
    setWorkDates,
    setCanDelete,
    onUnselectSchedule,
    onChangeTime,
    clearData,
  } = useWorkDate();

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {data: divisionList, isFetching: getDivisionLoading} =
    useGetDivisionList();

  const {
    data: upcomingWFOList,
    refetch: upcomingRefetchSched,
    isFetching: getUpcomingLoading,
  } = useUpcomingUnscheduleWFO();

  const {mutateAsync: reserveWS} = useReserveWorkstation();
  const {mutateAsync: changeWSReservation} = useChangeWSReservation();
  const {mutateAsync: cancelWSReservation} = useCancelWSReservation();

  const [selectedDates, setSelectedDates] = useState<string[]>(
    changeReservation
      ? [scheduledDate(changeReservation.workstationSchedule).toISOString()]
      : cancelReservation
      ? [scheduledDate(cancelReservation.workstationSchedule).toISOString()]
      : [],
  );
  const {data: workstationList, refetch: refetchWorkstationList} =
    useGetWorkstations(selectedDates);

  const [selectedArea, setSelectedArea] = useState<
    DivisionEntity | undefined
  >();
  const [isZoomed, setIsZoomed] = useState(false);

  const [initialSelected, setInitialSelected] = useState<string | undefined>(
    changeReservation
      ? changeReservation.workstationId?.toString()
      : cancelReservation
      ? cancelReservation.workstationId?.toString()
      : viewReservation
      ? viewReservation.workstationId?.toString()
      : undefined,
  );
  const [selectedSeat, setSelectedSeat] = useState<
    | {
        id?: string;
        seatCode?: string;
        divisionName?: string;
      }
    | undefined
  >(
    changeReservation
      ? {
          id: changeReservation.workstationId?.toString(),
          seatCode: changeReservation.seatCode,
        }
      : cancelReservation
      ? {
          id: cancelReservation.workstationId?.toString(),
          seatCode: cancelReservation.seatCode,
        }
      : viewReservation
      ? {
          id: viewReservation.workstationId?.toString(),
          seatCode: viewReservation.seatCode,
        }
      : undefined,
  );

  const [layoutDone, setLayoutDone] = useState(false);

  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const sheetClose = () => {
    sheetRef.current?.close();
    appSettingStore.setShowWorkStationHelper(false);
    showAreaList();
  };

  const showAreaList = () => {
    openModal('WorkStationAreaModal', {
      onPressArea: area => {
        setSelectedArea(area);
        setIsZoomed(true);
        closeModal('WorkStationAreaModal');
      },
      areaList: divisionList || [],
      selectedId: selectedArea?.divisionId,
    });
  };

  const willReserveSeat = async () => {
    try {
      const data = selectedDates.map(date => {
        const d: PostWorkstationReservationRequest = {
          workstationId: selectedSeat?.id,
          date: setMinutes(setSeconds(new Date(date), 0), 0),
        };

        return d;
      });

      setInitialSelected(selectedSeat?.id);
      const response = await reserveWS(data);

      const workstation = `${response[0].divisionName}, Seat ${response[0].seatCode}`;

      const dates = response.map(({workstationSchedule}) => {
        return formatDate(workstationSchedule);
      });

      refetchWorkstationList();
      upcomingRefetchSched();
      setSelectedSeat(undefined);
      setInitialSelected(undefined);

      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_BOOKING_WFO_SUCCESS,
          params: {
            type: 'reserve',
            workstation,
            selectedDates: dates,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const willChangeSeat = async () => {
    try {
      if (
        !selectedSeat?.id ||
        !changeReservation ||
        !changeReservation?.planScheduleDatesId ||
        !changeReservation?.workstationId
      ) {
        return;
      }

      const response = await changeWSReservation({
        planScheduleDatesId: changeReservation.planScheduleDatesId,
        body: {
          workstationId: selectedSeat.id,
          date: setMinutes(
            setSeconds(new Date(workDates?.[0]?.date || Date.now()), 0),
            0,
          ),
        },
      });

      const workstation = `${response.divisionName}, Seat ${response.seatCode}`;

      const dates = [formatDate(response?.workstationSchedule)];

      refetchWorkstationList();
      upcomingRefetchSched();
      setSelectedSeat(undefined);

      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_BOOKING_WFO_SUCCESS,
          params: {
            type: 'change',
            workstation,
            selectedDates: dates,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onPressReserveSeat = () => {
    if (!cancelReservation) {
      const title = changeReservation
        ? 'Are you sure you want to change your reservation?'
        : 'Are you sure you want book this workstation?';

      openModal('WorkStationBookConfirmModal', {
        title: title,
        description: 'Only dates with complete information will be reserved.',
        onPressYes: async () => {
          if (changeReservation) {
            await willChangeSeat();
          } else {
            await willReserveSeat();
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
        screen: NavigationKey.SCREEN_WS_SELECT_DATE,
      },
    });
  };

  useEffect(() => {
    if (!!changeReservation || !!cancelReservation) {
      setCanDelete(false);
      setWorkDates(
        changeReservation
          ? [
              {
                id: changeReservation.planScheduleDatesId || 0,
                date: scheduledDate(changeReservation.workstationSchedule),
                selected: true,
              },
            ]
          : cancelReservation
          ? [
              {
                id: cancelReservation.planScheduleDatesId || 0,
                date: scheduledDate(cancelReservation.workstationSchedule),
                selected: true,
              },
            ]
          : [],
      );

      return;
    } else {
      setCanDelete(true);
    }

    if (upcomingWFOList && upcomingWFOList.length > 0) {
      let dates: WorkDates[] = [];

      _.forEach(upcomingWFOList, (d, index) => {
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

      setWorkDates(dates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeReservation, cancelReservation, upcomingWFOList]);

  useEffect(() => {
    const dateSelected = workDates.filter(d => d.selected);
    if (dateSelected.length) {
      const dates = _.map(dateSelected, d => d.date.toISOString());
      setSelectedDates(dates);
    }
  }, [workDates]);

  const seatLabel = useMemo(() => {
    const code = selectedSeat?.seatCode ? `${selectedSeat.seatCode} - ` : '';

    if (selectedDates.length === 1) {
      return code + format(new Date(selectedDates[0]), 'd MMM, h aa');
    } else {
      return code + selectedDates.length + ' Days';
    }
  }, [selectedDates, selectedSeat]);

  const onPressWorkstation = (
    id?: string,
    seatCode?: string,
    divisionName?: string,
  ) => {
    setSelectedSeat({id, seatCode, divisionName});
  };

  const onLayout = () => {
    if (appSettingStore.showWorkStationHelper) {
      setTimeout(() => {
        sheetRef.current?.expand();
      }, 750);
    }
    setLayoutDone(true);
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
    wsCancel: UpcomingReservationResponse,
  ) => {
    openModal('WorkStationBookConfirmModal', {
      title: 'Are you sure you want to cancel this reservation?',
      onPressYes: async () => {
        const planScheduleDatesId = wsCancel.planScheduleDatesId;

        if (!planScheduleDatesId) {
          closeModal('WorkStationBookConfirmModal');
          return;
        }

        try {
          const cancelData = await cancelWSReservation(planScheduleDatesId);
          closeModal('WorkStationBookConfirmModal');

          const dates = [`${formatDate(wsCancel.workstationSchedule)}`];

          const workstation = `${cancelData.divisionName || ''}, Seat ${
            cancelData.seatCode || ''
          }`;

          navigation.navigate(NavigationKey.DRAWER_MAIN, {
            screen: NavigationKey.STACK_LANDING,
            params: {
              screen: NavigationKey.SCREEN_BOOKING_WFO_SUCCESS,
              params: {
                type: 'cancel',
                workstation,
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

  const canSelectSchedule = useMemo(() => {
    if (!!changeReservation || !!cancelReservation) {
      return false;
    } else {
      return true;
    }
  }, [changeReservation, cancelReservation]);

  const hasSelectedSchedule = useMemo(() => {
    const selectedSchedules = _.filter(
      workDates,
      workDate => !!workDate.selected,
    );
    return selectedSchedules.length > 0;
  }, [workDates]);

  useEffect(() => {
    if (divisionList && layoutDone) {
      const mainDivision = divisionList.find(d => d.isMain);
      if (!initialSelected) {
        setSelectedArea(mainDivision);
      } else if (changeReservation) {
        const division = divisionList.find(
          d => d.divisionId === changeReservation.divisionId,
        );
        setSelectedArea(division);
      }
      setIsZoomed(true);
    }

    return () => {
      setSelectedArea(undefined);
    };
  }, [divisionList, initialSelected, layoutDone, changeReservation]);

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
      style={[layoutStyles.cover, {backgroundColor: FWDColors.orange}]}
      onLayout={onLayout}>
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
            style={[layoutStyles.cover, {backgroundColor: FWDColors.orange}]}>
            {viewOnly ? (
              <NavigationHeader
                flat
                height={72}
                title={
                  <Typography
                    label="View Workstation"
                    variant="h2"
                    color={FWDColors.white}
                  />
                }
                leftAction={
                  <Button
                    iconOnly
                    icon={<Left />}
                    size="small"
                    color="light"
                    onPress={navigation.goBack}
                  />
                }
              />
            ) : (
              <NavigationHeader
                flat
                height={72}
                title={
                  <View
                    style={{
                      paddingLeft: spacer(12),
                      width: screenWidth - spacer(92),
                    }}>
                    <Typography
                      label="Book an Office Workstation"
                      variant="l3-b"
                      color={FWDColors.white}
                    />

                    <TouchableOpacity
                      activeOpacity={0.75}
                      style={[layoutStyles.row, layoutStyles.startCenter]}
                      onPress={showAreaList}>
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

                      <Typography
                        label={selectedArea?.divisionName || 'Select an area'}
                        variant="h2"
                        color={FWDColors.white}
                      />

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
            )}

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

                  {workDates.length > 5 && (
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
                  {workDates.slice(0, 5).map(workDate => (
                    <WorkStationDateItem
                      key={workDate.id}
                      date={workDate.date}
                      selected={workDate.selected}
                      viewOnly={!canSelectSchedule}
                      onUnselect={() => onUnselectSchedule(workDate.id)}
                      onChangeTime={() => onChangeTime(workDate.id)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            <View
              style={[
                layoutStyles.cover,
                layoutStyles.overflowHidden,
                {backgroundColor: FWDColors.white, paddingBottom: spacer(12)},
              ]}>
              <WorkstationMap
                initialSelected={initialSelected}
                selectedDivisionId={selectedArea?.divisionId}
                divisionList={divisionList}
                workstationList={workstationList}
                isZoomed={isZoomed}
                onPressWorkstation={onPressWorkstation}
                onPressDivision={setSelectedArea}
                viewOnly={viewOnly}
                onZoomChange={zoom => setIsZoomed(zoom)}
              />
            </View>
          </View>

          <View
            style={[
              {
                borderTopLeftRadius: spacer(16),
                borderTopRightRadius: spacer(16),
                backgroundColor: FWDColors.white,
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
              <WorkStationStatus text="Available" color={FWDColors.orange} />
              <WorkStationStatus text="Reserved" color={FWDColors.orange20} />
              <WorkStationStatus text="Selected" color={FWDColors.greenDark} />
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
                  label="Workstation"
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
                    <TableOffice width={20} height={20} />
                  </View>

                  <Typography
                    label={
                      (viewReservation?.divisionName || '') +
                      (viewReservation?.seatCode
                        ? `, Seat ${viewReservation.seatCode}`
                        : '')
                    }
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
                  text={formatDate(viewReservation?.workstationSchedule)}
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
                    label={
                      selectedSeat?.divisionName ||
                      changeReservation?.divisionName ||
                      cancelReservation?.divisionName ||
                      selectedArea?.divisionName ||
                      ''
                    }
                    variant="l2-b"
                    color={FWDColors.grey4}
                  />

                  {hasSelectedSchedule && selectedSeat ? (
                    <Typography
                      label={seatLabel}
                      variant="h2"
                      color={FWDColors.greenDarker}
                      style={{marginTop: spacer(4)}}
                    />
                  ) : (
                    <Typography
                      label="No Seat Selected"
                      variant="h2"
                      color={FWDColors.grey4}
                      style={{marginTop: spacer(4)}}
                    />
                  )}
                </View>

                <Button
                  label={hasSelectedSchedule ? 'Reserve Seat' : 'Pick a seat'}
                  disabled={!hasSelectedSchedule || !selectedSeat}
                  onPress={onPressReserveSeat}
                />
              </View>
            )}
          </View>
        </View>
      </View>

      {(getDivisionLoading || getUpcomingLoading) && (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 99,
            width: screenWidth,
            height: screenHeight,
          }}>
          <FullScreenLoader />
        </View>
      )}

      <DynamicBottomSheet ref={sheetRef}>
        <WorkStationHelperBottomSheet onClose={sheetClose} />
      </DynamicBottomSheet>
    </SafeAreaView>
  );
};

export default observer(WorkStationSelectScreen);
