import React, {memo, useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';

import ParkingBasement1 from '../maps/ParkingBasement1';
import ParkingBasement2 from '../maps/ParkingBasement2';

import {layoutStyles} from '@/utils';
import {ParkingSlotListResponse} from '@/services/api/api.service';
import {
  getParkingCodeByID,
  getPSCoordinatesBySlot,
  ParkingSlots,
} from '../maps/parkingslot.config';

interface ParkingMapProps {
  parkingFloor?: number;
  viewOnly?: boolean;
  initialSelected?: string;
  parkingSlotList?: ParkingSlotListResponse;
  onPressParkingSlot: (
    parkingSlotId?: string,
    parkingCode?: string,
    parkingFloor?: number,
  ) => void;
}

interface ParkingSlotDimension {
  width: number;
  aspectRatio: number;
}

const {width: screenWidth} = Dimensions.get('window');

/**
 * WS base map dimensions
 * w - 375
 * h - 548
 */
const baseDimension: ParkingSlotDimension = {
  width: screenWidth,
  aspectRatio: 375 / 548,
};

export const ParkingMap = memo((props: ParkingMapProps) => {
  const [showMap, setShowMap] = useState(false);

  const {
    viewOnly = false,
    initialSelected,
    parkingSlotList,
    parkingFloor,
    onPressParkingSlot,
  } = props;

  const containerHeight = useSharedValue(0);

  const baseX = useSharedValue(0);
  const baseY = useSharedValue(0);
  const baseElementWidth = useSharedValue(0);
  const baseElementHeight = useSharedValue(0);

  const baseMapCoordinates = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: baseX.value},
        {translateY: baseY.value},
        {scale: 1},
      ],
    };
  });

  useEffect(() => {
    if (initialSelected) {
      let x = 0;
      let y = 0;

      const seatCode = getParkingCodeByID(
        parkingSlotList,
        initialSelected,
      ) as ParkingSlots;

      const psCoordinates = getPSCoordinatesBySlot(seatCode);

      if (psCoordinates) {
        x = psCoordinates.x;
        y = psCoordinates.y;
      }

      // add a little delay
      setTimeout(() => {
        baseX.value = x;
        baseY.value = y;
      }, 500);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelected, parkingSlotList]);

  return (
    <View
      onLayout={e => {
        containerHeight.value = e.nativeEvent.layout.height;
        setShowMap(true);
      }}
      style={[layoutStyles.cover]}>
      {showMap && (
        <ReactNativeZoomableView
          maxZoom={3}
          minZoom={1}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders={true}>
          <Animated.View
            style={[
              baseMapCoordinates,
              {
                width: baseDimension.width,
                aspectRatio: baseDimension.aspectRatio,
              },
            ]}
            onLayout={e => {
              baseElementWidth.value = e.nativeEvent.layout.width;
              baseElementHeight.value = e.nativeEvent.layout.height;
            }}>
            {parkingFloor === 1 && (
              <ParkingBasement1
                viewOnly={viewOnly}
                initialSelected={initialSelected}
                parkingSlotList={parkingSlotList}
                onPressParkingSlot={onPressParkingSlot}
              />
            )}

            {parkingFloor === 2 && (
              <ParkingBasement2
                viewOnly={viewOnly}
                initialSelected={initialSelected}
                parkingSlotList={parkingSlotList}
                onPressParkingSlot={onPressParkingSlot}
              />
            )}
          </Animated.View>
        </ReactNativeZoomableView>
      )}
    </View>
  );
});
