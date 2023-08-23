import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import _ from 'lodash';

import {
  AssignCreditsNotification,
  NavigationHeader,
  ReviewRequestsNotification,
} from '@/views';
import {Button, Close, FWDColors, ShadowView, Typography} from '@/components';
import {spacer, layoutStyles} from '@/utils';
import {
  useGetCreditAssignmentAvailability,
  useGetScheduleRequests,
} from '@/services/query';
import {useTimeframe} from '@/hooks/useTimeframe';
import {useScroll} from '@/hooks/useScroll';
import {WMDirectReportProvider} from '@/hooks/useWMDirectReport';
import WMDirectReportLandingView from '@/views/workforce-monitoring/WMDirectReportLandingView';
import WMDirectReportBottomSheet from '@/views/workforce-monitoring/WMDirectReportBottomSheet';

const ManageTeamScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {AnimatedScrollView, collapsedHeader} = useScroll();

  const {planSchedulePeriod, withinApprovalTimeframe} = useTimeframe();
  const {data: creditAssignmentAvailability} =
    useGetCreditAssignmentAvailability();
  const {data: scheduleRequests, isError: isScheduleRequestsError} =
    useGetScheduleRequests({
      ...planSchedulePeriod,
      recordStatuses: '1',
    });

  const [scheduleRequestCount, setScheduleRequestCount] = useState(0);

  const onClose = () => {
    navigation.goBack();
  };

  const permitCreditsAssignment = useMemo(() => {
    if (creditAssignmentAvailability) {
      return !!creditAssignmentAvailability.isValid;
    } else {
      return false;
    }
  }, [creditAssignmentAvailability]);

  useEffect(() => {
    if (isScheduleRequestsError) {
      setScheduleRequestCount(0);
    } else {
      const pendingScheduleRequests = _.filter(
        scheduleRequests?.employeePlanScheduleList || [],
        item => item.recordStatus === 1,
      );
      setScheduleRequestCount(pendingScheduleRequests.length);
    }
  }, [scheduleRequests, isScheduleRequestsError]);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        layoutStyles.cover,
        {
          backgroundColor: FWDColors.orange,
        },
      ]}>
      <WMDirectReportProvider>
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
              <Typography
                label="Manage Team"
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
                {permitCreditsAssignment && <AssignCreditsNotification />}

                {withinApprovalTimeframe && (
                  <ReviewRequestsNotification
                    requestCount={scheduleRequestCount}
                  />
                )}

                <View
                  style={[
                    layoutStyles.fullWidth,
                    {
                      marginTop: spacer(16),
                      marginBottom: spacer(20),
                      paddingHorizontal: spacer(16),
                    },
                  ]}>
                  <WMDirectReportLandingView />
                </View>
              </ShadowView>
            </View>
          </AnimatedScrollView>
        </View>

        <WMDirectReportBottomSheet />
      </WMDirectReportProvider>
    </SafeAreaView>
  );
};

export default ManageTeamScreen;
