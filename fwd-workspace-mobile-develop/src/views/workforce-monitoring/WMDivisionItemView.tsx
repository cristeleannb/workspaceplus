import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Easing, LayoutChangeEvent, View} from 'react-native';

import {layoutStyles, spacer} from '@/utils';
import {FWDColors, Typography} from '@/components';

export interface WMDivisionItemViewData {
  name: string;
  wfaCount: number;
  wfoCount: number;
  wfbCount: number;
}

const WMDivisionItemView = (props: WMDivisionItemViewData) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const onContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const barWidth = useMemo(() => {
    const wfaCount = props.wfaCount || 0;
    const wfoCount = props.wfoCount || 0;
    const wfbCount = props.wfbCount || 0;

    const totalCount = wfaCount + wfoCount + wfbCount;

    const wfaWidth = (wfaCount / totalCount) * containerWidth;
    const wfoWidth = (wfoCount / totalCount) * containerWidth;
    const wfbWidth = (wfbCount / totalCount) * containerWidth;

    return {
      wfaWidth,
      wfoWidth,
      wfbWidth,
    };
  }, [props.wfaCount, props.wfoCount, props.wfbCount, containerWidth]);

  return (
    <View style={[layoutStyles.cover]} onLayout={onContainerLayout}>
      <Typography
        label={props.name}
        variant="l2-m"
        color={FWDColors.greenDark}
      />
      <View
        style={[
          layoutStyles.row,
          layoutStyles.overflowHidden,
          {
            height: spacer(40),
            borderRadius: spacer(8),
            backgroundColor: FWDColors.greyLight,
            marginTop: spacer(8),
          },
        ]}>
        {containerWidth > 0 && (
          <>
            {barWidth.wfaWidth > 0 && (
              <WMDivisionBarItemView
                count={props.wfaCount}
                width={barWidth.wfaWidth}
                bgColor={FWDColors.orange70}
              />
            )}

            {barWidth.wfbWidth > 0 && (
              <WMDivisionBarItemView
                count={props.wfbCount}
                width={barWidth.wfbWidth}
                bgColor={FWDColors.yellow50}
              />
            )}

            {barWidth.wfoWidth > 0 && (
              <WMDivisionBarItemView
                count={props.wfoCount}
                width={barWidth.wfoWidth}
                bgColor={FWDColors.greenLight}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

interface WMDivisionBarItemView {
  count: number;
  width: number;
  bgColor: string;
}

const WMDivisionBarItemView = ({
  count,
  width,
  bgColor,
}: WMDivisionBarItemView) => {
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (width) {
      Animated.timing(translation, {
        toValue: width === undefined ? 0 : width,
        duration: 750,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const widthValue = useMemo(() => {
    return width === undefined
      ? 0
      : translation.interpolate({
          inputRange: [0, width],
          outputRange: [0, width === undefined ? 0 : width],
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <Animated.View
      style={[
        layoutStyles.centerCenter,
        {
          backgroundColor: bgColor,
          width: widthValue,
        },
      ]}>
      {count > 0 && (
        <Typography
          label={`${count}`}
          variant="l3-m"
          color={FWDColors.greenDark}
        />
      )}
    </Animated.View>
  );
};

export default WMDivisionItemView;
