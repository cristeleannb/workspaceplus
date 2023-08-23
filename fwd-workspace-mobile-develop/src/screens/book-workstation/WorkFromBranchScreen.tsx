import React, {useEffect, useMemo, useState} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/core';
import {useModal} from 'react-native-modalfy';
import _ from 'lodash';
import {format, setHours, setMinutes, setSeconds} from 'date-fns';
import {observer} from 'mobx-react';

import {
  Button,
  Close,
  FWDColors,
  Typography,
  AngleDownThin,
  Branch,
  AngleRightThin,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {
  NavigationHeader,
  WorkStationDateItem,
  BranchOffice,
  FullScreenLoader,
} from '@/views';
import {ModalStackParamsList} from '@/modals';
import {NavigationKey, WorkStationWFBScreenRouteProp} from '@/navigations';
import {
  useGetBranches,
  useGetUpcomingUnscheduledWFB,
  useReserveBranch,
  useChangeWFBReservation,
  useCancelWFBReservation,
} from '@/services/query/useWorkstation';
import {useGetBranchPrefix} from '@/services/query';
import {useStores} from '@/stores';
import {WorkDates} from '@/types';
import {
  BranchModel,
  EmployeeBranchReservationModel,
  UpcomingReservationResponse,
} from '@/services/api/api.service';
import {useWorkDate} from '@/hooks/useWorkDate';

const scheduledDate = (date?: Date) => {
  return date ? new Date(new Date(date)) : new Date();
};

const WorkFromBranchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<WorkStationWFBScreenRouteProp>();
  const {changeReservation, cancelReservation} = route.params;
  const insets = useSafeAreaInsets();
  const {workstationStore} = useStores();
  const {
    workDates,
    setWorkDates,
    setCanDelete,
    onUnselectSchedule,
    onChangeTime,
    clearData,
  } = useWorkDate();

  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const [selectedCityId, setSelectedCityId] = useState<number | undefined>();
  const [selectedBranchId, setSelectedBranchId] = useState<
    number | undefined
  >();

  const {data: branchPrefix} = useGetBranchPrefix();
  const {data: branchesData, isLoading: getBrancesLoading} = useGetBranches();
  const {data: upcomingWFBList} = useGetUpcomingUnscheduledWFB();
  const {mutateAsync: reserveBranch, isLoading: reserveBranchLoading} =
    useReserveBranch();
  const {mutateAsync: changeWFBReservation} = useChangeWFBReservation();
  const {mutateAsync: cancelWFBReservation} = useCancelWFBReservation();

  const branchList = useMemo(() => {
    if (branchesData) {
      const branchListData = branchesData.branchList;

      if (branchListData) {
        const transformedBranchList = _.chain(branchListData)
          .filter(branch => branch.branchId !== 0)
          .sortBy(branch => branch.branchName?.toLowerCase())
          .value();

        return transformedBranchList;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }, [branchesData]);

  const transformedBranchList = useMemo(() => {
    return _.mapValues(
      _.groupBy(branchList, i => i.cityId),
      branches => ({
        cityId: branches[0].cityId,
        cityName: branches[0].cityName,
        items: branches,
      }),
    );
  }, [branchList]);

  const flatTransformedBranchList = useMemo(() => {
    return _.chain(_.entries(transformedBranchList))
      .map(([, v]) => ({
        cityId: v.cityId,
        cityName: v.cityName,
      }))
      .sortBy(item => item.cityName)
      .value();
  }, [transformedBranchList]);

  const selectedBranch = useMemo(() => {
    if (selectedCityId !== undefined) {
      const branchListData = transformedBranchList[selectedCityId];

      if (branchListData) {
        return branchListData.cityName;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }, [selectedCityId, transformedBranchList]);

  const selectedBranchList = useMemo(() => {
    if (selectedCityId !== undefined) {
      const branchListData = transformedBranchList[selectedCityId];

      if (branchListData) {
        return branchListData.items;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }, [selectedCityId, transformedBranchList]);

  const showAreaList = () => {
    openModal('WorkStationBranchModal', {
      onPressBranch: (id: number) => {
        setSelectedCityId(id);
        setSelectedBranchId(undefined);

        if (!workstationStore.defaultBranchCityId) {
          workstationStore.setDefaultBranchCityId(id);
        }
      },
      selectedCityId,
      branchCityList: flatTransformedBranchList,
    });
  };

  const onPressContinue = () => {
    openModal('WorkStationBookConfirmModal', {
      title: 'Are you sure you want book this branch?',
      description: 'Only dates with complete information will be reserved.',
      onPressYes: async () => {
        if (changeReservation) {
          await onChangeBranch();
        } else {
          await onReserveBranch();
        }
        closeModal('WorkStationBookConfirmModal');
      },
      onPressNo: () => {
        closeModal('WorkStationBookConfirmModal');
      },
    });
  };

  const onSelectBranch = (branchId: number) => {
    if (selectedBranchId !== branchId) {
      setSelectedBranchId(branchId);
    }
  };

  const hasSelectedSchedule = useMemo(() => {
    const selectedSchedules = _.filter(
      workDates,
      workDate => !!workDate.selected,
    );
    return selectedSchedules.length > 0;
  }, [workDates]);

  const disableSubmit = useMemo(() => {
    if (cancelReservation) {
      return true;
    }

    if (changeReservation) {
      if (changeReservation.branchId === selectedBranchId) {
        return true;
      }
    }

    if (selectedCityId && selectedBranchId && hasSelectedSchedule) {
      return false;
    } else {
      return true;
    }
  }, [
    changeReservation,
    cancelReservation,
    selectedCityId,
    selectedBranchId,
    hasSelectedSchedule,
  ]);

  const canSelectSchedule = useMemo(() => {
    if (!!changeReservation || !!cancelReservation) {
      return false;
    } else {
      return true;
    }
  }, [changeReservation, cancelReservation]);

  const onReserveBranch = async () => {
    try {
      const selectedWorkDates = _.filter(
        workDates,
        workDate => !!workDate.selected,
      );

      const branchReservations: EmployeeBranchReservationModel[] = _.map(
        selectedWorkDates,
        selectedWorkDate => ({
          planScheduleDatesId: selectedWorkDate.id,
          scheduleDate: selectedWorkDate.date,
          branchId: selectedBranchId,
          branchSchedule: setMinutes(
            setSeconds(new Date(selectedWorkDate.date), 0),
            0,
          ),
        }),
      );

      await reserveBranch({
        employeeBranchReservationModelCollection: branchReservations,
      });

      const branchData = _.find(
        selectedBranchList,
        branch => branch.branchId === selectedBranchId,
      );
      const workstation = `${selectedBranch}, ${branchData?.branchName}`;
      const selectedDates = _.filter(
        workDates,
        workDate => !!workDate.selected,
      ).map(workDate => format(new Date(workDate.date), 'EEE, d MMM, h aa'));

      navigateToSuccessPage('reserve', workstation, selectedDates);
    } catch (error) {}
  };

  const onChangeBranch = async () => {
    try {
      if (
        !changeReservation ||
        !changeReservation?.planScheduleDatesId ||
        !changeReservation?.branchId
      ) {
        return;
      }

      const changeResponse = await changeWFBReservation({
        planScheduleDatesId: changeReservation.planScheduleDatesId,
        body: {
          branchId: selectedBranchId,
          branchSchedule: setMinutes(
            setSeconds(new Date(workDates?.[0]?.date || Date.now()), 0),
            0,
          ),
        },
      });

      const workstation = `${selectedBranch}, ${changeResponse?.branchName}`;
      const selectedDates = [
        format(
          new Date(
            changeResponse.branchSchedule
              ? changeResponse.branchSchedule
              : new Date(),
          ),
          'EEE, d MMM, h aa',
        ),
      ];

      navigateToSuccessPage('change', workstation, selectedDates);
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToSuccessPage = (
    type: 'reserve' | 'change' | 'cancel',
    workstation: string,
    selectedDates: string[],
  ) => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_BOOKING_WFB_SUCCESS,
        params: {
          type: type,
          workstation: workstation,
          selectedDates: selectedDates,
        },
      },
    });
  };

  const showCancelReservationModal = (
    reservationData: UpcomingReservationResponse,
    branch: string,
  ) => {
    openModal('WorkStationBookConfirmModal', {
      title: 'Are you sure you want to cancel this reservation?',
      onPressYes: async () => {
        const planScheduleDatesId = reservationData.planScheduleDatesId;

        if (!planScheduleDatesId) {
          closeModal('WorkStationBookConfirmModal');
          return;
        }

        const cancelResponse = await cancelWFBReservation(planScheduleDatesId);
        closeModal('WorkStationBookConfirmModal');

        const workstation = `${branch}, ${cancelResponse?.branchName}`;
        const selectedDates = [
          format(
            scheduledDate(cancelResponse.branchSchedule),
            'EEE, d MMM, h aa',
          ),
        ];
        navigateToSuccessPage('cancel', workstation, selectedDates);
      },
      onPressNo: () => {
        closeModal('WorkStationBookConfirmModal');
        navigation.goBack();
      },
    });
  };

  const onPressViewAll = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_WFB_SELECT_DATE,
      },
    });
  };

  useEffect(() => {
    if (
      !workstationStore.defaultBranchCityId &&
      flatTransformedBranchList.length > 0
    ) {
      showAreaList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workstationStore.defaultBranchCityId, flatTransformedBranchList]);

  useEffect(() => {
    if (!!changeReservation || !!cancelReservation) {
      setCanDelete(false);
      setWorkDates(
        changeReservation
          ? [
              {
                id: changeReservation.planScheduleDatesId || 0,
                date: scheduledDate(changeReservation.branchSchedule),
                selected: true,
              },
            ]
          : cancelReservation
          ? [
              {
                id: cancelReservation.planScheduleDatesId || 0,
                date: scheduledDate(cancelReservation.branchSchedule),
                selected: true,
              },
            ]
          : [],
      );

      return;
    } else {
      setCanDelete(true);
    }

    if (upcomingWFBList && upcomingWFBList.length > 0) {
      let dates: WorkDates[] = [];

      _.forEach(upcomingWFBList, (d, index) => {
        if (d.scheduleDate) {
          dates.push({
            id: d.planScheduleDatesId || index,
            date: setHours(new Date(d.scheduleDate), 9),
          });

          // set the first date to selected and default time to 9am (local time)
          if (index === 0) {
            dates[0].selected = true;
          }
        }
      });

      dates = _.sortBy(dates, d => new Date(d.date));
      setWorkDates(dates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeReservation, cancelReservation, upcomingWFBList]);

  useEffect(() => {
    if (!!changeReservation || !!cancelReservation) {
      let branchData: BranchModel | undefined;

      if (changeReservation) {
        branchData = _.find(
          branchList,
          branch => branch.branchId === changeReservation?.branchId,
        );
      } else if (cancelReservation) {
        branchData = _.find(
          branchList,
          branch => branch.branchId === cancelReservation?.branchId,
        );
      }

      if (branchData) {
        setSelectedCityId(branchData.cityId);
        setSelectedBranchId(branchData.branchId);
      }
    } else {
      setSelectedCityId(workstationStore.defaultBranchCityId);
    }
  }, [branchList, changeReservation, cancelReservation, workstationStore]);

  useEffect(() => {
    if (cancelReservation && selectedBranch) {
      showCancelReservationModal(cancelReservation, selectedBranch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelReservation, selectedBranch]);

  useEffect(() => {
    return () => {
      clearData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (getBrancesLoading) {
    return <FullScreenLoader />;
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        layoutStyles.cover,
        {
          backgroundColor: FWDColors.orange,
        },
      ]}>
      <View
        style={[
          layoutStyles.cover,
          {
            backgroundColor: FWDColors.white,
            paddingBottom: spacer(insets.bottom),
          },
        ]}>
        <View
          style={[layoutStyles.cover, {backgroundColor: FWDColors.greyLight}]}>
          <NavigationHeader
            flat
            height={72}
            title={
              <View style={{marginLeft: spacer(12)}}>
                <Typography
                  label="Choose a branch location"
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
                    <Branch height={22} width={22} color={FWDColors.white} />
                  </View>

                  <Typography
                    label={selectedBranch || 'Select a branch'}
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

          <View style={{padding: spacer(16)}}>
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
              style={{marginTop: spacer(8)}}>
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

          <ScrollView
            bounces={false}
            style={[
              layoutStyles.cover,
              {
                borderTopLeftRadius: spacer(24),
                borderTopRightRadius: spacer(24),
                backgroundColor: FWDColors.white,
                paddingVertical: spacer(24),
                paddingHorizontal: spacer(16),
              },
            ]}
            contentInset={{bottom: spacer(24)}}>
            {selectedBranchList.map(branch => {
              return (
                <BranchOffice
                  key={branch.branchId}
                  selected={branch.branchId === selectedBranchId}
                  branchPrefix={branchPrefix}
                  branchName={`${branch.branchName}`}
                  branchAddress={`${branch?.branchAddress}`}
                  branchOfficeHours={`${branch?.branchOfficeHours}`}
                  branchContactNumber={`${branch?.branchContactNumber}`}
                  onPress={() =>
                    branch.branchId && onSelectBranch(branch.branchId)
                  }
                />
              );
            })}
          </ScrollView>
        </View>

        <View
          style={[
            {
              padding: spacer(24),
              backgroundColor: FWDColors.white,
              borderTopWidth: spacer(1),
              borderTopColor: FWDColors.grey1,
            },
          ]}>
          <Button
            label="Continue"
            onPress={onPressContinue}
            disabled={disableSubmit}
            loading={reserveBranchLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default observer(WorkFromBranchScreen);
