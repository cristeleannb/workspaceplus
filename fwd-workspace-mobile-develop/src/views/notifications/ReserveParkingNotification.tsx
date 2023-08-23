import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

import {AngleRightThick, FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {BigDot, CalendarExclamation} from '@/components';
import {useNavigation} from '@react-navigation/native';
import {NavigationKey} from '@/navigations';
import {UpcomingParkingReservationResponse} from '@/services/api/api.service';

interface ReserveParkingNotificationProps {
  reservationStatus: number;
  count: number;
}

const ReserveParkingNotification = ({
  count,
}: ReserveParkingNotificationProps) => {
  const navigation = useNavigation();
  const onReserveParking = (
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
  return (
    <View
      style={{
        backgroundColor: FWDColors.orange5,
        marginTop: spacer(24),
        borderRadius: spacer(8),
      }}>
      <View
        style={[
          layoutStyles.row,
          layoutStyles.startCenter,
          {
            padding: spacer(16),
            borderBottomColor: FWDColors.lightblue,
            borderBottomWidth: spacer(1),
          },
        ]}>
        <BigDot width={10} height={10} color={FWDColors.orange} />
        <Typography
          label="Reserve a Parking"
          variant="h1"
          color={FWDColors.greenDarker}
          style={{marginLeft: spacer(12)}}
        />
      </View>
      <View
        style={[layoutStyles.row, layoutStyles.cover, {padding: spacer(16)}]}>
        <CalendarExclamation width={24} height={24} color={FWDColors.orange} />

        <View style={[layoutStyles.cover, {marginLeft: spacer(8)}]}>
          <Text style={[layoutStyles.row, layoutStyles.cover]}>
            <Typography
              label={'You have '}
              variant="l2-b"
              color={FWDColors.greenDarker}
            />
            <Typography
              label={`${count} upcoming WFO ${count > 1 ? 'days' : 'day'} `}
              variant="l2-m"
              color={FWDColors.orange}
            />
            <Typography
              label={'with no seat reservation yet.'}
              variant="l2-b"
              color={FWDColors.greenDarker}
            />
          </Text>
          <TouchableOpacity
            style={[
              layoutStyles.row,
              layoutStyles.startCenter,
              {
                marginTop: spacer(12),
              },
            ]}
            onPress={onReserveParking}>
            <Typography
              label="Reserve a Parking"
              variant="l3-m"
              color={FWDColors.orange}
            />
            <AngleRightThick
              width={16}
              height={16}
              color={FWDColors.orange}
              style={{marginLeft: spacer(6)}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReserveParkingNotification;
