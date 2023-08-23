import React from 'react';
import {GestureResponderEvent, View} from 'react-native';

import {Button, FWDColors, Typography} from '@/components';
import {Calendar, Right} from '@/components/icons';
import {layoutStyles, spacer} from '@/utils';

interface ChangeScheduleTipsProps {
  onPress?: (event: GestureResponderEvent) => void;
}

export const ChangeScheduleTips = ({onPress}: ChangeScheduleTipsProps) => {
  return (
    <View
      style={[
        layoutStyles.row,
        layoutStyles.betweenCenter,
        {
          borderRadius: spacer(8),
          padding: spacer(16),
          backgroundColor: FWDColors.orange20,
        },
      ]}>
      <View style={[layoutStyles.centerStart, {maxWidth: spacer(206)}]}>
        <View style={[layoutStyles.row, layoutStyles.startCenter]}>
          <Calendar
            width={24}
            height={24}
            color={FWDColors.orange}
            style={{marginRight: spacer(4)}}
          />
          <Typography
            label="Edit Schedule"
            variant="h1"
            color={FWDColors.orange}
          />
        </View>

        {/* <Typography
          style={{paddingTop: spacer(6)}}
          label="WFO days are locked and cannot be edited."
          variant="l3-m"
          color={FWDColors.greenDark}
        /> */}
      </View>

      <Button
        iconOnly
        color="primary"
        size="small"
        icon={<Right width={24} height={24} />}
        onPress={onPress}
      />
    </View>
  );
};
