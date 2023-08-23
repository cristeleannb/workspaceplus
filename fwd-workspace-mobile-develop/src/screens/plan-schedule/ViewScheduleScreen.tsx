import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, ScrollView, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/core';
import BottomSheet from '@gorhom/bottom-sheet';

import {
  ApprovedScheduleNote,
  EditScheduleTips,
  NavigationHeader,
  PastDeadlineScheduleNote,
  PlotScheduleInstructionBottomSheet,
  PendingApprovalNote,
  ViewScheduleCalendar,
  PastScheduleApprovalNote,
  ChangeScheduleCalendar,
  PlanScheduleCalendar,
} from '@/views';
import {
  Button,
  Close,
  DynamicBottomSheet,
  FWDColors,
  QuestionMark,
  Typography,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {NavigationKey, ViewScheduleRouteProp} from '@/navigations';
import {useGetHoliday, useGetPlanSchedule} from '@/services/query';
import {useTimeframe} from '@/hooks/useTimeframe';
import {useToastMessage} from '@/toast';
import {DateUtil} from '@/utils/date.util';
import {useContainer} from '@/hooks/useContainer';
import {isSameMonth} from 'date-fns';

const PlanScheduleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ViewScheduleRouteProp>();
  const insets = useSafeAreaInsets();
  const {showToast} = useToastMessage();
  const {containerWidth, onContainerLayout} = useContainer();

  const {
    currentDate,
    isPlanScheduleCurrentMonth,
    minCalendarDate,
    maxcalendarDate,
    planScheduleDate,
    planSchedulePeriod,
    planScheduleTimeframeStatus,
  } = useTimeframe();
  const [scheduleDate, setScheduleDate] = useState(planScheduleDate);

  const [draftMode, setDraftMode] = useState(true);
  const {refetch: refetchPlanSchedule, isLoading} =
    useGetPlanSchedule(planSchedulePeriod);
  const {data: planScheduleView, refetch: refetchPlanScheduleView} =
    useGetPlanSchedule(DateUtil.getSchedulePeriod(scheduleDate));
  const {data: holidayView} = useGetHoliday(
    DateUtil.getSchedulePeriod(scheduleDate),
  );

  const sheetRef = useRef<BottomSheet>(null);
  const onTipsPress = useCallback(() => {
    sheetRef.current?.expand();
  }, []);

  const onSheetClose = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const onClose = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_LANDING,
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        onClose();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const onEditSchedule = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_PLAN_SCHEDULE,
        params: {
          date: new Date(scheduleDate).toUTCString(),
        },
      },
    });
  };

  const showScheduleUpdateSuccessToast = () => {
    showToast({
      type: 'success',
      label: 'Work schedule has been updated.',
      topOffset: 68,
    });
  };

  const displayNote = useMemo(() => {
    let note = null;

    if (planScheduleView) {
      if (planScheduleTimeframeStatus === 'within') {
        switch (planScheduleView.recordStatus) {
          case 1:
            note = <PendingApprovalNote currentDate={scheduleDate} />;
            break;

          case 2:
            note = <ApprovedScheduleNote currentDate={scheduleDate} />;
            break;

          case 4:
            note = <PastDeadlineScheduleNote currentDate={scheduleDate} />;
            break;
        }
      } else if (planScheduleTimeframeStatus === 'outside') {
        switch (planScheduleView.recordStatus) {
          case 1:
            note = <PendingApprovalNote currentDate={scheduleDate} />;
            break;

          default:
            note = <PastScheduleApprovalNote currentDate={scheduleDate} />;
            break;
        }
      }
    } else {
      note = <PastScheduleApprovalNote currentDate={scheduleDate} />;
    }

    if (!isSameMonth(scheduleDate, planScheduleDate)) {
      note = <PastScheduleApprovalNote currentDate={scheduleDate} />;
    }

    return note;
  }, [
    planScheduleView,
    scheduleDate,
    planScheduleDate,
    planScheduleTimeframeStatus,
  ]);

  const calendarView = useMemo(() => {
    let calendar = null;
    const isCurrentMonth = isSameMonth(scheduleDate, currentDate);
    const isSchedulePlanningCurrentMonth = isSameMonth(
      scheduleDate,
      planScheduleDate,
    );

    if (isPlanScheduleCurrentMonth) {
      if (isCurrentMonth) {
        calendar = (
          <ChangeScheduleCalendar
            initialDate={scheduleDate}
            savedSchedules={planScheduleView?.planScheduleDates || []}
            holidaySchedules={holidayView?.holidays || []}
            onMonthChange={setScheduleDate}
            minDate={minCalendarDate}
            maxDate={maxcalendarDate}
            containerWidth={containerWidth}
          />
        );
      } else {
        calendar = (
          <ViewScheduleCalendar
            initialDate={scheduleDate}
            schedules={planScheduleView?.planScheduleDates || []}
            onMonthChange={setScheduleDate}
            minDate={minCalendarDate}
            maxDate={maxcalendarDate}
            containerWidth={containerWidth}
          />
        );
      }
    } else {
      if (planScheduleTimeframeStatus === 'within') {
        if (draftMode) {
          calendar = (
            <PlanScheduleCalendar
              initialDate={scheduleDate}
              schedules={planScheduleView?.planScheduleDates || []}
              holidaySchedules={holidayView?.holidays || []}
              onMonthChange={setScheduleDate}
              minDate={minCalendarDate}
              maxDate={maxcalendarDate}
              containerWidth={containerWidth}
            />
          );
        } else {
          if (!isCurrentMonth && !isSchedulePlanningCurrentMonth) {
            calendar = (
              <ViewScheduleCalendar
                initialDate={scheduleDate}
                schedules={planScheduleView?.planScheduleDates || []}
                onMonthChange={setScheduleDate}
                minDate={minCalendarDate}
                maxDate={maxcalendarDate}
                containerWidth={containerWidth}
              />
            );
          } else {
            calendar = (
              <ChangeScheduleCalendar
                initialDate={scheduleDate}
                savedSchedules={planScheduleView?.planScheduleDates || []}
                holidaySchedules={holidayView?.holidays || []}
                onMonthChange={setScheduleDate}
                minDate={minCalendarDate}
                maxDate={maxcalendarDate}
                containerWidth={containerWidth}
              />
            );
          }
        }
      } else {
        if (planScheduleView?.recordStatus === 3) {
          calendar = (
            <PlanScheduleCalendar
              initialDate={scheduleDate}
              schedules={planScheduleView?.planScheduleDates || []}
              holidaySchedules={holidayView?.holidays || []}
              onMonthChange={setScheduleDate}
              minDate={minCalendarDate}
              maxDate={maxcalendarDate}
              containerWidth={containerWidth}
            />
          );
        } else {
          calendar = (
            <ChangeScheduleCalendar
              initialDate={scheduleDate}
              savedSchedules={planScheduleView?.planScheduleDates || []}
              holidaySchedules={holidayView?.holidays || []}
              onMonthChange={setScheduleDate}
              minDate={minCalendarDate}
              maxDate={maxcalendarDate}
              containerWidth={containerWidth}
            />
          );
        }
      }
    }

    return calendar;
  }, [
    currentDate,
    draftMode,
    holidayView,
    planScheduleView,
    scheduleDate,
    planScheduleDate,
    planScheduleTimeframeStatus,
    minCalendarDate,
    maxcalendarDate,
    containerWidth,
    isPlanScheduleCurrentMonth,
  ]);

  const displayTip = useMemo(() => {
    let tip = null;

    const isCurrentMonth = isSameMonth(scheduleDate, currentDate);
    const isPlanScheduleMonth = isSameMonth(scheduleDate, planScheduleDate);

    if (isPlanScheduleCurrentMonth) {
      if (isCurrentMonth) {
        tip = <EditScheduleTips onPress={onEditSchedule} />;
      }
    } else {
      if (isPlanScheduleMonth) {
        if (planScheduleView) {
          switch (planScheduleView.recordStatus) {
            case 2:
            case 3:
            case 4:
              tip = <EditScheduleTips onPress={onEditSchedule} />;
              break;

            default:
              break;
          }
        }
      } else {
        if (isCurrentMonth) {
          tip = <EditScheduleTips onPress={onEditSchedule} />;
        }
      }
    }

    return tip;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentDate,
    planScheduleView,
    scheduleDate,
    planScheduleDate,
    planScheduleTimeframeStatus,
  ]);

  useEffect(() => {
    if (planScheduleView) {
      switch (planScheduleView.recordStatus) {
        case 1:
          setDraftMode(true);
          break;

        case 2:
          setDraftMode(false);
          break;

        case 4:
          setDraftMode(false);
          break;

        default:
          break;
      }
    }
  }, [planScheduleView]);

  useEffect(() => {
    if (route.params?.success) {
      showScheduleUpdateSuccessToast();
      navigation.setParams({success: false});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.success]);

  useFocusEffect(
    useCallback(() => {
      refetchPlanSchedule();
      refetchPlanScheduleView();
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
            title={
              <Typography
                label="Plan your schedule"
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
            rightAction={
              <Button
                iconOnly
                icon={<QuestionMark />}
                size="small"
                color="light"
                onPress={onTipsPress}
              />
            }
          />

          {!isLoading && displayNote && (
            <View
              style={[
                layoutStyles.fullWidth,
                {
                  paddingHorizontal: spacer(16),
                  marginTop: spacer(-36),
                },
              ]}>
              {displayNote}
            </View>
          )}

          <ScrollView style={[layoutStyles.cover]}>
            <View
              style={{
                marginTop: spacer(24),
                paddingHorizontal: spacer(24),
              }}>
              <View onLayout={onContainerLayout}>{calendarView}</View>
            </View>

            {displayTip && (
              <View
                style={{paddingHorizontal: spacer(16), marginTop: spacer(32)}}>
                {displayTip}
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      <DynamicBottomSheet ref={sheetRef}>
        <PlotScheduleInstructionBottomSheet onClose={onSheetClose} />
      </DynamicBottomSheet>
    </SafeAreaView>
  );
};

export default PlanScheduleScreen;
