import React, {useCallback, useMemo} from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {useModal} from 'react-native-modalfy';
import {format} from 'date-fns';

import {
  AngleRightThin,
  Button,
  Close,
  FWDColors,
  ShadowView,
  Typography,
  CalendarExclamation,
  Calendar,
} from '@/components';
import {CalendarWithInfo} from '@/components/pictograms';
import {layoutStyles, spacer} from '@/utils';
import {
  MissedGracePeriodNotification,
  NavigationHeader,
  WorkstationSeat,
} from '@/views';
import {ModalStackParamsList} from '@/modals';
import {NavigationKey} from '@/navigations';
import {
  useGetUpcomingReservations,
  useGetUpcomingUnscheduledWFB,
  useGetWFOCount,
  useGetMonthPenalty,
  useGetBranchPrefix,
} from '@/services/query';
import {
  UpcomingReservationResponse,
  WorkType,
} from '@/services/api/api.service';
import {useScroll} from '@/hooks/useScroll';

const BookWorkstationScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {AnimatedScrollView, collapsedHeader} = useScroll();

  const {data: penaltyData} = useGetMonthPenalty();

  const {data: upcomingReservationData, refetch: refetchUpcoming} =
    useGetUpcomingReservations();
  const {data: wfoCount, refetch: refetchWfoCount} = useGetWFOCount();
  const {data: wfbList} = useGetUpcomingUnscheduledWFB();
  const {data: branchPrefix} = useGetBranchPrefix();

  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const onPressBookOffice = (
    type: 'view' | 'change' | 'reserve' | 'cancel' = 'reserve',
    data?: UpcomingReservationResponse,
  ) => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_WORKSTATION_SELECT,
        params: data
          ? {
              viewReservation: type === 'view' ? data : undefined,
              changeReservation: type === 'change' ? data : undefined,
              cancelReservation: type === 'cancel' ? data : undefined,
            }
          : {},
      },
    });
  };

  const onPressViewAll = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_UPCOMING_RESERVATIONS,
      },
    });
  };

  const onPressBookBranch = (
    type: 'view' | 'change' | 'reserve' | 'cancel' = 'reserve',
    data?: UpcomingReservationResponse,
  ) => {
    if (type === 'view') {
      if (!data?.planScheduleDatesId) {
        return true;
      }

      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_WORK_FROM_BRANCH_VIEW,
          params: {
            planScheduleDatesId: data.planScheduleDatesId,
          },
        },
      });
    } else {
      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_WORK_FROM_BRANCH,
          params: data
            ? {
                changeReservation: type === 'change' ? data : undefined,
                cancelReservation: type === 'cancel' ? data : undefined,
              }
            : {},
        },
      });
    }
  };

  const onPressViewSeat = (data: UpcomingReservationResponse) => {
    const label =
      data.workType === WorkType.WFO
        ? `Seat ${data.seatCode}`
        : branchPrefix || '';

    const date =
      data.workType === WorkType.WFO
        ? data.workstationSchedule
        : data.branchSchedule;

    openModal('BookSeatModal', {
      label: label || '',
      date,
      onPressView: () => {
        closeModal('BookSeatModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          if (data.workType === WorkType.WFO) {
            onPressBookOffice('view', data);
          } else if (data.workType === WorkType.WFB) {
            onPressBookBranch('view', data);
          }
        }, 150);
      },
      onPressChange: () => {
        closeModal('BookSeatModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          if (data.workType === WorkType.WFO) {
            onPressBookOffice('change', data);
          } else if (data.workType === WorkType.WFB) {
            onPressBookBranch('change', data);
          }
        }, 150);
      },
      onPressCancel: () => {
        closeModal('BookSeatModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          if (data.workType === WorkType.WFO) {
            onPressBookOffice('cancel', data);
          } else if (data.workType === WorkType.WFB) {
            onPressBookBranch('cancel', data);
          }
        }, 150);
      },
    });
  };

  const upcomingWFOdays = useMemo(() => {
    if (wfoCount && wfoCount > 0) {
      return (
        <Text>
          <Typography
            variant="b4-m"
            color={FWDColors.greenDarker}
            label="You have"
            style={[layoutStyles.cover]}
          />

          <Typography
            variant="b4-m"
            color={FWDColors.orange}
            label={` ${wfoCount || 0} upcoming WFO days `}
            style={[layoutStyles.cover]}
          />

          <Typography
            variant="b4-m"
            color={FWDColors.greenDarker}
            label="with no seat reservation yet."
            style={[layoutStyles.cover]}
          />
        </Text>
      );
    } else {
      return (
        <Text>
          <Typography
            variant="b4-m"
            color={FWDColors.greenDarker}
            label="No upcoming"
            style={[layoutStyles.cover]}
          />

          <Typography
            variant="b4-m"
            color={FWDColors.orange}
            label=" WFO "
            style={[layoutStyles.cover]}
          />

          <Typography
            variant="b4-m"
            color={FWDColors.greenDarker}
            label="schedule."
            style={[layoutStyles.cover]}
          />
        </Text>
      );
    }
  }, [wfoCount]);

  const wfbCount = useMemo(() => {
    if (wfbList) {
      return wfbList.length;
    } else {
      return null;
    }
  }, [wfbList]);

  useFocusEffect(
    useCallback(() => {
      refetchUpcoming();
      refetchWfoCount();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

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
        <View style={[layoutStyles.cover]}>
          <NavigationHeader
            height={120}
            collapsedHeight={72}
            collapsed={collapsedHeader}
            title={
              <Typography
                label="Book a Workstation"
                variant="h2"
                color={FWDColors.white}
              />
            }
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

          <AnimatedScrollView>
            <View
              style={[
                {
                  paddingHorizontal: spacer(16),
                },
              ]}>
              <ShadowView
                level={6}
                style={{
                  borderRadius: spacer(8),
                }}>
                <View
                  style={[
                    layoutStyles.row,
                    {
                      borderBottomColor: FWDColors.greyLight,
                      borderBottomWidth: spacer(1),
                      padding: spacer(16),
                    },
                  ]}>
                  <Typography
                    variant="h1"
                    color={FWDColors.greenDarker}
                    label="Upcoming Reservations"
                    style={[layoutStyles.cover]}
                  />

                  {upcomingReservationData &&
                    upcomingReservationData.length > 3 && (
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

                <View
                  style={{
                    paddingVertical: spacer(8),
                    paddingHorizontal: spacer(16),
                  }}>
                  {upcomingReservationData &&
                  upcomingReservationData.length === 0 ? (
                    <View
                      style={[
                        layoutStyles.centerCenter,
                        {paddingTop: spacer(8), paddingBottom: spacer(24)},
                      ]}>
                      <CalendarWithInfo height={64} width={64} />

                      <Typography
                        variant="h2"
                        color={FWDColors.orange}
                        label="No Upcoming Reservations"
                      />
                    </View>
                  ) : (
                    upcomingReservationData
                      ?.map(d => (
                        <WorkstationSeat
                          key={d.planScheduleDatesId}
                          {...d}
                          branchPrefix={branchPrefix}
                          onPress={() => onPressViewSeat(d)}
                        />
                      ))
                      .slice(0, 3)
                  )}
                </View>
              </ShadowView>

              {penaltyData?.workstationPenaltyCount !== undefined &&
                penaltyData.workstationPenaltyCount > 0 && (
                  <MissedGracePeriodNotification
                    penaltyStrike={penaltyData.workstationPenaltyCount}
                    type="workstation"
                    penalizedUntil={penaltyData?.penalizedUntil}
                  />
                )}

              {/* Don't show if count is 0 */}
              <ShadowView
                level={6}
                style={[
                  layoutStyles.fullWidth,
                  {
                    marginTop: spacer(16),
                    borderRadius: spacer(8),
                    backgroundColor: FWDColors.orange5,
                  },
                ]}>
                {penaltyData?.workstationPenaltyCount !== undefined &&
                  penaltyData.workstationPenaltyCount < 3 && (
                    <View
                      style={[
                        layoutStyles.row,
                        layoutStyles.startCenter,
                        {
                          padding: spacer(16),
                          borderBottomColor: FWDColors.lightblue,
                          borderBottomWidth: spacer(1),
                        },
                      ]}>
                      <View
                        style={{
                          height: spacer(10),
                          width: spacer(10),
                          borderRadius: spacer(999),
                          backgroundColor: FWDColors.orange,
                          marginRight: spacer(12),
                        }}
                      />
                      <Typography
                        variant="h1"
                        color={FWDColors.greenDarker}
                        label="Working From Office"
                        style={[layoutStyles.cover]}
                      />
                    </View>
                  )}

                <View style={{padding: spacer(12)}}>
                  <View
                    style={[
                      layoutStyles.row,
                      wfoCount !== undefined &&
                        wfoCount <= 0 &&
                        layoutStyles.startCenter,
                    ]}>
                    <CalendarExclamation
                      width={24}
                      height={24}
                      color={FWDColors.orange}
                    />

                    <View
                      style={[layoutStyles.cover, {marginLeft: spacer(12)}]}>
                      <View>
                        {penaltyData?.workstationPenaltyCount !== undefined &&
                        penaltyData.workstationPenaltyCount < 3 ? (
                          upcomingWFOdays
                        ) : (
                          <>
                            <Text style={{lineHeight: spacer(17.5)}}>
                              <Typography
                                align="center"
                                label={
                                  "You can't book a workstation for 2 weeks.\nPlease check back again on "
                                }
                                variant="h1"
                                color={FWDColors.greenDarker}
                              />
                              <Typography
                                align="center"
                                label={`${format(
                                  new Date(
                                    penaltyData?.penalizedUntil || Date.now(),
                                  ),
                                  'MMMM d, yyyy',
                                )}`}
                                variant="h1"
                                color={FWDColors.orange}
                              />
                              <Typography
                                align="center"
                                label="."
                                variant="h1"
                                color={FWDColors.greenDarker}
                              />
                            </Text>

                            <Text
                              style={{
                                lineHeight: spacer(21),
                                marginTop: spacer(8),
                              }}>
                              <Typography
                                align="center"
                                label={'You can only check-in in the '}
                                variant="b4-b"
                                color={FWDColors.greenDarker}
                              />
                              <TouchableWithoutFeedback>
                                <Typography
                                  align="center"
                                  label={'Innovation '}
                                  variant="b4-m"
                                  color={FWDColors.orange}
                                />
                              </TouchableWithoutFeedback>
                              <TouchableWithoutFeedback>
                                <Typography
                                  align="center"
                                  label={'Area'}
                                  variant="b4-m"
                                  color={FWDColors.orange}
                                />
                              </TouchableWithoutFeedback>
                              <Typography
                                align="center"
                                label={' and '}
                                variant="b4-b"
                                color={FWDColors.greenDarker}
                              />
                              <TouchableWithoutFeedback>
                                <Typography
                                  align="center"
                                  label={'Collaboration '}
                                  variant="b4-m"
                                  color={FWDColors.orange}
                                />
                              </TouchableWithoutFeedback>
                              <TouchableWithoutFeedback>
                                <Typography
                                  align="center"
                                  label={'Area'}
                                  variant="b4-m"
                                  color={FWDColors.orange}
                                />
                              </TouchableWithoutFeedback>
                              <Typography
                                align="center"
                                label="."
                                variant="b4-b"
                                color={FWDColors.greenDarker}
                              />
                            </Text>

                            <Text
                              style={{
                                lineHeight: spacer(21),
                                marginTop: spacer(8),
                              }}>
                              <Typography
                                align="center"
                                label={'If you have clarifications, contact '}
                                variant="b4-b"
                                color={FWDColors.greenDarker}
                              />
                              <TouchableWithoutFeedback>
                                <Typography
                                  align="center"
                                  label={'People '}
                                  variant="b4-m"
                                  color={FWDColors.orange}
                                />
                              </TouchableWithoutFeedback>
                              <TouchableWithoutFeedback>
                                <Typography
                                  align="center"
                                  label={'and '}
                                  variant="b4-m"
                                  color={FWDColors.orange}
                                />
                              </TouchableWithoutFeedback>
                              <TouchableWithoutFeedback>
                                <Typography
                                  align="center"
                                  label={'Culture'}
                                  variant="b4-m"
                                  color={FWDColors.orange}
                                />
                              </TouchableWithoutFeedback>
                              <Typography
                                align="center"
                                label="."
                                variant="b4-b"
                                color={FWDColors.greenDarker}
                              />
                            </Text>
                          </>
                        )}
                      </View>

                      {wfoCount !== undefined &&
                        wfoCount > 0 &&
                        penaltyData?.workstationPenaltyCount !== undefined &&
                        penaltyData.workstationPenaltyCount < 3 && (
                          <TouchableOpacity
                            style={[
                              layoutStyles.row,
                              layoutStyles.startCenter,
                              {
                                marginTop: spacer(12),
                              },
                            ]}
                            activeOpacity={0.75}
                            onPress={() => onPressBookOffice()}>
                            <Typography
                              label="Book Now"
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
                  </View>
                </View>
              </ShadowView>

              {wfbCount !== null && (
                <ShadowView
                  level={6}
                  style={[
                    layoutStyles.fullWidth,
                    {
                      marginTop: spacer(16),
                      borderRadius: spacer(8),
                      backgroundColor: FWDColors.yellow20,
                    },
                  ]}>
                  <View
                    style={[
                      layoutStyles.row,
                      layoutStyles.startCenter,
                      {
                        padding: spacer(16),
                        borderBottomColor: FWDColors.lightblue,
                        borderBottomWidth: spacer(1),
                      },
                    ]}>
                    <View
                      style={{
                        height: spacer(10),
                        width: spacer(10),
                        borderRadius: spacer(999),
                        backgroundColor: FWDColors.yellow,
                        marginRight: spacer(12),
                      }}
                    />
                    <Typography
                      variant="h1"
                      color={FWDColors.greenDarker}
                      label="Working From Branch"
                      style={[layoutStyles.cover]}
                    />
                  </View>

                  <View style={{padding: spacer(12)}}>
                    <View
                      style={[
                        layoutStyles.row,
                        wfbCount <= 0 && layoutStyles.startCenter,
                      ]}>
                      <Calendar
                        width={24}
                        height={24}
                        color={FWDColors.orange}
                      />

                      <View
                        style={[layoutStyles.cover, {marginLeft: spacer(12)}]}>
                        <View style={[layoutStyles.row]}>
                          {wfbCount > 0 ? (
                            <Text>
                              <Typography
                                variant="b4-m"
                                color={FWDColors.greenDarker}
                                label="You have"
                                style={[layoutStyles.cover]}
                              />

                              <Typography
                                variant="b4-m"
                                color={FWDColors.orange}
                                label={` ${wfbCount} upcoming WFB days `}
                                style={[layoutStyles.cover]}
                              />

                              <Typography
                                variant="b4-m"
                                color={FWDColors.greenDarker}
                                label="with no seat reservation yet."
                                style={[layoutStyles.cover]}
                              />
                            </Text>
                          ) : (
                            <Text>
                              <Typography
                                variant="b4-m"
                                color={FWDColors.greenDarker}
                                label="No upcoming"
                                style={[layoutStyles.cover]}
                              />

                              <Typography
                                variant="b4-m"
                                color={FWDColors.orange}
                                label={' WFB '}
                                style={[layoutStyles.cover]}
                              />

                              <Typography
                                variant="b4-m"
                                color={FWDColors.greenDarker}
                                label="schedule"
                                style={[layoutStyles.cover]}
                              />
                            </Text>
                          )}
                        </View>

                        {wfbCount > 0 && (
                          <TouchableOpacity
                            style={[
                              layoutStyles.row,
                              layoutStyles.startCenter,
                              {
                                marginTop: spacer(12),
                              },
                            ]}
                            activeOpacity={0.75}
                            onPress={() => onPressBookBranch()}>
                            <Typography
                              label="Book Now"
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
                    </View>
                  </View>
                </ShadowView>
              )}
            </View>
          </AnimatedScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BookWorkstationScreen;
