import React, {useCallback, useMemo} from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {format} from 'date-fns';

import {
  NavigationHeader,
  ParkingSlot,
  MissedGracePeriodNotification,
} from '@/views';
import {
  AngleRightThick,
  AngleRightThin,
  Button,
  CalendarExclamation,
  Close,
  FWDColors,
  ShadowView,
  Typography,
} from '@/components';
import {spacer, layoutStyles} from '@/utils';
import {useScroll} from '@/hooks/useScroll';
import {NavigationKey} from '@/navigations';
import {
  useUpcomingUnscheduledParkingDates,
  useGetUpcomingParkingReservations,
  useGetMonthParkingPenalty,
} from '@/services/query';
import {CalendarWithInfo} from '@/components/pictograms';
import {UpcomingParkingReservationResponse} from '@/services/api/api.service';
import {useModal} from 'react-native-modalfy';
import {ModalStackParamsList} from '@/modals';

const ReserveParkingLandingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {AnimatedScrollView, collapsedHeader} = useScroll();

  const {data: penaltyData} = useGetMonthParkingPenalty();
  const {data: upcomingUnscheduled, refetch: refetchUnscheduled} =
    useUpcomingUnscheduledParkingDates();
  const {data: upcomingReservations, refetch: refetchUpcoming} =
    useGetUpcomingParkingReservations();

  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const onClose = () => {
    navigation.goBack();
  };

  const onPressViewAll = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_PARKING_UPCOMING_RESERVATIONS,
        params: {
          reservations: upcomingReservations,
        },
      },
    });
  };

  const onPressOption = (
    type: 'view' | 'change' | 'reserve' | 'cancel' = 'reserve',
    data?: UpcomingParkingReservationResponse,
  ) => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_PARKING_SELECT,
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

  const onPressSlot = (data: UpcomingParkingReservationResponse) => {
    const label = `Basement ${data.parkingFloor}, ${data.parkingCode}`;

    const date = data.parkingSchedule;

    openModal('BookSlotModal', {
      label: label || '',
      date,
      isPermanent: data.parkingIsPermanent,
      onPressView: () => {
        closeModal('BookSlotModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          onPressOption('view', data);
        }, 150);
      },
      onPressChange: () => {
        closeModal('BookSlotModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          onPressOption('change', data);
        }, 150);
      },
      onPressCancel: () => {
        closeModal('BookSlotModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          onPressOption('cancel', data);
        }, 150);
      },
    });
  };

  const upcomingUnscheduledCount = useMemo(() => {
    if (upcomingUnscheduled) {
      return upcomingUnscheduled.length;
    } else {
      return null;
    }
  }, [upcomingUnscheduled]);

  const upcomingUnscheduledDays = useMemo(() => {
    if (upcomingUnscheduledCount && upcomingUnscheduledCount > 0) {
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
            label={` ${upcomingUnscheduledCount || 0} upcoming WFO days `}
            style={[layoutStyles.cover]}
          />

          <Typography
            variant="b4-m"
            color={FWDColors.greenDarker}
            label="with no slot reservation yet."
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
  }, [upcomingUnscheduledCount]);

  useFocusEffect(
    useCallback(() => {
      refetchUpcoming();
      refetchUnscheduled();
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
        <NavigationHeader
          height={120}
          collapsedHeight={72}
          collapsed={collapsedHeader}
          title={
            <Typography
              label="Reserve a Parking"
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
              onPress={onClose}
            />
          }
        />

        <AnimatedScrollView>
          <View
            style={[
              {
                paddingHorizontal: spacer(16),
                marginBottom: spacer(insets.bottom),
              },
            ]}>
            <ShadowView
              style={[
                layoutStyles.centerCenter,
                {
                  borderRadius: spacer(8),
                  backgroundColor: FWDColors.white,
                },
              ]}>
              <View
                style={[
                  layoutStyles.row,
                  layoutStyles.betweenCenter,
                  {
                    padding: spacer(16),
                    borderBottomColor: FWDColors.greyLight,
                    borderBottomWidth: spacer(1),
                  },
                ]}>
                <Typography
                  label="Upcoming Reservations"
                  variant="h1"
                  color={FWDColors.greenDarker}
                  style={layoutStyles.cover}
                />

                {upcomingReservations && upcomingReservations.length > 3 && (
                  <TouchableOpacity
                    style={[layoutStyles.row, layoutStyles.startCenter]}
                    onPress={onPressViewAll}>
                    <Typography
                      label="View All"
                      variant="b4-m"
                      color={FWDColors.orange}
                    />
                    <AngleRightThick
                      width={16}
                      height={16}
                      color={FWDColors.orange}
                      style={{marginLeft: spacer(4)}}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={layoutStyles.fullWidth}>
                <View
                  style={{
                    paddingVertical: spacer(8),
                    paddingHorizontal: spacer(16),
                  }}>
                  {upcomingReservations && upcomingReservations.length === 0 ? (
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
                    upcomingReservations
                      ?.map(d => (
                        <ParkingSlot
                          key={d.planScheduleDatesId}
                          {...d}
                          onPress={() => onPressSlot(d)}
                        />
                      ))
                      .slice(0, 3)
                  )}
                </View>
              </View>
            </ShadowView>

            {penaltyData?.parkingPenaltyCount !== undefined &&
              penaltyData.parkingPenaltyCount > 0 && (
                <MissedGracePeriodNotification
                  penaltyStrike={penaltyData.parkingPenaltyCount}
                  type="parking"
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
              {penaltyData?.parkingPenaltyCount !== undefined &&
                penaltyData.parkingPenaltyCount < 3 && (
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
                      label="Reserve Parking"
                      style={[layoutStyles.cover]}
                    />
                  </View>
                )}

              <View style={{padding: spacer(12)}}>
                <View
                  style={[
                    layoutStyles.row,
                    penaltyData?.parkingPenaltyCount !== undefined &&
                      penaltyData?.parkingPenaltyCount <= 0 &&
                      layoutStyles.startCenter,
                  ]}>
                  <CalendarExclamation
                    width={24}
                    height={24}
                    color={FWDColors.orange}
                  />

                  <View style={[layoutStyles.cover, {marginLeft: spacer(12)}]}>
                    <View>
                      {penaltyData?.parkingPenaltyCount !== undefined &&
                      penaltyData.parkingPenaltyCount < 3 ? (
                        upcomingUnscheduledDays
                      ) : (
                        <>
                          <Text style={{lineHeight: spacer(17.5)}}>
                            <Typography
                              label={
                                "You can't reserve a parking for 2 weeks.\nPlease check back again on "
                              }
                              variant="h1"
                              color={FWDColors.greenDarker}
                            />
                            <Typography
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
                              label={'If you have clarifications, contact '}
                              variant="b4-b"
                              color={FWDColors.greenDarker}
                            />
                            <TouchableWithoutFeedback>
                              <Typography
                                label={'People '}
                                variant="b4-m"
                                color={FWDColors.orange}
                              />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                              <Typography
                                label={'and '}
                                variant="b4-m"
                                color={FWDColors.orange}
                              />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                              <Typography
                                label={'Culture'}
                                variant="b4-m"
                                color={FWDColors.orange}
                              />
                            </TouchableWithoutFeedback>
                            <Typography
                              label="."
                              variant="b4-b"
                              color={FWDColors.greenDarker}
                            />
                          </Text>
                        </>
                      )}
                    </View>

                    {penaltyData?.parkingPenaltyCount !== undefined &&
                      penaltyData?.parkingPenaltyCount >= 0 &&
                      penaltyData?.parkingPenaltyCount !== undefined &&
                      penaltyData.parkingPenaltyCount < 3 &&
                      (upcomingUnscheduledCount || 0) > 0 && (
                        <TouchableOpacity
                          style={[
                            layoutStyles.row,
                            layoutStyles.startCenter,
                            {
                              marginTop: spacer(12),
                            },
                          ]}
                          activeOpacity={0.75}
                          onPress={() => onPressOption()}>
                          <Typography
                            label="Reserve Now"
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
          </View>
        </AnimatedScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ReserveParkingLandingScreen;
