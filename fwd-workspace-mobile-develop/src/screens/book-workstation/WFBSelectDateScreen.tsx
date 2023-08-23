import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {useModal} from 'react-native-modalfy';
import {format} from 'date-fns';
import _ from 'lodash';

import {Button, Left, FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {NavigationHeader, WorkStationDateItem} from '@/views';
import {ModalStackParamsList} from '@/modals';
import {WorkDates} from '@/types';
import {useWorkDate} from '@/hooks/useWorkDate';

const WFBSelectDateScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {workDates, setWorkDates} = useWorkDate();
  const [localWorkDates, setLocalWorkDates] = useState<WorkDates[]>([
    ...workDates,
  ]);

  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const onChangeTime = (id: number) => {
    const workDatesCopy: WorkDates[] = [...localWorkDates];
    const workDateIndex = _.findIndex(
      workDatesCopy,
      workDate => workDate.id === id,
    );

    if (workDateIndex >= 0) {
      const workDateData = workDatesCopy[workDateIndex];

      openModal('TimePickerModal', {
        date: workDateData.date,
        label: format(workDateData.date, 'EEE, d MMM'),
        onPressSave: selectedDate => {
          closeModal('TimePickerModal');
          workDateData.date = selectedDate;
          workDateData.selected = true;
          workDatesCopy[workDateIndex] = workDateData;
          setLocalWorkDates(workDatesCopy);
        },
      });
    }
  };

  const onUnselectSchedule = (id: number) => {
    const workDatesCopy = [...workDates];
    const workDateIndex = _.findIndex(
      workDatesCopy,
      workDate => workDate.id === id,
    );

    if (workDateIndex >= 0) {
      const workDateData = workDatesCopy[workDateIndex];
      workDateData.selected = false;
      workDatesCopy[workDateIndex] = workDateData;
      setLocalWorkDates(workDatesCopy);
    }
  };

  const onPressSave = () => {
    setWorkDates(localWorkDates);
    navigation.goBack();
  };

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
        <View
          style={[layoutStyles.cover, {backgroundColor: FWDColors.greyLight}]}>
          <NavigationHeader
            flat
            height={72}
            title={
              <Typography
                label="Select Date/s"
                variant="h2"
                color={FWDColors.white}
              />
            }
            leftAction={
              <Button
                iconOnly
                icon={<Left />}
                size="small"
                color="light"
                onPress={navigation.goBack}
              />
            }
          />

          <View style={[layoutStyles.cover, {padding: spacer(16)}]}>
            <Typography
              label="Select Date/s"
              variant="l3-m"
              color={FWDColors.greenDarker}
            />

            <FlatList
              data={localWorkDates}
              keyExtractor={d => d.id.toString()}
              renderItem={({item}) => (
                <WorkStationDateItem
                  selected={item.selected}
                  date={item.date}
                  onChangeTime={() => onChangeTime(item.id)}
                  onUnselect={() => onUnselectSchedule(item.id)}
                />
              )}
              ItemSeparatorComponent={() => (
                <View style={{marginTop: spacer(20)}} />
              )}
              style={{marginTop: spacer(12)}}
              contentInset={{bottom: 24}}
              bounces={false}
            />
          </View>
        </View>

        <View
          style={[
            {
              padding: spacer(24),
              backgroundColor: FWDColors.white,
              borderTopWidth: spacer(1),
              borderTopColor: FWDColors.grey1,
            },
          ]}>
          <Button label="Save" onPress={onPressSave} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WFBSelectDateScreen;
