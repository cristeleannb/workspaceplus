import React, {useEffect, useRef} from 'react';
import {Animated, Easing, View} from 'react-native';
import {SvgProps} from 'react-native-svg';

import {layoutStyles, spacer} from '@/utils';
import {FWDColors, Typography} from '@/components';
import {ScheduleKey} from '..';

export interface WMDivisionBarGraphItemData {
  key: ScheduleKey;
  defaultLabel: string;
  icon: React.ReactElement<SvgProps>;
  bgColor: string;
  count: number;
  max?: number;
}

const WMDivisionBarGraphItemView = (props: WMDivisionBarGraphItemData) => {
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: (props.count / (props.max || 0)) * 100,
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.count, props.max]);

  return (
    <View style={[layoutStyles.row, layoutStyles.startCenter]}>
      <View style={[layoutStyles.centerCenter]}>
        {props.icon}
        <Typography
          label={props.defaultLabel}
          variant="l3-m"
          color={FWDColors.greenDark}
        />
      </View>
      <Animated.View
        style={[
          layoutStyles.cover,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            height: spacer(76),
            borderRadius: spacer(4),
            marginLeft: spacer(8),
            backgroundColor: props.bgColor,
            maxWidth: props.count
              ? translation.interpolate({
                  inputRange: [0, (props.count / (props.max || 0)) * 100],
                  outputRange: [
                    '0%',
                    `${(props.count / (props.max || 0)) * 100}%`,
                  ],
                })
              : '0%',
          },
        ]}
      />
      <View
        style={{
          marginLeft: spacer(8),
        }}>
        <Typography
          label={props.count}
          variant="h5"
          color={FWDColors.greenDark}
        />
      </View>
    </View>
  );
};

export default WMDivisionBarGraphItemView;
