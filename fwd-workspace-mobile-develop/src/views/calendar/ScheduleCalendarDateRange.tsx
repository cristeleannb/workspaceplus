import {layoutStyles, spacer} from '@/utils';
import React, {useMemo, useState} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWeekend,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';

import {
  AngleLeftThin,
  AngleRightThin,
  Calendar,
  FWDColors,
  Typography,
} from '@/components';
import {ManageTeamWorkforceTypes} from '@/types';
import {PlanScheduleDatesModel} from '@/services/api/api.service';
import _ from 'lodash';

type DateRangeItemType = 'single' | 'start' | 'middle' | 'end' | null;

export type DateRangeType = {
  [key: string]: {
    rangeType: DateRangeItemType;
    bgColor: string;
    data: PlanScheduleDatesModel;
  };
};

const workTypes = [
  {
    label: ManageTeamWorkforceTypes.WFA,
    color: FWDColors.orange70,
  },
  {
    label: ManageTeamWorkforceTypes.WFB,
    color: FWDColors.yellow,
  },
  {
    label: ManageTeamWorkforceTypes.WFO,
    color: FWDColors.greenLight,
  },
];

interface ScheduleCalendarDateRangeProps {
  currentDate: Date;
  activeDate: Date;
  schedules?: PlanScheduleDatesModel[];
  showLegend?: boolean;
  minDate?: Date;
  maxDate?: Date;
  containerWidth: number;
  onMonthChange?: (date: Date) => void;
}

