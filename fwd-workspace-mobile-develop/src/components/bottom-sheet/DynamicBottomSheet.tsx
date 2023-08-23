import React, {forwardRef, useCallback, useMemo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  BottomSheetHandleProps,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Drawer, FWDColors} from '@/components';
import {layoutStyles} from '@/utils';

interface HandleProps extends BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>;
}

const customHandle: React.FC<HandleProps> = _ => {
  return (
    <View style={layoutStyles.centerCenter}>
      <Drawer width={40} height={40} color={FWDColors.grey2} />
    </View>
  );
};

type DynamicBottomSheetProps = Pick<BottomSheetProps, 'onClose'> & {
  children: React.ReactNode;
};

export const DynamicBottomSheet = forwardRef<
  BottomSheet,
  DynamicBottomSheetProps
>(({children, onClose}, ref) => {
  const initialSnapPoints = useMemo(() => [1, 'CONTENT_HEIGHT'], []);
  const {bottom: safeBottomArea} = useSafeAreaInsets();
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const contentContainerStyle = useMemo(
    () => [styles.contentContainerStyle, {paddingBottom: safeBottomArea || 6}],
    [safeBottomArea],
  );

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        disappearsOnIndex={0}
        appearsOnIndex={1}
        {...props}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={ref}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      animateOnMount={true}
      handleComponent={customHandle}
      index={-1}
      onClose={onClose}>
      <BottomSheetView
        style={contentContainerStyle}
        onLayout={handleContentLayout}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: 12,
    paddingBottom: 6,
    paddingHorizontal: 24,
  },
});
