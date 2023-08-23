import React, {memo, useMemo, useState} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameMonth,
  isWeekend,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import _ from 'lodash';

import {
  AngleLeftThin,
  AngleRightThin,
  Calendar,
  FWDColors,
  Typography,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {PlanScheduleDatesModel} from '@/services/api/api.service';

interface ViewScheduleCalendarProps {
  initialDate: Date;
  schedules?: PlanScheduleDatesModel[];
  minDate?: Date;
  maxDate?: Date;
  containerWidth: number;
  onMonthChange?: (date: Date) => void;
}

export const ViewScheduleCalendar = memo(
  ({
    initialDate,
    schedules = [],
    minDate,
    maxDate,
    containerWidth,
    onMonthChange,
  }: ViewScheduleCalendarProps) => {
    const [activeMonth, setActiveMonth] = useState(
      initialDate ? new Date(initialDate) : new Date(),
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

    const newPlanSchedules = useMemo(() => {
      return _.mapValues(
        _.groupBy(schedules, i =>
          format(new Date(i.scheduleDate || new Date()), 'yyyy-MM-dd'),
        ),
        schedule => schedule[0],
      );
    }, [schedules]);

    const daySize = useMemo(() => {
      if (containerWidth > 0) {
        const columnNumber = 7;
        const whiteSpace = (columnNumber - 1) * 6;
        const size = (containerWidth - whiteSpace) / columnNumber;
        return size;
      } else {
        return 0;
      }
    }, [containerWidth]);

    const contentView = useMemo(() => {
      const monthStart = startOfMonth(activeMonth);
      const monthEnd = endOfMonth(monthStart);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);

      const columnNumber = 7;
      const rows = [];

      let days = [];
      let day = startDate;

      rows.push(
        <View
          key="weekdays"
          style={[
            layoutStyles.row,
            layoutStyles.aroundCenter,
            {
              marginTop: spacer(24),
            },
          ]}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayOfWeek, i) => (
            <View
              key={dayOfWeek + i}
              style={[
                layoutStyles.centerCenter,
                {
                  width: daySize,
                },
              ]}>
              <Typography
                label={dayOfWeek}
                variant="b4-m"
                color={FWDColors.grey4}
              />
            </View>
          ))}
        </View>,
      );

      while (day <= endDate) {
        for (let i = 0; i < columnNumber; i++) {
          const cloneDay = day;
          const dayKey = format(cloneDay, 'yyyy-MM-dd');
          const utcDate = new Date(
            Date.UTC(getYear(cloneDay), getMonth(cloneDay), getDate(cloneDay)),
          );

          let bgColor: string = FWDColors.transparent;
          let color: string = FWDColors.greenDarker;

          const scheduleData = newPlanSchedules[dayKey];

          if (isWeekend(utcDate)) {
            color = FWDColors.greenDarker;
          }

          if (!isSameMonth(cloneDay, activeMonth)) {
            bgColor = FWDColors.transparent;
            color = FWDColors.grey2;
          } else {
            let workTypeId: number | undefined;

            if (scheduleData) {
              workTypeId = scheduleData.workTypeId;
            }

            if (workTypeId) {
              if (workTypeId === 1) {
                bgColor = FWDColors.orange70;
                color = FWDColors.greenDarker;
              } else if (workTypeId === 2) {
                bgColor = FWDColors.yellow50;
                color = FWDColors.greenDarker;
              } else if (workTypeId === 3) {
                bgColor = FWDColors.greenLight50;
                color = FWDColors.greenDarker;
              }
            }
          }

          days.push(
            <View key={dayKey}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor: bgColor,
                  borderRadius: daySize,
                }}>
                <View
                  style={[
                    layoutStyles.centerCenter,
                    {
                      width: daySize,
                      height: daySize,
                      borderRadius: daySize,
                      backgroundColor: bgColor,
                    },
                  ]}>
                  <Typography
                    label={format(cloneDay, 'd')}
                    variant="l3-b"
                    color={color}
                  />
                </View>
              </TouchableOpacity>
            </View>,
          );

          day = addDays(day, 1);
        }

        rows.push(
          <View
            key={`row-${rows.length}`}
            style={[
              layoutStyles.row,
              layoutStyles.aroundCenter,
              {
                marginTop: spacer(12),
                marginBottom: spacer(0),
              },
            ]}>
            {days}
          </View>,
        );

        days = [];
      }

      return <View>{daySize > 0 ? rows : null}</View>;
    }, [newPlanSchedules, daySize, activeMonth]);

    return (
      <View>
        {daySize > 0 && (
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
                  label={format(
                    new Date(activeMonth || new Date()),
                    'MMMM yyyy',
                  )}
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

            {contentView}
          </>
        )}
      </View>
    );
  },
);
