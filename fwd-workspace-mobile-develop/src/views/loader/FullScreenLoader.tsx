import React from 'react';
import {View} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';

import {FWDColors} from '@/components';
import {layoutStyles, spacer} from '@/utils';

export const FullScreenLoader = () => {
  return (
    <View
      style={[
        layoutStyles.cover,
        layoutStyles.centerCenter,
        {
          backgroundColor: FWDColors.orange,
        },
      ]}>
      <AnimatedLottieView
        source={require('@/assets/animations/screen-loader.json')}
        autoPlay
        loop
        style={{
          height: spacer(640),
        }}
      />
    </View>
  );
};
