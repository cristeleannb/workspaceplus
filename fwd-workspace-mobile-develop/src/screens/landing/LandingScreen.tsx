import React, {useState, useEffect, useCallback} from 'react';
import {View, Dimensions, Image} from 'react-native';
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import {SafeAreaView} from 'react-native-safe-area-context';
import {observer} from 'mobx-react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import {addMonths, format, isSameMonth, isToday} from 'date-fns';

import {layoutStyles, spacer} from '@/utils';
import {
  Avatar,
  Button,
  FWDColors,
  Menu,
  Notif,
  Qr,
  ShadowView,
  Typography,
} from '@/components';
import {LogoWhiteText} from '@/components/logotypes';
import {Check} from '@/components/pictograms';
import {
  EmployeeAttendance,
  DashboardWMCard,
  NavigationHeader,
  PlanScheduleNotification,
  WSTools,
} from '@/views';
import {useStores} from '@/stores';
import {AccountRole} from '@/types';
import {
  useGetPlanSchedule,
  useRefetchPlanSchedule,
  useGetMonthPenalty,
  useGetMonthParkingPenalty,
  useGetAppSetting,
} from '@/services/query';
import {useTimeframe} from '@/hooks/useTimeframe';
import {useToastMessage} from '@/toast';
import {LandingScreenRouteProp, NavigationKey} from '@/navigations';
import ScheduleCalendarDateRange from '@/views/calendar/ScheduleCalendarDateRange';
import {DateUtil} from '@/utils/date.util';
import {useModal} from 'react-native-modalfy';
import {ModalStackParamsList} from '@/modals';
import {useContainer} from '@/hooks/useContainer';
import {useScroll} from '@/hooks/useScroll';
import {useGetNotificationStatus} from '@/services/query/useNotification';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

const LandingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<LandingScreenRouteProp>();
  const {authStore, workstationStore, parkingStore, appSettingStore} =
    useStores();
  const {containerWidth, onContainerLayout} = useContainer();
  const {AnimatedScrollView, collapsedHeader} = useScroll();

  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const {data: appSetting} = useGetAppSetting();
  const {
    currentDate,
    minCalendarDate,
    maxcalendarDate,
    planSchedulePeriod,
    planScheduleTimeframeStatus,
    getDayPeriod,
  } = useTimeframe();
  const [scheduleDate, setScheduleDate] = useState(currentDate);
  const {refetch} = useRefetchPlanSchedule(
    DateUtil.getSchedulePeriod(scheduleDate),
  );

  const {refetch: refetchNextMonth} = useRefetchPlanSchedule(
    DateUtil.getSchedulePeriod(addMonths(scheduleDate, 1)),
  );

  const {data: planSchedule} = useGetPlanSchedule(
    DateUtil.getSchedulePeriod(scheduleDate),
  );

  const {data: nextMonthSchedule} = useGetPlanSchedule(planSchedulePeriod);

  const {data: wsPenaltyData} = useGetMonthPenalty();
  const {data: parkingPenaltyData} = useGetMonthParkingPenalty();
  const {data: notifStatusData} = useGetNotificationStatus();

  const navigateToBookWS = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_BOOK_WORKSTATION,
      },
    });
  };

  useEffect(() => {
    if (wsPenaltyData && wsPenaltyData?.workstationPenaltyCount) {
      /**
       * if there exist a penalty data,
       * check first if the modal have been shown already
       * by comparing the penaltyCount,
       * where penaltyCount from storage and API should `not be equal` and
       * serverTime from storage and API should `be same month and day`
       */

      const penaltyToday = wsPenaltyData.penaltyDetails?.find(
        d => d.scheduleDate && isToday(new Date(d.scheduleDate)),
      );

      if (penaltyToday) {
        if (workstationStore.penaltyData === null) {
          workstationStore.setPenaltyData(wsPenaltyData);
          openModal('MissedGracePeriodModal', {
            type: 'workstation',
            penaltyStrike: wsPenaltyData.workstationPenaltyCount || 0,
            reservationStatus: 1,
            onBookAnotherParkingSlot: () => {
              closeModal('MissedGracePeriodModal');

              // encountered a timing issue, adding a timeout of 150ms
              setTimeout(() => {
                navigateToBookWS();
              }, 150);
            },
            onContactPeopleAndCulture: () => {
              closeModal('MissedGracePeriodModal');
            },
            penalizedUntil: wsPenaltyData.penalizedUntil,
          });
        } else {
          const sameMonth =
            wsPenaltyData.serverTime &&
            workstationStore.penaltyData.serverTime &&
            isSameMonth(
              new Date(wsPenaltyData.serverTime),
              new Date(workstationStore.penaltyData.serverTime),
            );

          if (
            wsPenaltyData.workstationPenaltyCount !==
              workstationStore.penaltyData.workstationPenaltyCount &&
            sameMonth
          ) {
            workstationStore.setPenaltyData(wsPenaltyData);
            openModal('MissedGracePeriodModal', {
              type: 'workstation',
              penaltyStrike: wsPenaltyData.workstationPenaltyCount || 0,
              reservationStatus: 1,
              onBookAnotherParkingSlot: () => {
                closeModal('MissedGracePeriodModal');
                // encountered a timing issue, adding a timeout of 150ms
                setTimeout(() => {
                  navigateToBookWS();
                }, 150);
              },
              onContactPeopleAndCulture: () => {
                closeModal('MissedGracePeriodModal');
              },
              penalizedUntil: wsPenaltyData.penalizedUntil,
            });
          }
        }
      }
    } else if (wsPenaltyData?.workstationPenaltyCount === 0) {
      workstationStore.setPenaltyData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsPenaltyData, workstationStore.penaltyData]);

  useEffect(() => {
    if (parkingPenaltyData && parkingPenaltyData?.parkingPenaltyCount) {
      /**
       * if there exist a penalty data,
       * check first if the modal have been shown already
       * by comparing the penaltyCount,
       * where penaltyCount from storage and API should `not be equal` and
       * serverTime from storage and API should `be same month`
       */

      const penaltyToday = parkingPenaltyData.penaltyDetails?.find(
        d => d.scheduleDate && isToday(new Date(d.scheduleDate)),
      );

      if (penaltyToday) {
        if (parkingStore.parkingPenaltyData === null) {
          parkingStore.setParkingPenaltyData(parkingPenaltyData);
          openModal('MissedGracePeriodModal', {
            type: 'parking',
            penaltyStrike: parkingPenaltyData.parkingPenaltyCount || 0,
            reservationStatus: 1,
            onBookAnotherParkingSlot: () => {
              closeModal('MissedGracePeriodModal');

              // encountered a timing issue, adding a timeout of 150ms
              setTimeout(() => {
                navigateToBookWS();
              }, 150);
            },
            onContactPeopleAndCulture: () => {
              closeModal('MissedGracePeriodModal');
            },
            penalizedUntil: parkingPenaltyData.penalizedUntil,
          });
        } else {
          const sameMonth =
            parkingPenaltyData.serverTime &&
            parkingStore.parkingPenaltyData.serverTime &&
            isSameMonth(
              new Date(parkingPenaltyData.serverTime),
              new Date(parkingStore.parkingPenaltyData.serverTime),
            );

          if (
            parkingPenaltyData.parkingPenaltyCount !==
              parkingStore.parkingPenaltyData.parkingPenaltyCount &&
            sameMonth
          ) {
            parkingStore.setParkingPenaltyData(parkingPenaltyData);
            openModal('MissedGracePeriodModal', {
              type: 'parking',
              penaltyStrike: parkingPenaltyData.parkingPenaltyCount || 0,
              reservationStatus: 1,
              onBookAnotherParkingSlot: () => {
                closeModal('MissedGracePeriodModal');
                // encountered a timing issue, adding a timeout of 150ms
                setTimeout(() => {
                  navigateToBookWS();
                }, 150);
              },
              onContactPeopleAndCulture: () => {
                closeModal('MissedGracePeriodModal');
              },
              penalizedUntil: parkingPenaltyData.penalizedUntil,
            });
          }
        }
      }
    } else if (parkingPenaltyData?.parkingPenaltyCount === 0) {
      parkingStore.setParkingPenaltyData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkingPenaltyData, parkingStore.parkingPenaltyData]);

  const accountRole = authStore.user?.employeeRoles?.[0].personaRoleId;

  const {showToast} = useToastMessage();
  const [recordStatus, setRecordStatus] = useState<number | undefined>();

  const animationNavHeight = useSharedValue(screenHeight);
  const animatedNavHeightStyle = useAnimatedStyle(() => ({
    height: animationNavHeight.value,
  }));

  const animationNavLeft = useSharedValue(-screenWidth * 2);
  const animatedNavLeftStyle = useAnimatedStyle(() => ({
    left: animationNavLeft.value,
  }));

  const animationNavLogoTop = useSharedValue(5);
  const animationNavLogoOpacity = useSharedValue(0);
  const animatedNavLogoStyle = useAnimatedStyle(() => ({
    top: animationNavLogoTop.value,
    opacity: animationNavLogoOpacity.value,
  }));

  const animationNavBuildingsTop = useSharedValue(100);
  const animationNavBuildingsOpacity = useSharedValue(0);
  const animatedNavBuildingsStyle = useAnimatedStyle(() => ({
    top: animationNavBuildingsTop.value,
    opacity: animationNavBuildingsOpacity.value,
  }));

  const animationNavRight = useSharedValue(-screenWidth * 2);
  const animatedNavRightStyle = useAnimatedStyle(() => ({
    right: animationNavRight.value,
  }));

  const animationNavRight2 = useSharedValue(-screenWidth * 2);
  const animatedNavRight2Style = useAnimatedStyle(() => ({
    right: animationNavRight2.value,
  }));

  const onMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const onNavHeight = () => {
    animationNavHeight.value = withTiming(0, {
      duration: 1000,
      // easing: Easing.ease,
    });
  };

  const onNavLoadLeftButton = () => {
    animationNavLeft.value = withDelay(600, withTiming(0, {duration: 600}));
  };

  const onNavLoadLogo = () => {
    animationNavLogoTop.value = withDelay(1000, withTiming(0, {duration: 400}));
    animationNavLogoOpacity.value = withDelay(
      1000,
      withTiming(1, {duration: 800}),
    );
  };

  const onNavLoadBuildings = () => {
    animationNavBuildingsTop.value = withDelay(
      800,
      withTiming(0, {duration: 650}),
    );
    animationNavBuildingsOpacity.value = withDelay(
      800,
      withTiming(1, {duration: 800}),
    );
  };

  const onNavLoadRightButton = () => {
    animationNavRight.value = withDelay(600, withTiming(0, {duration: 600}));
  };

  const onNavLoadRightButton2 = () => {
    animationNavRight2.value = withDelay(650, withTiming(0, {duration: 650}));
  };

  const onPressNotificationList = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_NOTIFICATION_LIST,
      },
    });
  };

  const onPressQRScan = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_QR_SCAN,
      },
    });
  };

  const onNavigateToUploadQR = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_QR_UPLOAD,
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchNextMonth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextMonthSchedule]),
  );

  useEffect(() => {
    if (appSetting) {
      appSettingStore.setAppSetting(appSetting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appSetting]);

  useEffect(() => {
    if (route.params?.switchSuccess) {
      showToast({
        type: 'fullwidth',
        label: `Switched to ${authStore.user?.employeeFullName}`,
        rightIcon: <Check width={24} height={24} />,
      });

      refetch();
      refetchNextMonth();
      navigation.setParams({switchSuccess: false});
    }

    if (route.params?.submitScheduleSuccess) {
      refetch();
      refetchNextMonth();
      navigation.setParams({submitScheduleSuccess: false});
    }

    if (nextMonthSchedule) {
      setRecordStatus(nextMonthSchedule.recordStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params, nextMonthSchedule, authStore.user]);

  useEffect(() => {
    switch (route.params?.wsQRStatus) {
      case 'wrong-seat':
        openModal('CheckInOutModal', {
          status: 'wrong-seat',
          onPressScanQR: () => {
            closeModal('CheckInOutModal');
            onPressQRScan();
          },
          onPressUploadQR: () => {
            closeModal('CheckInOutModal');
            onNavigateToUploadQR();
          },
        });
        break;

      case 'not-working':
        openModal('CheckInOutModal', {
          status: 'not-working',
          onPressScanQR: () => {
            closeModal('CheckInOutModal');
            onPressQRScan();
          },
          onPressUploadQR: () => {
            closeModal('CheckInOutModal');
            onNavigateToUploadQR();
          },
        });
        break;

      case 'missed-time':
        openModal('CheckInOutModal', {
          status: 'missed-time',
          onPressBookWS: () => {
            closeModal('CheckInOutModal');
          },
          onPressContact: () => {
            closeModal('CheckInOutModal');
          },
        });
        break;

      case 'wrong-slot':
        openModal('CheckInOutModal', {
          status: 'wrong-slot',
          onPressScanQR: () => {
            closeModal('CheckInOutModal');
            onPressQRScan();
          },
          onPressUploadQR: () => {
            closeModal('CheckInOutModal');
            onNavigateToUploadQR();
          },
        });
        break;
    }

    navigation.setParams({wsQRStatus: undefined});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.wsQRStatus]);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        layoutStyles.cover,
        {
          backgroundColor: FWDColors.orange,
        },
      ]}>
      <Animated.View
        onLayout={onNavHeight}
        style={[
          animatedNavHeightStyle,
          {
            backgroundColor: FWDColors.orange,
            top: spacer(0),
            zIndex: spacer(999),
          },
        ]}
      />
      <View
        style={[
          layoutStyles.cover,
          {
            backgroundColor: FWDColors.white,
          },
        ]}>
        <NavigationHeader
          height={120}
          collapsedHeight={72}
          collapsed={collapsedHeader}
          title={
            <>
              <Animated.View
                onLayout={onNavLoadLogo}
                style={[animatedNavLogoStyle, {elevation: spacer(2)}]}>
                <LogoWhiteText width={57} height={34} />
              </Animated.View>

              <Animated.View
                onLayout={onNavLoadBuildings}
                style={[
                  animatedNavBuildingsStyle,
                  layoutStyles.fullWidth,
                  layoutStyles.absolute,
                  layoutStyles.centerCenter,
                  layoutStyles.cover,
                  {top: spacer(0)},
                ]}>
                <Image
                  source={require('../../assets/images/buildings.png')}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{resizeMode: 'cover', height: spacer(120)}}
                />
              </Animated.View>
            </>
          }
          leftAction={
            <Animated.View
              onLayout={onNavLoadLeftButton}
              style={animatedNavLeftStyle}>
              <Button
                iconOnly
                icon={<Menu />}
                size="small"
                iconSize={20}
                color="light"
                onPress={onMenuPress}
              />
            </Animated.View>
          }
          rightAction={
            <View style={layoutStyles.row}>
              <Animated.View
                onLayout={onNavLoadRightButton}
                style={animatedNavRightStyle}>
                <Button
                  iconOnly
                  icon={<Notif />}
                  size="small"
                  iconSize={20}
                  color="light"
                  onPress={onPressNotificationList}
                />
                {notifStatusData &&
                  !!notifStatusData.totalUnreadNotifications &&
                  notifStatusData.totalUnreadNotifications > 0 && (
                    <View
                      style={[
                        layoutStyles.absolute,
                        layoutStyles.centerCenter,
                        {
                          top: spacer(-2),
                          right: spacer(-2),
                          width: spacer(16),
                          height: spacer(16),
                          borderRadius: spacer(16),
                          borderWidth: spacer(1),
                          borderColor: FWDColors.white,
                          backgroundColor: FWDColors.greenDarker,
                        },
                      ]}>
                      <Typography
                        label={notifStatusData.totalUnreadNotifications}
                        color={FWDColors.white}
                        variant="l4-bold"
                      />
                    </View>
                  )}
              </Animated.View>

              <Animated.View
                onLayout={onNavLoadRightButton2}
                style={[
                  animatedNavRight2Style,
                  {
                    marginLeft: spacer(16),
                  },
                ]}>
                <Button
                  iconOnly
                  icon={<Qr />}
                  size="small"
                  iconSize={20}
                  color="light"
                  onPress={onPressQRScan}
                />
              </Animated.View>
            </View>
          }
        />

        <AnimatedScrollView>
          <View>
            <View
              style={{
                paddingHorizontal: spacer(16),
                paddingBottom: spacer(8),
                paddingTop: spacer(24),
              }}>
              <ShadowView
                level={6}
                style={{
                  borderRadius: spacer(8),
                  paddingHorizontal: spacer(16),
                  paddingBottom: spacer(20),
                }}>
                <View
                  style={[
                    layoutStyles.row,
                    layoutStyles.centerStart,
                    {
                      top: spacer(-20),
                    },
                  ]}>
                  <Avatar
                    size={80}
                    imageUrl={authStore.user?.employeeImage}
                    gender={authStore.user?.employeeGender}
                  />
                </View>

                <Typography
                  label={`Good ${getDayPeriod}, ${authStore.user?.employeeFirstName}`}
                  color={FWDColors.greenDarker}
                  variant="h4"
                  align="center"
                />

                <View style={[layoutStyles.row, layoutStyles.centerCenter]}>
                  <Typography
                    label={format(new Date(), 'EEEE')}
                    color={FWDColors.grey4}
                    variant="b3-b"
                  />

                  <View
                    style={{
                      height: spacer(4),
                      width: spacer(4),
                      borderRadius: spacer(4),
                      backgroundColor: FWDColors.grey4,
                      marginHorizontal: spacer(8),
                    }}
                  />

                  <Typography
                    label={format(new Date(), 'MMMM d, yyyy')}
                    color={FWDColors.grey4}
                    variant="b3-b"
                  />
                </View>

                <EmployeeAttendance accountRole={accountRole || 0} />

                {recordStatus !== undefined &&
                  planScheduleTimeframeStatus === 'within' &&
                  (accountRole === AccountRole.ExecutiveAssistant ? (
                    <PlanScheduleNotification recordStatus={recordStatus} />
                  ) : accountRole === AccountRole.PeopleManager ? (
                    <PlanScheduleNotification recordStatus={recordStatus} />
                  ) : accountRole === AccountRole.Employee ? (
                    <PlanScheduleNotification recordStatus={recordStatus} />
                  ) : null)}
              </ShadowView>

              {accountRole === AccountRole.CEO ? (
                <DashboardWMCard />
              ) : accountRole === AccountRole.ExCom ? (
                <DashboardWMCard />
              ) : accountRole === AccountRole.SpecialExcom ? (
                <DashboardWMCard />
              ) : accountRole === AccountRole.PeopleManager ? (
                <DashboardWMCard />
              ) : null}
            </View>
          </View>

          <View
            style={{
              backgroundColor: FWDColors.greyLight,
              borderBottomLeftRadius: spacer(12),
            }}>
            <View
              style={{
                height: spacer(24),
                backgroundColor: FWDColors.white,
                borderBottomLeftRadius: spacer(24),
              }}
            />

            <View
              style={[
                layoutStyles.cover,
                {
                  paddingHorizontal: spacer(16),
                  paddingTop: spacer(24),
                  paddingBottom: spacer(20),
                },
              ]}>
              <WSTools />
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: spacer(16),
              paddingTop: spacer(32),
              paddingBottom: spacer(20),
            }}>
            <View onLayout={onContainerLayout}>
              <ScheduleCalendarDateRange
                currentDate={currentDate}
                activeDate={currentDate}
                onMonthChange={setScheduleDate}
                schedules={
                  planSchedule?.recordStatus === 2 ||
                  planSchedule?.recordStatus === 4
                    ? planSchedule?.planScheduleDates
                    : []
                }
                minDate={minCalendarDate}
                maxDate={maxcalendarDate}
                containerWidth={containerWidth}
              />
            </View>
          </View>
        </AnimatedScrollView>
      </View>
    </SafeAreaView>
  );
};

export default observer(LandingScreen);
