import * as React from 'react';
import {Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {FWDColors} from '..';

type ShadowType = Pick<
  ViewStyle,
  | 'shadowColor'
  | 'shadowOffset'
  | 'shadowOpacity'
  | 'shadowRadius'
  | 'elevation'
>;

type DirectionType =
  | 'bottom'
  | 'top'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

const interpolate = (
  i: number,
  a: number,
  b: number,
  a2: number,
  b2: number,
) => {
  return ((i - a) * (b2 - a2)) / (b - a) + a2;
};

const adjustShadowOffsetOnDirection = (
  level: number,
  direction: DirectionType,
) => {
  const distance = Math.floor(level * 0.5);
  switch (direction) {
    case 'bottom':
      return {width: 0, height: distance};
    case 'top':
      return {width: 0, height: -distance};
    case 'left':
      return {width: -distance, height: 0};
    case 'right':
      return {width: distance, height: 0};
    case 'topLeft':
      return {width: -distance, height: -distance};
    case 'topRight':
      return {width: distance, height: -distance};
    case 'bottomLeft':
      return {width: -distance, height: distance};
    case 'bottomRight':
      return {width: -distance, height: distance};
    default:
      return {width: 0, height: distance};
  }
};

/**
 * @param {number} level Shadow level you want to set (default to 4)
 * @param {string} shadowColor Shadow color you want to set (default to Black)
 * @returns {ShadowType} a full shadow object that depends on OS (iOS or Android)
 */
const generateShadow = (params?: {
  level?: number;
  shadowColor?: string;
  direction?: DirectionType;
}): ShadowType => {
  const level = params?.level || 4;
  const shadowColor = params?.shadowColor || FWDColors.grey2;
  const direction = params?.direction || 'bottom';
  const shadowOffset = adjustShadowOffsetOnDirection(level, direction);
  const shadowOpacity = Number(interpolate(level, 1, 24, 0.2, 0.2).toFixed(2));
  const shadowRadius = Number(interpolate(level, 1, 38, 1, 16).toFixed(2));
  return (
    Platform.select({
      ios: {
        shadowColor,
        shadowOffset,
        shadowOpacity,
        shadowRadius,
      },
      android: {
        shadowColor,
        elevation: level,
      },
    }) || {
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
      elevation: level,
    }
  );
};

interface ShadowViewProps {
  level?: number;
  shadowColor?: string;
  direction?: DirectionType;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ShadowView = ({
  level,
  shadowColor,
  direction,
  children,
  style,
}: ShadowViewProps) => (
  <View
    style={[
      styles.shadowContainer,
      style,
      {
        ...generateShadow({level, shadowColor, direction}),
      },
    ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  shadowContainer: {
    backgroundColor: '#FFF',
  },
});

export {ShadowView, generateShadow};
