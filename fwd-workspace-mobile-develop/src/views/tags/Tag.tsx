import React from 'react';
import {Dimensions, View} from 'react-native';

import {FWDColors, Typography} from '@/components';
import {Close} from '@/components/icons';
import {layoutStyles, spacer} from '@/utils';
import {TouchableOpacity} from 'react-native-gesture-handler';

const {width} = Dimensions.get('window');

interface TagProps {
  value: string;
  onRemove?: () => void;
}

export const Tag = ({value, onRemove}: TagProps) => {
  return (
    <View
      style={[
        layoutStyles.row,
        layoutStyles.startCenter,
        layoutStyles.alignSelfStart,
        {
          borderRadius: spacer(4),
          padding: spacer(8),
          backgroundColor: FWDColors.greenDarker,
        },
      ]}>
      <Typography
        style={[{maxWidth: spacer(width - 64)}]}
        label={value}
        variant="l1-m"
        color={FWDColors.white}
      />
      <TouchableOpacity
        style={{marginLeft: spacer(16), minWidth: spacer(16)}}
        onPress={onRemove}>
        <Close width={16} height={16} color={FWDColors.white} />
      </TouchableOpacity>
    </View>
  );
};
