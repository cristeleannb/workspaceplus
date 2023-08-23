import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/core';
import {ScrollView} from 'react-native-gesture-handler';
import _ from 'lodash';

import {NavigationHeader} from '@/views';
import {
  Button,
  Left,
  FWDColors,
  Typography,
  Advisor2,
  ShadowView,
  Avatar,
} from '@/components';
import {spacer, layoutStyles} from '@/utils';
import {NavigationKey, ScheduleRequestDetailRouteProp} from '@/navigations';
import {useTimeframe} from '@/hooks/useTimeframe';
import {
  useGetPlanSchedule,
  useSetScheduleRequestApproval,
} from '@/services/query';
import {
  EmployeePlanScheduleModel,
  PlanScheduleDatesModel,
} from '@/services/api/api.service';
import ScheduleCalendarDateRange from '@/views/calendar/ScheduleCalendarDateRange';
import {DateUtil} from '@/utils/date.util';
import {isSameMonth} from 'date-fns';
import {useContainer} from '@/hooks/useContainer';

const DetailedScheduleRequestScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ScheduleRequestDetailRouteProp>();
  const {item: employeeDetails} = route.params;

  const insets = useSafeAreaInsets();
  const {containerWidth, onContainerLayout} = useContainer();
  const {minCalendarDate, maxcalendarDate, currentDate, planScheduleDate} =
    useTimeframe();
  const [scheduleDate, setScheduleDate] = useState(planScheduleDate);

  const {
    mutateAsync: setScheduleRequestApproval,
    isLoading: setScheduleRequestApprovalLoading,
  } = useSetScheduleRequestApproval();
  const {data: planScheduleView} = useGetPlanSchedule(
    DateUtil.getSchedulePeriod(scheduleDate),
  );

  const onClose = () => {
    navigation.goBack();
  };

  const goToScheduleRequestListScreen = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_WORK_SCHEDULE_REQUESTS,
        params: {
          success: true,
        },
      },
    });
  };

  const approveScheduleRequest = async () => {
    try {
      const details = [employeeDetails];
      const transformedDetails: EmployeePlanScheduleModel[] = _.map(
        details,
        detail => {
          return {
            ...detail,
            approvalMessage: '',
            recordStatus: 2,
            planScheduleDates: _.map(
              detail.planScheduleDates || [],
              schedule => {
                let locked: number = 0;
                if (schedule.workTypeId === 3) {
                  locked = 1;
                }

                return {
                  ...schedule,
                  isLock: locked,
                };
              },
            ),
          };
        },
      );

      await setScheduleRequestApproval(transformedDetails);
      goToScheduleRequestListScreen();
    } catch (error) {
      // TODO: Handle error by adding toast banner
      console.log('error', error);
    }
  };

  const declineScheduleRequest = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_DECLINE_WORK_SCHEDULE,
        params: {
          item: employeeDetails,
        },
      },
    });
  };

  const calendarView = useMemo(() => {
    let schedules: PlanScheduleDatesModel[] = [];

    if (isSameMonth(planScheduleDate, scheduleDate)) {
      schedules = employeeDetails.planScheduleDates || [];
    } else {
      schedules = planScheduleView?.planScheduleDates || [];
    }

    return (
      <ScheduleCalendarDateRange
        currentDate={currentDate}
        activeDate={scheduleDate}
        schedules={schedules}
        onMonthChange={setScheduleDate}
        minDate={minCalendarDate}
        maxDate={maxcalendarDate}
        containerWidth={containerWidth}
      />
    );
  }, [
    currentDate,
    employeeDetails,
    scheduleDate,
    planScheduleView,
    planScheduleDate,
    minCalendarDate,
    maxcalendarDate,
    containerWidth,
  ]);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        layoutStyles.cover,
        {
          backgroundColor: FWDColors.greyLight,
          paddingBottom: spacer(insets.bottom),
        },
      ]}>
      <ScrollView
        style={[
          layoutStyles.cover,
          {
            backgroundColor: FWDColors.greyLight,
            paddingBottom: spacer(insets.bottom),
          },
        ]}>
        <View style={[layoutStyles.cover]}>
          <NavigationHeader
            flat
            height={64}
            bgColor={FWDColors.greyLight}
            leftAction={
              <Button
                iconOnly
                icon={<Left />}
                size="small"
                color="primary"
                onPress={onClose}
              />
            }
          />

          <View
            style={[
              layoutStyles.cover,
              {
                paddingHorizontal: spacer(16),
              },
            ]}>
            <ShadowView
              style={[
                layoutStyles.fullWidth,
                {
                  borderRadius: spacer(8),
                  marginBottom: spacer(24),
                },
              ]}>
              <View
                style={[
                  layoutStyles.centerCenter,
                  {
                    top: spacer(-20),
                  },
                ]}>
                <View style={{marginBottom: spacer(4)}}>
                  <Avatar
                    size={64}
                    imageUrl={employeeDetails.employeeImage}
                    gender={employeeDetails.employeeGender}
                  />
                </View>
                <Typography
                  label={employeeDetails.employeeName || ''}
                  variant="h2"
                  color={FWDColors.greenDarker}
                />
                <View
                  style={[
                    layoutStyles.centerCenter,
                    layoutStyles.cover,
                    {marginTop: spacer(4), paddingHorizontal: spacer(24)},
                  ]}>
                  <View
                    style={[
                      layoutStyles.row,
                      layoutStyles.startCenter,
                      layoutStyles.fullWidth,
                    ]}>
                    <Advisor2
                      width={24}
                      height={24}
                      color={FWDColors.orange}
                      style={{
                        marginRight: spacer(4),
                      }}
                    />
                    <Typography
                      label={employeeDetails.employeePositionTitle || ''}
                      color={FWDColors.grey4}
                      variant="l2-b"
                    />
                  </View>
                </View>
              </View>

              <View
                style={[
                  {
                    paddingVertical: spacer(20),
                    paddingHorizontal: spacer(12),
                  },
                ]}>
                <View onLayout={onContainerLayout}>{calendarView}</View>
              </View>
            </ShadowView>
          </View>
        </View>
      </ScrollView>

      {employeeDetails.recordStatus === 1 && (
        <View
          style={[
            {
              borderTopColor: FWDColors.grey1,
              borderTopWidth: spacer(1),
              padding: spacer(24),
            },
          ]}>
          <Button
            label={'Approve'}
            style={[{marginBottom: spacer(24)}]}
            onPress={() =>
              !setScheduleRequestApprovalLoading && approveScheduleRequest()
            }
            loading={setScheduleRequestApprovalLoading}
          />
          <Button
            label={'Decline'}
            mode="outlined"
            onPress={declineScheduleRequest}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default DetailedScheduleRequestScreen;
