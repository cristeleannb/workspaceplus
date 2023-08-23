import React, {memo, useMemo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {format} from 'date-fns';

import {FWDColors, More, Typography, Parking} from '@/components';
import {layoutStyles, spacer} from '@/utils';

import {
  UpcomingParkingReservationResponse,
  WorkType,
} from '@/services/api/api.service';

interface ParkingSlotProps extends UpcomingParkingReservationResponse {
  onPress?: () => void;
}

const formatDate = (date?: Date) => {
  return date ? format(new Date(date), 'EEE, d MMM') : '';
};

export const ParkingSlot = memo((props: ParkingSlotProps) => {
  const {parkingCode, parkingSchedule, workType, parkingFloor, onPress} = props;

  const stationData = useMemo(() => {
    switch (workType) {
      case WorkType.WFO:
        return {
          schedule: formatDate(parkingSchedule),
          label: `Basement ${parkingFloor}, ${parkingCode}`,
        };

      default:
        return null;
    }
  }, [parkingCode, workType, parkingSchedule, parkingFloor]);

  if (!stationData) {
    return null;
  }

  return (
    <View style={{paddingVertical: spacer(8)}}>
      <Typography
        label={stationData.schedule}
        color={FWDColors.grey3}
        variant="l3-b"
      />
      <View
        style={[
          layoutStyles.row,
          layoutStyles.startCenter,
          {marginTop: spacer(4)},
        ]}>
        <Parking width={24} height={24} color={FWDColors.orange} />

        <Typography
          label={stationData.label}
          variant="h1"
          style={[layoutStyles.cover, {marginLeft: spacer(8)}]}
        />

        <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
          <More width={24} height={24} color={FWDColors.orange} />
        </TouchableOpacity>
      </View>
    </View>
  );
});
