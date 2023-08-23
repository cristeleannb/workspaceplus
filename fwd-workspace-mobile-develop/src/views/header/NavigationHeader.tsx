import React, {useEffect} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {layoutStyles, spacer} from '@/utils';
import {FWDColors} from '@/components';

interface NavigationHeaderProps {
  title?: React.ReactElement;
  titleStyles?: StyleProp<ViewStyle>;
  leftAction?: React.ReactElement;
  rightAction?: React.ReactElement;
  height?: number;
  collapsed?: boolean;
  collapsedHeight?: number;
  bgColor?: string;
  flat?: boolean;
}

export const NavigationHeader = ({
  height = 96,
  bgColor = FWDColors.orange,
  title,
  titleStyles,
  leftAction,
  rightAction,
  flat,
  collapsed = false,
  collapsedHeight = 96,
}: NavigationHeaderProps) => {
  const animationHeight = useSharedValue(height);

  const animatedHeightStyle = useAnimatedStyle(() => ({
    height: animationHeight.value,
  }));

  useEffect(() => {
    let newHeight = collapsed ? collapsedHeight : height;
    animationHeight.value = withTiming(newHeight, {duration: 200});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, collapsed, collapsedHeight]);

  return (
    <Animated.View
      style={[
        animatedHeightStyle,
        layoutStyles.overflowHidden,
        {
          backgroundColor: bgColor,
          borderBottomLeftRadius: flat ? spacer(0) : spacer(24),
          paddingHorizontal: spacer(16),
          paddingVertical: spacer(12),
        },
      ]}>
      <View style={[layoutStyles.row, layoutStyles.betweenCenter]}>
        {title && (
          <View
            style={[
              layoutStyles.absolute,
              layoutStyles.row,
              layoutStyles.centerCenter,
              {
                left: spacer(0),
                right: spacer(0),
              },
              titleStyles,
            ]}>
            {title}
          </View>
        )}

        <View>{leftAction}</View>
        <View>{rightAction}</View>
      </View>
    </Animated.View>
  );
};
