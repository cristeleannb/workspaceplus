import React, {useMemo, useState} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {layoutStyles, spacer} from '@/utils';

export const useScroll = () => {
  const insets = useSafeAreaInsets();
  const [headerOffset, setHeaderOffset] = useState(0);

  const animationTop = useSharedValue(-48);
  const animationBottom = useSharedValue(-48);
  const animatedScrollviewStyle = useAnimatedStyle(() => ({
    top: animationTop.value,
    marginBottom: animationBottom.value,
  }));

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    let offsetY: number = event.nativeEvent.contentOffset.y;
    offsetY = offsetY >= 24 ? 24 : offsetY;
    offsetY = offsetY <= 0 ? 0 : offsetY;
    setHeaderOffset(offsetY);

    const newTop = offsetY === 0 ? -48 : 0;
    const newBottom = offsetY === 0 ? -48 : 0;
    const duration = offsetY === 0 ? 200 : 0;
    animationTop.value = withTiming(newTop, {duration: duration});
    animationBottom.value = withTiming(newBottom, {duration: duration});
  };

  const AnimatedScrollView = useMemo(() => {
    return ({children}: {children: React.ReactNode}) => (
      <Animated.ScrollView
        nestedScrollEnabled={true}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={[
          animatedScrollviewStyle,
          layoutStyles.cover,
          {
            paddingTop: spacer(0),
          },
        ]}>
        <View
          style={{
            paddingBottom: spacer(insets.bottom),
          }}>
          {children}
        </View>
      </Animated.ScrollView>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const collapsedHeader = useMemo(() => {
    return headerOffset > 0;
  }, [headerOffset]);

  return {AnimatedScrollView, collapsedHeader};
};
