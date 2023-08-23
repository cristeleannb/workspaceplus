import React from 'react';
import {GestureResponderEvent, View} from 'react-native';

import {Button, FWDColors, Typography} from '@/components';
import {News} from '@/components/pictograms';
import {Right} from '@/components/icons';
import {layoutStyles, spacer} from '@/utils';

interface LoginTipsProps {
  onTipsPress?: (event: GestureResponderEvent) => void;
}

export const LoginTips = ({onTipsPress}: LoginTipsProps) => {
  return (
    <View
      style={[
        layoutStyles.row,
        layoutStyles.betweenCenter,
        {
          height: spacer(64),
          borderRadius: spacer(8),
          paddingLeft: spacer(12),
          paddingRight: spacer(16),
          backgroundColor: FWDColors.yellow20,
        },
      ]}>
      <View style={[layoutStyles.row, layoutStyles.startCenter]}>
        <View
          style={{
            marginRight: spacer(12),
          }}>
          <News width={32} height={32} color={FWDColors.orange} />
        </View>
        <Typography
          label="Show Online Security Tips"
          variant="h1"
          color={FWDColors.orange}
        />
      </View>

      <Button
        iconOnly
        color="primary"
        size="small"
        icon={<Right width={24} height={24} />}
        onPress={onTipsPress}
      />
    </View>
  );
};
