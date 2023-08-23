import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  addDays,
  addMonths,
  differenceInHours,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameMonth,
  setHours,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import _ from 'lodash';
import {observer} from 'mobx-react';

import {
  AngleLeftThin,
  AngleRightThin,
  Calendar,
  FWDColors,
  Lock,
  Typography,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {HolidayModel, PlanScheduleDatesModel} from '@/services/api/api.service';
import {DateUtil} from '@/utils/date.util';
import {useStores} from '@/stores';

interface ChangeScheduleCalendarProps {
  initialDate: Date;
  savedSchedules?: PlanScheduleDatesModel[];
  draftSchedules?: PlanScheduleDatesModel[];
  holidaySchedules?: HolidayModel[];
  minDate?: Date;
  maxDate?: Date;
  containerWidth: number;
  onMonthChange?: (date: Date) => void;
  onDayPress?: (day: Date) => void;
}

export const ChangeScheduleCalendar = observer(
  ({
    initialDate,
    savedSchedules = [],
    draftSchedules = [],
    holidaySchedules = [],
    minDate,
    maxDate,
    containerWidth,
    onMonthChange,
    onDayPress,
  }: ChangeScheduleCalendarProps) => {
    const {appSettingStore} = useStores();

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

    const newSavedPlanSchedules = useMemo(() => {
      return _.mapValues(
        _.groupBy(savedSchedules, i =>
          format(new Date(i.scheduleDate || new Date()), 'yyyy-MM-dd'),
        ),
        schedule => schedule[0],
      );
    }, [savedSchedules]);

    const newDraftPlanSchedules = useMemo(() => {
      return _.mapValues(
        _.groupBy(draftSchedules, i =>
          format(new Date(i.scheduleDate || new Date()), 'yyyy-MM-dd'),
        ),
        schedule => schedule[0],
      );
    }, [draftSchedules]);

    const newHolidaySchedules = useMemo(() => {
      return _.mapValues(
        _.groupBy(holidaySchedules, i =>
          format(new Date(i.holidayDate || new Date()), 'yyyy-MM-dd'),
        ),
        schedule => schedule[0],
      );
    }, [holidaySchedules]);

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

          let bgColor: string = FWDColors.transparent;
          let color: string = FWDColors.greenDarker;
          let borderColor: string = FWDColors.grey2;
          let borderStyle: 'solid' | 'dotted' | 'dashed' | undefined = 'dotted';
          let borderWidth: number = 1;
          let readOnly: boolean = false;
          let isLocked: boolean = false;

          const holidayScheduleData = newHolidaySchedules[dayKey];
          const savedScheduleData = newSavedPlanSchedules[dayKey];
          const draftScheduleData = newDraftPlanSchedules[dayKey];

          if (holidayScheduleData) {
            bgColor = FWDColors.greyLight;
            color = FWDColors.grey3;
            borderColor = FWDColors.grey3;
            borderStyle = 'solid';
          }

          if (!isSameMonth(cloneDay, activeMonth)) {
            bgColor = FWDColors.transparent;
            color = FWDColors.grey2;
            borderColor = FWDColors.transparent;
            readOnly = true;
          } else {
            let workTypeId: number | undefined;

            if (savedScheduleData) {
              workTypeId = savedScheduleData.workTypeId;
              borderStyle = 'solid';
              borderWidth = 0;
              isLocked = !!savedScheduleData.isLock;
            }

            if (draftScheduleData) {
              workTypeId = draftScheduleData.workTypeId;
              borderStyle = 'dashed';
              borderWidth = 2;
            }

            if (workTypeId) {
              if (workTypeId === 1) {
                bgColor = FWDColors.orange70;
                color = FWDColors.greenDarker;
                borderColor = FWDColors.orange;
              } else if (workTypeId === 2) {
                bgColor = FWDColors.yellow50;
                color = FWDColors.greenDarker;
                borderColor = FWDColors.yellow;
              } else if (workTypeId === 3) {
                bgColor = FWDColors.greenLight50;
                color = FWDColors.greenDarker;
                borderColor = FWDColors.greenLight;
              }

              const hoursDiff = differenceInHours(
                DateUtil.asUTCDateTime(setHours(cloneDay, 9)),
                DateUtil.asUTCDateTime(new Date()),
              );

              if (hoursDiff < appSettingStore.changeScheduleLimit) {
                isLocked = true;
              }
            }
          }

          days.push(
            <View key={dayKey}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  const utcDate = new Date(
                    Date.UTC(
                      getYear(cloneDay),
                      getMonth(cloneDay),
                      getDate(cloneDay),
                    ),
                  );
                  !readOnly && onDayPress?.(utcDate);
                }}
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
                      borderWidth: isLocked ? spacer(2) : borderWidth,
                      backgroundColor: bgColor,
                      borderStyle: borderStyle,
                      borderColor: borderColor,
                    },
                  ]}>
                  <Typography
                    label={format(cloneDay, 'd')}
                    variant="l3-b"
                    color={color}
                  />

                  {isLocked && (
                    <View
                      style={[
                        layoutStyles.absolute,
                        layoutStyles.centerCenter,
                        {
                          right: spacer(-2),
                          bottom: spacer(-2),
                          width: spacer(18),
                          height: spacer(18),
                          borderRadius: spacer(18),
                          backgroundColor: borderColor,
                        },
                      ]}>
                      <Lock width={10} height={10} color={FWDColors.white} />
                    </View>
                  )}
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
    }, [
      newSavedPlanSchedules,
      newDraftPlanSchedules,
      newHolidaySchedules,
      daySize,
      activeMonth,
      appSettingStore.changeScheduleLimit,
      onDayPress,
    ]);

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
