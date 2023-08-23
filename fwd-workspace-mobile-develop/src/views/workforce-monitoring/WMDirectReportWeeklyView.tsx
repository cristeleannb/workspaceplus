import {layoutStyles, spacer} from '@/utils';
import React, {useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  addDays,
  addWeeks,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  subWeeks,
} from 'date-fns';

import {
  AngleLeftThin,
  AngleRightThin,
  FWDColors,
  Typography,
} from '@/components';
import {useWMDirectReport} from '@/hooks/useWMDirectReport';
import {ManageTeamCardGroup} from '..';

interface WMDirectReportWeeklyViewProps {
  currentDate: Date;
  containerWidth: number;
  onDateChange: (date: Date) => void;
}

const WMDirectReportWeeklyView = ({
  currentDate,
  containerWidth,
  onDateChange,
}: WMDirectReportWeeklyViewProps) => {
  const {selectedDate, updateSelectedDate, updateBottomSheetTab} =
    useWMDirectReport();

  const onPrevWeek = () => {
    const newViewDate = subWeeks(currentDate, 1);
    onDateChange(newViewDate);
  };

  const onNextWeek = () => {
    const newViewDate = addWeeks(currentDate, 1);
    onDateChange(newViewDate);
  };

  const onSelectDate = (date: Date) => {
    updateSelectedDate(date);
  };

  const headerView = useMemo(() => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);

    const columnNumber = 7;

    let days = [];
    let day = startDate;

    const iconSpace = 24 * 2;
    const width = (containerWidth - iconSpace) / columnNumber;

    days.push(
      <TouchableOpacity
        key="left-arrow"
        activeOpacity={0.75}
        onPress={onPrevWeek}>
        <AngleLeftThin width={24} height={20} color={FWDColors.greenDarker} />
      </TouchableOpacity>,
    );

    while (day <= endDate) {
      const clonedDay = day;
      const sameDay = isSameDay(clonedDay, selectedDate);

      days.push(
        <TouchableOpacity
          key={format(clonedDay, 'dd-MM-yyyy')}
          activeOpacity={0.75}
          onPress={() => onSelectDate(clonedDay)}>
          <View
            style={[
              layoutStyles.centerCenter,
              {
                paddingVertical: spacer(8),
                width: width,
                height: spacer(52),
                backgroundColor: sameDay
                  ? FWDColors.greenDarker
                  : FWDColors.transparent,
                borderRadius: spacer(100),
              },
            ]}>
            <Typography
              label={format(day, 'EEEEE')}
              variant={sameDay ? 'l2-m' : 'l2-b'}
              color={sameDay ? FWDColors.grey1 : FWDColors.grey3}
            />
            <Typography
              label={format(day, 'd')}
              variant={sameDay ? 'h2' : 'l2-b'}
              color={sameDay ? FWDColors.white : FWDColors.greenDarker}
            />
          </View>
        </TouchableOpacity>,
      );

      day = addDays(day, 1);
    }

    days.push(
      <TouchableOpacity
        key="right-arrow"
        activeOpacity={0.75}
        onPress={onNextWeek}>
        <AngleRightThin width={20} height={20} color={FWDColors.greenDarker} />
      </TouchableOpacity>,
    );

    return (
      <View style={[layoutStyles.row, layoutStyles.startCenter]}>
        {containerWidth > 0 ? days : null}
      </View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, containerWidth, selectedDate]);

  return (
    <>
      <View>{headerView}</View>
      <View
        style={{
          marginTop: spacer(24),
        }}>
        <ManageTeamCardGroup onPress={tab => updateBottomSheetTab(tab)} />
      </View>
    </>
  );
};

export default WMDirectReportWeeklyView;
