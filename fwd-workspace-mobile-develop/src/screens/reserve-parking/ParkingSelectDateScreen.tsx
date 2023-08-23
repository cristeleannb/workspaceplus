import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {useModal} from 'react-native-modalfy';
import {format} from 'date-fns';
import _ from 'lodash';

import {Button, Left, FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {NavigationHeader, ParkingDateItem} from '@/views';
import {ModalStackParamsList} from '@/modals';
import {ParkingDates} from '@/types';
import {useParkingDate} from '@/hooks/useParkingDate';

const ParkingSelectDateScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {parkingDates, setParkingDates} = useParkingDate();
  const [localParkingDates, setLocalParkingDates] = useState<ParkingDates[]>([
    ...parkingDates,
  ]);

  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const onChangeTime = (id: number) => {
    const parkingDatesCopy: ParkingDates[] = [...localParkingDates];
    const parkingDateIndex = _.findIndex(
      parkingDatesCopy,
      parkingDate => parkingDate.id === id,
    );

    if (parkingDateIndex >= 0) {
      const parkingDateData = parkingDatesCopy[parkingDateIndex];

      openModal('TimePickerModal', {
        date: parkingDateData.date,
        label: format(parkingDateData.date, 'EEE, d MMM'),
        onPressSave: selectedDate => {
          closeModal('TimePickerModal');
          parkingDateData.date = selectedDate;
          parkingDateData.selected = true;
          parkingDatesCopy[parkingDateIndex] = parkingDateData;
          setLocalParkingDates(parkingDatesCopy);
        },
      });
    }
  };

  const onUnselectSchedule = (id: number) => {
    const parkingDatesCopy = [...parkingDates];
    const parkingDateIndex = _.findIndex(
      parkingDatesCopy,
      parkingDate => parkingDate.id === id,
    );

    if (parkingDateIndex >= 0) {
      const parkingDateData = parkingDatesCopy[parkingDateIndex];
      parkingDateData.selected = false;
      parkingDatesCopy[parkingDateIndex] = parkingDateData;
      setLocalParkingDates(parkingDatesCopy);
    }
  };

  const onPressSave = () => {
    setParkingDates(localParkingDates);
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
              data={localParkingDates}
              keyExtractor={d => d.id.toString()}
              renderItem={({item}) => (
                <ParkingDateItem
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

export default ParkingSelectDateScreen;
