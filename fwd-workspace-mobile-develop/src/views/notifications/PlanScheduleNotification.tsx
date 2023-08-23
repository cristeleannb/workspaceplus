import React, {useMemo} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {differenceInDays, setDate, isSameDay} from 'date-fns';

import {AngleRightThick, FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {
  Calendar,
  Calendar1Exclamation,
  Calendar2Exclamation,
} from '@/components/pictograms';
import {NavigationKey} from '@/navigations';

import {useTimeframe} from '@/hooks/useTimeframe';
import {useStores} from '@/stores';

interface PlanScheduleNotificationProps {
  recordStatus: number;
}

const PlanScheduleNotification = ({
  recordStatus,
}: PlanScheduleNotificationProps) => {
  const navigation = useNavigation();
  const {appSettingStore} = useStores();
  const {planScheduleTimeframeStatus, planScheduleDate} = useTimeframe();

  const appSetting = appSettingStore.appSetting;
  const endDay = setDate(
    planScheduleDate,
    appSetting.employeePlanScheduleAssignmentEndDay || 0,
  );

  const countdown = differenceInDays(endDay, planScheduleDate);

  const planSchedule = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_PLAN_SCHEDULE_LOADER,
      },
    });
  };

  const renderNote = useMemo(() => {
    if (recordStatus === 1) {
      return (
        <Typography
          label={'Your work schedule request was sent for approval'}
          variant="l2-b"
          color={FWDColors.greenDarker}
        />
      );
    } else if (recordStatus === 0) {
      if (countdown > 3) {
        return (
          <Typography
            label={'You can now plan your work schedule for this month'}
            variant="l2-b"
            color={FWDColors.greenDarker}
          />
        );
      } else if (countdown <= 3) {
        if (countdown === 0) {
          return (
            <Text style={[layoutStyles.row, layoutStyles.cover]}>
              <Typography
                label={'Last day'}
                variant="l2-m"
                color={FWDColors.orange}
              />
              <Typography
                label={' to plan your work schedule for this month'}
                variant="l2-b"
                color={FWDColors.greenDarker}
              />
            </Text>
          );
        } else {
          return (
            <Text style={[layoutStyles.row, layoutStyles.cover]}>
              <Typography
                label={`${countdown} ${countdown > 1 ? 'days' : 'day'} `}
                variant="l2-m"
                color={FWDColors.orange}
              />
              <Typography
                label={'left to plan your work schedule for next month'}
                variant="l2-b"
                color={FWDColors.greenDarker}
              />
            </Text>
          );
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }, [countdown, recordStatus]);

  if (planScheduleTimeframeStatus === 'within' && recordStatus <= 1) {
    return (
      <View
        style={
          (layoutStyles.fullWidth,
          {
            backgroundColor: FWDColors.orange20,
            marginTop: spacer(24),
            paddingVertical: spacer(12),
            paddingHorizontal: spacer(16),
            flexDirection: 'row',
            borderRadius: spacer(8),
          })
        }>
        {countdown === 0 && isSameDay(planScheduleDate, endDay) ? (
          <Calendar2Exclamation width={32} height={32} />
        ) : countdown <= 3 && !isSameDay(planScheduleDate, endDay) ? (
          <Calendar1Exclamation width={32} height={32} />
        ) : (
          <Calendar width={32} height={32} />
        )}
        <View style={[layoutStyles.cover, {marginLeft: spacer(10)}]}>
          {renderNote && renderNote}
          <TouchableOpacity
            style={[
              layoutStyles.row,
              layoutStyles.startCenter,
              {
                marginTop: spacer(12),
              },
            ]}
            onPress={planSchedule}>
            <Typography
              label={recordStatus === 1 ? 'View Schedule' : 'Plan Schedule'}
              variant="l3-m"
              color={FWDColors.orange}
            />
            <AngleRightThick
              width={16}
              height={16}
              color={FWDColors.orange}
              style={{marginLeft: spacer(6)}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return null;
  }
};

export default PlanScheduleNotification;