const ScheduleCalendarDateRange = ({
  currentDate,
  activeDate,
  schedules = [],
  showLegend = true,
  minDate,
  maxDate,
  containerWidth,
  onMonthChange,
}: ScheduleCalendarDateRangeProps) => {
  const [activeMonth, setActiveMonth] = useState(
    activeDate ? new Date(activeDate) : new Date(),
  );

  const onPrevMonth = () => {
    const newMonth = subMonths(activeMonth, 1);
    let canNavigate = false;

    if (minDate) {
      if (!isBefore(newMonth, minDate)) {
        canNavigate = true;
      }
    } else {
      canNavigate = true;
    }

    if (canNavigate) {
      setActiveMonth(newMonth);
      onMonthChange?.(newMonth);
    }
  };

  const onNextMonth = () => {
    const newMonth = addMonths(activeMonth, 1);
    let canNavigate = false;

    if (maxDate) {
      if (!isAfter(newMonth, maxDate)) {
        canNavigate = true;
      }
    } else {
      canNavigate = true;
    }

    if (canNavigate) {
      setActiveMonth(newMonth);
      onMonthChange?.(newMonth);
    }
  };

  const transformedSchedules = useMemo<DateRangeType>(() => {
    const groupedSchedules = _.mapValues(
      _.groupBy(schedules, i =>
        format(new Date(i.scheduleDate || new Date()), 'yyyy-MM-dd'),
      ),
      schedule => schedule[0],
    );

    return _.mapValues(groupedSchedules, scheduleData => {
      let bgColor = FWDColors.transparent;
      let rangeType: DateRangeItemType = null;
      const workTypeId = scheduleData.workTypeId;

      const sameMonth = isSameMonth(
        new Date(activeMonth),
        new Date(scheduleData.scheduleDate || new Date()),
      );

      if (scheduleData.scheduleDate && sameMonth) {
        const scheduledDate = new Date(scheduleData.scheduleDate);
        const leftDate = subDays(scheduledDate, 1);
        const leftSchedule =
          groupedSchedules[format(leftDate, 'yyyy-MM-dd')] || {};

        const rightDate = addDays(scheduledDate, 1);
        const rightSchedule =
          groupedSchedules[format(rightDate, 'yyyy-MM-dd')] || {};

        const hasLeftConnection =
          scheduleData.workTypeId === leftSchedule.workTypeId;
        const hasRightConnection =
          scheduleData.workTypeId === rightSchedule.workTypeId;

        const weekStart = startOfWeek(scheduledDate);
        const weekEnd = endOfWeek(scheduledDate);

        if (hasLeftConnection && hasRightConnection) {
          rangeType = 'middle';

          if (isSameDay(scheduledDate, weekStart)) {
            rangeType = 'start';
          } else if (isSameDay(scheduledDate, weekEnd)) {
            rangeType = 'end';
          }
        } else if (!hasLeftConnection && hasRightConnection) {
          rangeType = 'start';

          if (isSameDay(scheduledDate, weekEnd)) {
            rangeType = 'single';
          }
        } else if (hasLeftConnection && !hasRightConnection) {
          rangeType = 'end';

          if (isSameDay(scheduledDate, weekStart)) {
            rangeType = 'single';
          }
        } else {
          rangeType = 'single';
        }
      }

      if (sameMonth) {
        if (workTypeId === 1) {
          bgColor = FWDColors.orange70;
        } else if (workTypeId === 2) {
          bgColor = FWDColors.yellow50;
        } else if (workTypeId === 3) {
          bgColor = FWDColors.greenLight50;
        }
      }

      return {
        data: scheduleData,
        rangeType,
        bgColor,
      };
    });
  }, [schedules, activeMonth]);

  const contentView = useMemo(() => {
    const monthStart = startOfMonth(activeMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const columnNumber = 7;
    const rows = [];

    let days = [];
    let day = startDate;

    const width = containerWidth / columnNumber;

    const firstDOW = startOfWeek(new Date());
    const shortWeekDaysArray = Array.from(Array(7)).map((e, i) =>
      format(addDays(firstDOW, i), 'EEEEE'),
    );

    const daysOfWeek = shortWeekDaysArray.map((dayOfWeek, index) => (
      <View
        key={index}
        style={[
          layoutStyles.centerCenter,
          {
            width: spacer(width),
            height: spacer(28),
            paddingLeft: spacer(8),
          },
        ]}>
        <Typography label={dayOfWeek} variant="b4-m" color={FWDColors.grey2} />
      </View>
    ));

    rows.push(
      <View
        key="weekdays"
        style={[
          layoutStyles.row,
          {
            marginBottom: spacer(8),
          },
        ]}>
        {daysOfWeek}
      </View>,
    );

    while (day <= endDate) {
      for (let i = 0; i < columnNumber; i++) {
        const cloneDay = day;

        let color: string = FWDColors.greenDarker;
        let innerContainerStyle: StyleProp<ViewStyle> = {};
        let paddingStyleProp: StyleProp<ViewStyle> = {};

        const sameDay = isSameDay(day, currentDate);

        if (isWeekend(day)) {
          color = FWDColors.greenDarker;
        }

        if (!isSameMonth(day, monthStart)) {
          color = FWDColors.grey2;
        }

        if (sameDay) {
          color = FWDColors.greenDarker;
        }

        const data = transformedSchedules[format(cloneDay, 'yyyy-MM-dd')] || {};
        const sideGutter = 3;

        switch (data.rangeType) {
          case 'single':
            innerContainerStyle = {
              borderRadius: width,
            };
            paddingStyleProp = {
              paddingHorizontal: sideGutter,
            };
            break;

          case 'start':
            innerContainerStyle = {
              borderTopLeftRadius: width,
              borderBottomLeftRadius: width,
              width: width - 2,
            };
            paddingStyleProp = {
              paddingLeft: sideGutter,
            };
            break;

          case 'middle':
            paddingStyleProp = {
              paddingHorizontal: 0,
            };
            break;

          case 'end':
            innerContainerStyle = {
              borderTopRightRadius: width,
              borderBottomRightRadius: width,
              width: width - 2,
            };
            paddingStyleProp = {
              paddingRight: sideGutter,
            };
            break;

          default:
            paddingStyleProp = {
              paddingHorizontal: sideGutter,
            };
            innerContainerStyle = {
              borderRadius: 0,
            };
            break;
        }

        days.push(
          <View
            key={format(cloneDay, 'dd-MM-yyyy')}
            style={{
              marginVertical: spacer(2),
              width: spacer(width),
              height: spacer(width - 12),
              ...paddingStyleProp,
            }}>
            <View
              style={[
                layoutStyles.centerCenter,
                layoutStyles.fullHeight,
                layoutStyles.cover,
                {
                  backgroundColor: data.bgColor,
                  ...innerContainerStyle,
                },
              ]}>
              <Typography
                label={format(day, 'd')}
                variant={!sameDay ? 'b4-b' : 'h2'}
                color={color}
              />
            </View>
          </View>,
        );

        day = addDays(day, 1);
      }

      rows.push(
        <View key={`row-${rows.length}`} style={[layoutStyles.row]}>
          {days}
        </View>,
      );

      days = [];
    }

    return <View>{containerWidth > 0 ? rows : null}</View>;
  }, [currentDate, activeMonth, containerWidth, transformedSchedules]);

  return (
    <View>
      {containerWidth > 0 && (
        <>
          <View
            style={[
              layoutStyles.row,
              layoutStyles.betweenCenter,
              {
                marginBottom: spacer(24),
              },
            ]}>
            <View style={[layoutStyles.row, layoutStyles.startCenter]}>
              <Calendar width={24} height={24} color={FWDColors.orange} />
              <Typography
                label={format(new Date(activeMonth || new Date()), 'MMMM yyyy')}
                variant="h2"
                color={FWDColors.greenDarker}
                style={{
                  marginLeft: spacer(4),
                }}
              />
            </View>

            <View style={[layoutStyles.row, layoutStyles.startCenter]}>
              <TouchableOpacity activeOpacity={0.75} onPress={onPrevMonth}>
                <AngleLeftThin
                  width={24}
                  height={24}
                  color={FWDColors.greenDarker}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onNextMonth}
                style={{
                  marginLeft: spacer(28),
                }}>
                <AngleRightThin
                  width={24}
                  height={24}
                  color={FWDColors.greenDarker}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View>{contentView}</View>

          {showLegend && (
            <View
              style={[
                layoutStyles.row,
                layoutStyles.betweenCenter,
                {
                  marginTop: spacer(24),
                },
              ]}>
              {workTypes.map(workType => (
                <View
                  key={workType.label}
                  style={[layoutStyles.row, layoutStyles.startCenter]}>
                  <View
                    style={{
                      width: spacer(8),
                      height: spacer(8),
                      borderRadius: spacer(8),
                      backgroundColor: workType.color,
                      marginRight: spacer(8),
                    }}
                  />

                  <Typography
                    label={workType.label}
                    color={FWDColors.greenDarker}
                    variant="l2-m"
                  />
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default ScheduleCalendarDateRange;
