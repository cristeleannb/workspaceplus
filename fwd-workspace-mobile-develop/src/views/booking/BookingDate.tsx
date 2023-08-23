import React, {memo} from 'react';
import {View} from 'react-native';

import {FWDColors, Typography, Calendar} from '@/components';
import {layoutStyles, spacer} from '@/utils';

interface BookingDateProps {
  text: string;
}

export const BookingDate = memo(({text}: BookingDateProps) => {
  return (
    <View
      style={[
        layoutStyles.row,
        layoutStyles.startCenter,
        {marginBottom: spacer(8)},
      ]}>
      <View
        style={[
          layoutStyles.centerCenter,
          {paddingHorizontal: spacer(2), marginRight: spacer(6)},
        ]}>
        <Calendar width={20} height={20} color={FWDColors.orange} />
      </View>

      <Typography label={text} variant="h1" style={[layoutStyles.cover]} />
    </View>
  );
});
