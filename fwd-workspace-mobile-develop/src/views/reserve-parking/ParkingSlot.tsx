import React, {memo} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {FWDColors, More, Typography} from '@/components';
import {TableOffice} from '@/components/pictograms';
import {layoutStyles, spacer} from '@/utils';
import format from 'date-fns/format';

interface ParkingSlotProps {
  id: string;
  parkingSlot: string;
  dateReserved: Date;
  onPress?: () => void;
}

export const ParkingSlot = memo((props: ParkingSlotProps) => {
  const {parkingSlot, dateReserved, onPress} = props;

  return (
    <View style={{paddingVertical: spacer(8)}}>
      <Typography
        label={format(dateReserved, 'EEE, d MMMM')}
        color={FWDColors.grey3}
        variant="l3-b"
      />
      <View
        style={[
          layoutStyles.row,
          layoutStyles.startCenter,
          {marginTop: spacer(4)},
        ]}>
        <TableOffice width={24} height={24} />

        <Typography
          label={parkingSlot}
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
