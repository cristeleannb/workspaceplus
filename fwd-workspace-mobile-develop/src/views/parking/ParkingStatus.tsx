import React, {memo} from 'react';
import {View} from 'react-native';

import {FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';

interface ParkingStatusProps {
  color: string;
  text: string;
}

export const ParkingStatus = memo((props: ParkingStatusProps) => {
  const {color, text} = props;

  return (
    <View style={[layoutStyles.row, layoutStyles.startCenter]}>
      <View
        style={{
          backgroundColor: color,
          height: spacer(8),
          width: spacer(8),
          borderRadius: spacer(999),
          marginRight: spacer(8),
        }}
      />

      <Typography label={text} variant="l3-b" color={FWDColors.greenDarker} />
    </View>
  );
});
