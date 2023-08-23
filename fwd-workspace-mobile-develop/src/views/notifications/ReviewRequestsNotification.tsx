import React, {useMemo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {setDate, addMonths, isSameDay} from 'date-fns';

import {FWDColors, AngleRightThick, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {Calendar2Exclamation} from '@/components/pictograms';
import {NavigationKey} from '@/navigations';
import {useNavigation} from '@react-navigation/core';
import {useTimeframe} from '@/hooks/useTimeframe';
import {useStores} from '@/stores';

interface ReviewRequestsNotificationProps {
  requestCount: number;
}

const ReviewRequestsNotification = ({
  requestCount = 0,
}: ReviewRequestsNotificationProps) => {
  const navigation = useNavigation();
  const {appSettingStore} = useStores();
  const {manageScheduleRequestsDeadline, planScheduleDate, currentDate} =
    useTimeframe();

  const reviewSchedules = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_WORK_SCHEDULE_REQUESTS,
      },
    });
  };

  const appSetting = appSettingStore.appSetting;

  const currentDay = addMonths(currentDate, 1);
  const endDay = setDate(
    planScheduleDate,
    appSetting.employeePlanScheduleApprovalEndDay || 0,
  );

  const notificationLabel = useMemo(() => {
    if (requestCount > 0) {
      if (requestCount === 1) {
        return `${requestCount} Work Schedule Request`;
      } else {
        return `${requestCount} Work Schedule Requests`;
      }
    } else {
      return 'Work Schedule Requests';
    }
  }, [requestCount]);

  return (
    <View
      style={[
        layoutStyles.fullWidth,
        layoutStyles.row,
        {
          backgroundColor: FWDColors.red5,
          padding: spacer(12),
          borderTopLeftRadius: spacer(8),
          borderTopRightRadius: spacer(8),
        },
      ]}>
      <Calendar2Exclamation width={40} height={40} />
      <View style={[layoutStyles.cover, {marginLeft: spacer(10)}]}>
        <Typography
          label={notificationLabel}
          variant="h1"
          color={FWDColors.greenDarker}
        />
        <Typography
          label={
            isSameDay(currentDay, endDay)
              ? 'Last day to approve work schedule requests! If you are unable to approve before deadline, all pending requests will be auto-approved.'
              : `Deadline is on ${manageScheduleRequestsDeadline}`
          }
          variant="l3-b"
          color={FWDColors.greenDarker}
          style={{marginTop: spacer(4)}}
        />
        <TouchableOpacity
          style={[
            layoutStyles.row,
            layoutStyles.startCenter,
            {
              marginTop: spacer(12),
            },
          ]}
          onPress={reviewSchedules}>
          <Typography
            label={'Review Now'}
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
};

export default ReviewRequestsNotification;
