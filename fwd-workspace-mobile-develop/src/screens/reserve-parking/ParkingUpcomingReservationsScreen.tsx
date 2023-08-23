import React from 'react';
import {View, FlatList} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {useModal} from 'react-native-modalfy';

import {Button, Left, FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {NavigationHeader, ParkingSlot} from '@/views';
import {ModalStackParamsList} from '@/modals';
import {NavigationKey} from '@/navigations';

import {useGetUpcomingParkingReservations} from '@/services/query';
import {UpcomingParkingReservationResponse} from '@/services/api/api.service';

const ParkingUpcomingReservationsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {data: upcomingReservationData} = useGetUpcomingParkingReservations();

  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const onPressOption = (
    type: 'view' | 'change' | 'reserve' | 'cancel' = 'reserve',
    data?: UpcomingParkingReservationResponse,
  ) => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_PARKING_SELECT,
        params: data
          ? {
              viewReservation: type === 'view' ? data : undefined,
              changeReservation: type === 'change' ? data : undefined,
              cancelReservation: type === 'cancel' ? data : undefined,
            }
          : {},
      },
    });
  };

  const onPressViewSlot = (psData: UpcomingParkingReservationResponse) => {
    const label = `Basement ${psData.parkingFloor}, ${psData.parkingCode}`;

    const date = psData.parkingSchedule;

    openModal('BookSlotModal', {
      label: label || '',
      date,
      isPermanent: psData.parkingIsPermanent,
      onPressView: () => {
        closeModal('BookSlotModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          onPressOption('view', psData);
        }, 150);
      },
      onPressChange: () => {
        closeModal('BookSlotModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          onPressOption('change', psData);
        }, 150);
      },
      onPressCancel: () => {
        closeModal('BookSlotModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          onPressOption('cancel', psData);
        }, 150);
      },
    });
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
        <View style={[layoutStyles.cover]}>
          <NavigationHeader
            flat
            height={72}
            title={
              <Typography
                label="Upcoming Reservations"
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

          <View
            style={[
              layoutStyles.cover,
              {
                paddingTop: spacer(16),
                paddingBottom: spacer(24),
              },
            ]}>
            <FlatList
              data={upcomingReservationData}
              keyExtractor={d => `${d.planScheduleDatesId}`}
              renderItem={({item}) => (
                <ParkingSlot {...item} onPress={() => onPressViewSlot(item)} />
              )}
              ItemSeparatorComponent={() => (
                <View style={{paddingVertical: spacer(0)}} />
              )}
              style={{
                paddingHorizontal: spacer(32),
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ParkingUpcomingReservationsScreen;
