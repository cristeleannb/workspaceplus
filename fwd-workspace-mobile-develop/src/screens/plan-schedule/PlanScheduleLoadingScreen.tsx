import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import LottieView from 'lottie-react-native';
import {observer} from 'mobx-react';

import {useGetPlanSchedule} from '@/services/query/useSchedule';
import {NavigationKey} from '@/navigations';
import {layoutStyles, spacer} from '@/utils';
import {FWDColors} from '@/components';
import {useTimeframe} from '@/hooks/useTimeframe';
import {useStores} from '@/stores';

const PlanScheduleLoadingScreen = observer(() => {
  const {appSettingStore} = useStores();
  const appSetting = appSettingStore.appSetting;
  const navigation = useNavigation();
  const {planScheduleTimeframeStatus, planSchedulePeriod} = useTimeframe();

  const {data: planSchedule, refetch} = useGetPlanSchedule(planSchedulePeriod);

  const navigateToViewSchedule = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_VIEW_SCHEDULE,
      },
    });
  };

  const navigateToPlanSchedule = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_PLAN_SCHEDULE,
      },
    });
  };

  useEffect(() => {
    if (planSchedule) {
      if (planScheduleTimeframeStatus === 'outside') {
        switch (planSchedule.recordStatus) {
          case 3:
            navigateToPlanSchedule();
            break;

          default:
            navigateToViewSchedule();
            break;
        }
      } else if (planScheduleTimeframeStatus === 'within') {
        switch (planSchedule.recordStatus) {
          case 0:
          case 3:
            navigateToPlanSchedule();
            break;

          case 1:
          case 2:
            navigateToViewSchedule();
            break;

          case 4:
            navigateToViewSchedule();
            break;

          default:
            navigation.goBack();
            break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planSchedule, appSetting, planScheduleTimeframeStatus]);

  useFocusEffect(() => {
    refetch();
  });

  return (
    <View
      style={[
        layoutStyles.cover,
        layoutStyles.centerCenter,
        {
          backgroundColor: FWDColors.orange,
        },
      ]}>
      <LottieView
        source={require('@/assets/animations/screen-loader.json')}
        autoPlay
        loop
        style={{
          height: spacer(640),
        }}
      />
    </View>
  );
});

export default PlanScheduleLoadingScreen;
