import {layoutStyles, spacer} from '@/utils';
import React, {useCallback, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  // isWeekend,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import {FWDColors, Typography} from '@/components';
import {useWMDirectReport} from '@/hooks/useWMDirectReport';
import {ManageTeamWorkforceTypes} from '@/types';

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

interface WMDirectReportMonthlyViewProps {
  initialDate: Date;
  currentDate: Date;
  containerWidth: number;
}

const WMDirectReportMonthlyView = ({
  initialDate,
  currentDate,
  containerWidth,
}: WMDirectReportMonthlyViewProps) => {
  const {reportData, updateBottomSheetTab, updateSelectedDate} =
    useWMDirectReport();

  const onViewDetail = useCallback(
    (date: Date, tab: ManageTeamWorkforceTypes) => {
      updateSelectedDate(date);
      updateBottomSheetTab(tab);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const contentView = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
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
          {
            width: spacer(width),
            height: spacer(28),
            paddingLeft: spacer(8),
          },
        ]}>
        <Typography label={dayOfWeek} variant="b4-m" color={FWDColors.grey4} />
      </View>
    ));

    rows.push(
      <View key="weekdays" style={layoutStyles.row}>
        {daysOfWeek}
      </View>,
    );

    while (day <= endDate) {
      for (let i = 0; i < columnNumber; i++) {
        const cloneDay = day;

        let bgColor: string = FWDColors.transparent;
        let color: string = FWDColors.greenDarker;
        let showShedule: boolean = true;

        // if (isWeekend(day)) {
        //   color = FWDColors.grey2;
        //   showShedule = false;
        // }

        if (!isSameMonth(day, monthStart)) {
          color = FWDColors.grey2;
        }

        if (isSameDay(day, initialDate)) {
          bgColor = FWDColors.greenDarker;
          color = FWDColors.white;
        }

        const data = reportData[format(cloneDay, 'yyyy-MM-dd')] || {};

        days.push(
          <View key={format(cloneDay, 'dd-MM-yyyy')}>
            <View
              style={[
                layoutStyles.cover,
                {
                  width: spacer(width),
                  borderColor: FWDColors.grey1,
                  borderLeftWidth: spacer(i === 0 ? 1 : 0),
                  borderRightWidth: spacer(1),
                },
              ]}>
              <View
                style={{
                  paddingLeft: spacer(4),
                  paddingTop: spacer(8),
                }}>
                <View
                  style={[
                    layoutStyles.row,
                    layoutStyles.cover,
                    layoutStyles.centerStart,
                    {
                      paddingVertical: spacer(2),
                      width: spacer(24),
                      height: spacer(24),
                      borderRadius: spacer(24),
                      backgroundColor: bgColor,
                    },
                  ]}>
                  <Typography
                    label={format(day, 'd')}
                    variant="b4-b"
                    color={color}
                  />
                </View>
              </View>

              {showShedule && (
                <View
                  style={{
                    marginTop: spacer(8),
                    paddingHorizontal: spacer(4),
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() =>
                      onViewDetail(cloneDay, ManageTeamWorkforceTypes.WFA)
                    }>
                    <View
                      style={[
                        layoutStyles.centerCenter,
                        {
                          backgroundColor: FWDColors.orange70,
                          borderRadius: spacer(4),
                          marginBottom: spacer(4),
                        },
                      ]}>
                      <Typography
                        label={
                          (data[ManageTeamWorkforceTypes.WFA] || []).length
                        }
                        variant="l3-b"
                        color={FWDColors.greenDarker}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() =>
                      onViewDetail(cloneDay, ManageTeamWorkforceTypes.WFB)
                    }>
                    <View
                      style={[
                        layoutStyles.centerCenter,
                        {
                          backgroundColor: FWDColors.yellow50,
                          borderRadius: spacer(4),
                          marginBottom: spacer(4),
                        },
                      ]}>
                      <Typography
                        label={
                          (data[ManageTeamWorkforceTypes.WFB] || []).length
                        }
                        variant="l3-b"
                        color={FWDColors.greenDarker}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() =>
                      onViewDetail(cloneDay, ManageTeamWorkforceTypes.WFO)
                    }>
                    <View
                      style={[
                        layoutStyles.centerCenter,
                        {
                          backgroundColor: FWDColors.greenLight50,
                          borderRadius: spacer(4),
                          marginBottom: spacer(4),
                        },
                      ]}>
                      <Typography
                        label={
                          (data[ManageTeamWorkforceTypes.WFO] || []).length
                        }
                        variant="l3-b"
                        color={FWDColors.greenDarker}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>,
        );

        day = addDays(day, 1);
      }

      rows.push(
        <View
          key={`row-${rows.length}`}
          style={[
            layoutStyles.row,
            {
              borderColor: FWDColors.grey1,
              borderTopWidth: spacer(rows.length === 1 ? 1 : 0),
              borderBottomWidth: spacer(1),
            },
          ]}>
          {days}
        </View>,
      );

      days = [];
    }

    return <View>{containerWidth > 0 ? rows : null}</View>;
  }, [initialDate, currentDate, containerWidth, reportData, onViewDetail]);

  return (
    <>
      <View>{contentView}</View>
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
    </>
  );
};

export default WMDirectReportMonthlyView;
