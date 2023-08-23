import React, {useEffect, useRef} from 'react';
import {Animated, Easing, View} from 'react-native';

import {layoutStyles, spacer} from '@/utils';
import {FWDColors, ShadowView, Typography} from '@/components';

export interface WMBranchItemViewProps {
  branchName: string;
  count: number;
  max: number;
}

const WMBranchItemView = (props: WMBranchItemViewProps) => {
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: (props.count / props.max) * 100,
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.count, props.max]);

  return (
    <View>
      <ShadowView
        level={6}
        style={[
          layoutStyles.row,
          layoutStyles.betweenCenter,
          {
            borderRadius: spacer(8),
            paddingVertical: spacer(12),
            paddingHorizontal: spacer(16),
            backgroundColor: FWDColors.white,
          },
        ]}>
        <View
          style={[
            layoutStyles.cover,
            {
              marginRight: spacer(24),
            },
          ]}>
          <Typography
            label={props.branchName}
            variant="l2-m"
            color={FWDColors.greenDark}
          />
          <Animated.View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              height: spacer(9),
              borderRadius: spacer(4),
              backgroundColor: FWDColors.orange70,
              marginTop: spacer(8),
              maxWidth: props.count
                ? translation.interpolate({
                    inputRange: [0, (props.count / props.max) * 100],
                    outputRange: ['0%', `${(props.count / props.max) * 100}%`],
                  })
                : '0%',
            }}
          />
        </View>
        <View>
          <Typography
            label={`${props.count}`}
            variant="l3-m"
            color={FWDColors.greenDark}
          />
        </View>
      </ShadowView>
    </View>
  );
};

export default WMBranchItemView;
