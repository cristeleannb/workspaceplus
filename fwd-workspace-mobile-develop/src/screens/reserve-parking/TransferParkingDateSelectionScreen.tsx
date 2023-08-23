import React, {useState, useMemo, useEffect} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {
  endOfMonth,
  format,
  getDate,
  getMonth,
  getYear,
  setMonth,
  setYear,
  startOfMonth,
} from 'date-fns';
import _ from 'lodash';

import {NavigationHeader, TransferParkingCalendar} from '@/views';
import {
  Advisor2,
  Avatar,
  Button,
  Close,
  FWDColors,
  Typography,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {useGetEmployeeScheduleById} from '@/services/query/useSchedule';
import {PlanScheduleDatesModelWithCheckIns} from '@/services/api/api.service';
import {useContainer} from '@/hooks/useContainer';
import {ManageTeamWorkforceTypes} from '@/types';
import {useTransferParking} from '@/hooks/useTransferParking';

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

const mutateDate = (year: number, month: number): Date => {
  return setYear(setMonth(new Date(), month - 1), year);
};

const TransferParkingDateSelectionScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {containerWidth, onContainerLayout} = useContainer();
  const {selectedEmployee, setSchedulesSelected} = useTransferParking();

  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [scheduleDateId, setScheduleDateId] = useState<number>();
  const [selectedScheduleList, setSelectedScheduleList] = useState<
    PlanScheduleDatesModelWithCheckIns[]
  >([]);
  const [savedScheduleList, setSavedScheduleList] = useState<
    PlanScheduleDatesModelWithCheckIns[]
  >([]);

  const {data: planScheduleView} = useGetEmployeeScheduleById(
    scheduleDateId || 0,
  );

  const onClose = () => {
    navigation.goBack();
  };

  const onSelectPress = () => {
    setSchedulesSelected(selectedScheduleList);
    onClose();
  };

  const onSelectDate = (date: Date) => {
    const scheduleFinder = (item: PlanScheduleDatesModelWithCheckIns) => {
      if (!item.scheduleDate) {
        return false;
      }

      const scheduleDateItem = new Date(item.scheduleDate);

      return (
        getYear(date) === getYear(scheduleDateItem) &&
        getMonth(date) === getMonth(scheduleDateItem) &&
        getDate(date) === getDate(scheduleDateItem)
      );
    };

    const savedScheduleDateIndex = _.findIndex(
      savedScheduleList,
      scheduleFinder,
    );
    const selectedScheduleDateIndex = _.findIndex(
      selectedScheduleList,
      scheduleFinder,
    );

    if (savedScheduleDateIndex < 0 && selectedScheduleDateIndex < 0) {
      return;
    }

    const newSavedScheduleDateList = [...savedScheduleList];
    const newSelectedScheduleList = [...selectedScheduleList];

    if (savedScheduleDateIndex >= 0) {
      const savedDateData = newSavedScheduleDateList[savedScheduleDateIndex];
      newSavedScheduleDateList.splice(savedScheduleDateIndex, 1);
      newSelectedScheduleList.push(savedDateData);
    } else if (selectedScheduleDateIndex >= 0) {
      const selectedDateData =
        newSelectedScheduleList[selectedScheduleDateIndex];
      newSelectedScheduleList.splice(selectedScheduleDateIndex, 1);
      newSavedScheduleDateList.push(selectedDateData);
    }

    setSavedScheduleList(newSavedScheduleDateList);
    setSelectedScheduleList(newSelectedScheduleList);
  };

  const calendarLimit = useMemo(() => {
    let minDate = new Date();
    let maxDate = new Date();

    if (selectedEmployee) {
      const sortedDates = _.chain(selectedEmployee.childItems)
        .map(i => mutateDate(i.year || 0, i.month || 0))
        .sortBy(i => i)
        .value();

      if (sortedDates.length > 0) {
        if (sortedDates.length === 1) {
          minDate = sortedDates[0];
          maxDate = sortedDates[0];
        } else {
          minDate = sortedDates[0];
          maxDate = sortedDates[sortedDates.length - 1];
        }
      }
    }

    return {
      minDate: startOfMonth(minDate),
      maxDate: endOfMonth(maxDate),
    };
  }, [selectedEmployee]);

  const formattedSelectedDates = useMemo(() => {
    if (selectedScheduleList.length <= 0) {
      return 'Set Date';
    } else if (selectedScheduleList.length === 1) {
      return format(
        new Date(selectedScheduleList[0].scheduleDate || new Date()),
        'MMM d',
      );
    } else {
      return `${selectedScheduleList.length} Days`;
    }
  }, [selectedScheduleList]);

  useEffect(() => {
    if (selectedEmployee && selectedEmployee.childItems) {
      const childItem = _.find(
        selectedEmployee.childItems,
        i =>
          i.year === getYear(scheduleDate) &&
          i.month === getMonth(scheduleDate) + 1,
      );

      setScheduleDateId(childItem?.employeeHasPlanScheduleId);
    }
  }, [scheduleDate, selectedEmployee]);

  useEffect(() => {
    setSavedScheduleList([]);
    setSelectedScheduleList([]);
  }, [scheduleDate]);

  useEffect(() => {
    setSavedScheduleList(planScheduleView?.planScheduleDates || []);
  }, [planScheduleView?.planScheduleDates]);

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
            backgroundColor: FWDColors.greyLight,
            paddingBottom: spacer(insets.bottom),
          },
        ]}>
        <View style={layoutStyles.cover}>
          <NavigationHeader
            flat
            height={72}
            title={
              <Typography
                label="Select Dates"
                variant="l1-b"
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

          <View
            style={[layoutStyles.centerCenter, {paddingVertical: spacer(16)}]}>
            <Avatar
              size={48}
              imageUrl={selectedEmployee?.employeeImage}
              gender={selectedEmployee?.employeeGender}
            />
            <Text style={{marginTop: spacer(4)}}>
              <Typography
                label={selectedEmployee?.employeeName || ''}
                variant="h2"
                color={FWDColors.greenDarker}
              />
            </Text>
            <View
              style={[
                layoutStyles.centerCenter,
                {marginTop: spacer(4), paddingHorizontal: spacer(24)},
              ]}>
              <View style={[layoutStyles.row, layoutStyles.startCenter]}>
                <Advisor2
                  width={24}
                  height={24}
                  color={FWDColors.orange}
                  style={{
                    marginRight: spacer(4),
                  }}
                />
                <Text>
                  <Typography
                    label={selectedEmployee?.departmentName || ''}
                    color={FWDColors.grey4}
                    variant="l2-b"
                  />
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            style={[
              layoutStyles.cover,
              {
                borderTopLeftRadius: spacer(40),
                borderTopRightRadius: spacer(40),
                backgroundColor: FWDColors.white,
              },
            ]}>
            <View
              style={[
                {
                  paddingBottom: spacer(24),
                },
              ]}>
              <View
                style={{
                  marginTop: spacer(24),
                  paddingHorizontal: spacer(24),
                }}>
                <View onLayout={onContainerLayout}>
                  <TransferParkingCalendar
                    savedSchedules={savedScheduleList}
                    selectedSchedules={selectedScheduleList}
                    containerWidth={containerWidth}
                    initialDate={scheduleDate}
                    onMonthChange={setScheduleDate}
                    onDayPress={onSelectDate}
                    minDate={calendarLimit.minDate}
                    maxDate={calendarLimit.maxDate}
                  />
                </View>
              </View>

              <View
                style={[
                  layoutStyles.row,
                  layoutStyles.betweenCenter,
                  {
                    marginTop: spacer(24),
                    paddingHorizontal: spacer(32),
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
            </View>
          </ScrollView>
        </View>

        <View
          style={[
            layoutStyles.row,
            {
              paddingVertical: spacer(16),
              paddingHorizontal: spacer(24),
              borderTopWidth: spacer(1),
              borderTopColor: FWDColors.grey1,
              backgroundColor: FWDColors.white,
            },
          ]}>
          <View
            style={[
              layoutStyles.cover,
              layoutStyles.row,
              layoutStyles.startCenter,
            ]}>
            <View style={layoutStyles.cover}>
              <Typography
                style={{
                  color: FWDColors.greenDarker,
                }}
                label="Selected Dates"
                variant="b4-b"
              />
              <Typography label={formattedSelectedDates} variant="h2" />
            </View>

            <Button
              label="Select"
              onPress={onSelectPress}
              disabled={selectedScheduleList.length <= 0}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TransferParkingDateSelectionScreen;
