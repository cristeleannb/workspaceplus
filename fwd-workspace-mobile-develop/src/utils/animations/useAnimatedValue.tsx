import {Animated} from 'react-native';
import useLazyRef from './useLazyRef';

type AnimationTimingConfig = Omit<
  Animated.TimingAnimationConfig,
  'useNativeDriver'
>;
interface AnimatedValue {
  value: Animated.Value;
  startTiming: (config: AnimationTimingConfig) => void;
}

export const useAnimatedValue = (initialValue: number): AnimatedValue => {
  const {current: value} = useLazyRef(() => new Animated.Value(initialValue));

  const startTiming = (config: AnimationTimingConfig) => {
    const {duration = 200, ...others} = config;

    Animated.timing(value, {
      ...others,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return {
    value,
    startTiming,
  };
};
