import React from 'react';
import {GestureResponderEvent, View} from 'react-native';

import {layoutStyles, spacer} from '@/utils';
import {Button, FWDColors, Typography} from '@/components';
import {News} from '@/components/pictograms';

const tipList = [
  "Do not take option to 'store or remember password' if prompted by system.",
  'Take precautions when viewing the information in public/crowded areas.',
  'Please do not access this system on another’s mobile phone.',
];

interface SecurityTipsBottomSheetProps {
  onClose: (event: GestureResponderEvent) => void;
}

export const SecurityTipsBottomSheet = ({
  onClose,
}: SecurityTipsBottomSheetProps) => {
  return (
    <View
      style={{
        paddingHorizontal: spacer(16),
        paddingBottom: spacer(16),
      }}>
      <View style={[layoutStyles.centerCenter]}>
        <News width={80} height={80} color={FWDColors.orange} />
      </View>

      <View
        style={{
          marginTop: spacer(8),
        }}>
        <Typography
          align="center"
          label="Online Security Tips"
          variant="h3"
          color={FWDColors.orange}
        />
      </View>

      <View
        style={{
          marginTop: spacer(24),
        }}>
        {tipList.map((tip, index) => (
          <View
            key={index}
            style={[
              layoutStyles.row,
              {
                marginTop: spacer(index > 0 ? 24 : 0),
              },
            ]}>
            <View
              style={{
                marginRight: spacer(4),
              }}>
              <Typography label={'\u2022'} />
            </View>
            <Typography
              label={tip}
              variant="l3-b"
              color={FWDColors.greenDarker}
            />
          </View>
        ))}
      </View>

      <View
        style={{
          marginTop: spacer(48),
          paddingHorizontal: spacer(24),
        }}>
        <Button label="Got it" onPress={onClose} />
      </View>
    </View>
  );
};
