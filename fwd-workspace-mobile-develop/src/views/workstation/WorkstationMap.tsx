import React, {memo, useEffect, createRef} from 'react';
import {Dimensions, Platform, View} from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import WorkstationMapFull from '../maps/WorkstationMapFull';

import {layoutStyles} from '@/utils';
import {
  DivisionEntity,
  WorkstationListResponse,
} from '@/services/api/api.service';

import {getCoordinatesById} from '../maps/division.config';
import {
  WorkSeats,
  getSeatCodeByID,
  getWSCoordinatesBySeat,
} from '../maps/workseat.config';

export type WSArea = 'ceo' | 'ops' | 'it';

const {width: screenWidth} = Dimensions.get('window');
const multiplier = Platform.OS === 'ios' ? 0.01 : 10;

interface WorkStationDimension {
  width: number;
  aspectRatio: number;
}

/**
 * WS full map dimensions
 * w - 1623
 * h - 2315
 */
const fullDimension: WorkStationDimension = {
  width: 1623,
  aspectRatio: 1623 / 2315,
};

type StartXY = {
  startX: number;
  startY: number;
};

const scaleLimit = {
  min: 0.4,
  max: 1.0,
};

interface WorkstationMapProps {
  viewOnly?: boolean;
  initialSelected?: string;
  selectedDivisionId?: number;
  divisionList?: DivisionEntity[];
  workstationList?: WorkstationListResponse;
  isZoomed?: boolean;
  onPressWorkstation: (
    workstationId?: string,
    seatCode?: string,
    divisionName?: string,
  ) => void;
  onPressDivision: (division: DivisionEntity) => void;
  onZoomChange?: (zoom: boolean) => void;
}

export const WorkstationMap = memo((props: WorkstationMapProps) => {
  const {
    initialSelected,
    selectedDivisionId,
    divisionList,
    workstationList,
    onPressWorkstation,
    viewOnly = false,
  } = props;

  const pinchRef = createRef();
  const panRef = createRef();

  const containerHeight = useSharedValue(0);

  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const handlePinch = (e: GestureEvent<PinchGestureHandlerEventPayload>) => {
    focalX.value = e.nativeEvent.focalX;
    focalY.value = e.nativeEvent.focalY;

    if (scale.value <= scaleLimit.max && scale.value >= scaleLimit.min) {
      const tempScale = scale.value + e.nativeEvent.velocity * multiplier;

      if (tempScale > scaleLimit.max) {
        scale.value = scaleLimit.max;
      } else if (tempScale < scaleLimit.min) {
        scale.value = scaleLimit.min;
      } else {
        scale.value = tempScale;
      }
    }
  };

  const fullX = useSharedValue(0);
  const fullY = useSharedValue(0);
  const fullElementWidth = useSharedValue(1200);
  const fullElementHeight = useSharedValue(0);

  const fullGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    StartXY
  >({
    onStart: (_, ctx) => {
      ctx.startX = fullX.value;
      ctx.startY = fullY.value;
    },
    onActive: (event, ctx) => {
      const newX = ctx.startX + event.translationX;
      const scaledX = newX * scale.value;
      const xRatioOffset =
        (scale.value * fullElementWidth.value - screenWidth) / 2;

      if (Math.abs(scaledX) < xRatioOffset) {
        fullX.value = newX;
      } else {
        if (Math.sign(newX) > 0) {
          fullX.value = xRatioOffset / scale.value;
        } else if (Math.sign(newX) < 0) {
          fullX.value = -xRatioOffset / scale.value;
        }
      }

      const newY = ctx.startY + event.translationY;
      const scaledY = newY * scale.value;
      const yRatioOffset =
        (scale.value * fullElementHeight.value - containerHeight.value) / 2;

      if (Math.abs(scaledY) < yRatioOffset) {
        fullY.value = newY;
      } else {
        if (Math.sign(newY) > 0) {
          fullY.value = yRatioOffset / scale.value;
        } else if (Math.sign(newY) < 0) {
          fullY.value = -yRatioOffset / scale.value;
        }
      }
    },
  });

  const fullAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: scale.value},
        {translateX: fullX.value},
        {translateY: fullY.value},
      ],
    };
  });

  useEffect(() => {
    setTimeout(() => {
      const {x, y} = getCoordinatesById(selectedDivisionId || 0);

      scale.value = 1;
      fullX.value = x * ((fullElementWidth.value - screenWidth) / 2);
      fullY.value = y * ((fullElementHeight.value - containerHeight.value) / 2);
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDivisionId]);

  useEffect(() => {
    if (initialSelected) {
      let x = 0;
      let y = 0;

      const seatCode = getSeatCodeByID(
        workstationList,
        initialSelected,
      ) as WorkSeats;

      const wsCoordinates = getWSCoordinatesBySeat(seatCode);

      if (wsCoordinates) {
        x = wsCoordinates.x;
        y = wsCoordinates.y;
      }

      // add a little delay
      setTimeout(() => {
        scale.value = 1;
        fullX.value = x * ((fullElementWidth.value - screenWidth) / 2);
        fullY.value =
          y * ((fullElementHeight.value - containerHeight.value) / 2);
      }, 500);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelected, workstationList]);

  return (
    <GestureHandlerRootView style={[layoutStyles.cover]}>
      <PinchGestureHandler
        onGestureEvent={handlePinch}
        ref={pinchRef}
        simultaneousHandlers={panRef}>
        <View
          onLayout={e => {
            containerHeight.value = e.nativeEvent.layout.height;
          }}
          style={[layoutStyles.centerCenter, layoutStyles.cover]}>
          <PanGestureHandler
            onGestureEvent={fullGestureHandler}
            ref={panRef}
            simultaneousHandlers={pinchRef}>
            <Animated.View
              style={[
                fullAnimatedStyle,
                {
                  width: fullElementWidth.value,
                  aspectRatio: fullDimension.aspectRatio,
                },
              ]}
              onLayout={e => {
                fullElementWidth.value = e.nativeEvent.layout.width;
                fullElementHeight.value = e.nativeEvent.layout.height;
              }}>
              <WorkstationMapFull
                viewOnly={viewOnly}
                initialSelected={initialSelected}
                divisionList={divisionList}
                workstationList={workstationList}
                onPressWorkstation={onPressWorkstation}
              />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
});
