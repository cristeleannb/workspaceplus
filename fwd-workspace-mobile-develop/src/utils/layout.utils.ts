import {StyleSheet} from 'react-native';

export const layoutStyles = StyleSheet.create({
  cover: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flexDirection: 'column',
  },
  absolute: {
    position: 'absolute',
  },
  relative: {
    position: 'relative',
  },
  startStart: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  startCenter: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  startEnd: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  centerStart: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerEnd: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  endStart: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  endCenter: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  endEnd: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  betweenStart: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  betweenCenter: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  betweenEnd: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  aroundStart: {
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  aroundCenter: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  aroundEnd: {
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  alignSelfEnd: {
    alignSelf: 'flex-end',
  },
  alignSelfStretch: {
    alignSelf: 'stretch',
  },
  textCenter: {
    textAlign: 'center',
  },
  grow: {
    flexGrow: 1,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
});

// const {width: SCREEN_WIDTH} = Dimensions.get('window');

// const platformWidth = Platform.select({
//   android: 375,
//   ios: 360,
// });

// const scale = SCREEN_WIDTH / (platformWidth || 360);
const multiplier = 1;

// const normalize = (size: number) => {
//   const newSize = size * scale;
//   return Math.round(PixelRatio.roundToNearestPixel(newSize));
// };

export const spacer = (space: number) => {
  return space * multiplier;
};
