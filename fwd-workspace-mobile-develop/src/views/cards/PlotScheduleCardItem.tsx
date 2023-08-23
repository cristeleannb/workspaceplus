import React, {useRef} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated';
import {useDebounce} from 'rooks';

import {FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';

import {ScheduleKey} from '..';

export interface PlotScheduleCardItemData {
  key: ScheduleKey;
  defaultLabel: string;
  labelInactive: string;
  labelActive: string;
  icon: React.ReactElement<SvgProps>;
  bgColor: string;
  borderColor: string;
  limit: React.ReactElement;
}

interface PlotScheduleCardItemProps {
  selectedKey: ScheduleKey;
  index: number;
  item: PlotScheduleCardItemData;
  remainingCredits?: number;
  onCardPress?: (key: ScheduleKey) => void;
}

export const PlotScheduleCardItem = ({
  selectedKey,
  index,
  item,
  remainingCredits,
  onCardPress,
}: PlotScheduleCardItemProps) => {
  const ref = useRef<TransitioningView>(null);
  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={500} />
      <Transition.Change interpolation="linear" />
      <Transition.Out type="fade" durationMs={500} />
    </Transition.Together>
  );

  const cardPressDebounce = useDebounce((key: ScheduleKey) => {
    onCardPress?.(key);
    ref.current?.animateNextTransition();
  }, 600);

  return (
    <Transitioning.View
      ref={ref}
      transition={transition}
      style={[
        item.key && selectedKey !== item.key
          ? layoutStyles.centerCenter
          : layoutStyles.startStart,
        {
          marginLeft: index > 0 ? spacer(12) : spacer(0),
          backgroundColor: item.bgColor,
          borderRadius: spacer(8),
          borderWidth: spacer(1.5),
          borderColor:
            item.key === selectedKey ? item.borderColor : FWDColors.transparent,
          opacity: !selectedKey
            ? spacer(1)
            : selectedKey && item.key === 3 && selectedKey === 3
            ? spacer(1)
            : selectedKey &&
              remainingCredits &&
              selectedKey === item.key &&
              remainingCredits === 0
            ? spacer(0.7)
            : selectedKey &&
              remainingCredits &&
              selectedKey === item.key &&
              remainingCredits !== 0
            ? 1
            : selectedKey !== item.key
            ? spacer(0.5)
            : spacer(0.7),
          flex: spacer(!selectedKey || selectedKey === item.key ? 1 : -1),
          minHeight: spacer(44),
          paddingVertical: !selectedKey
            ? spacer(0)
            : selectedKey && item.key === selectedKey
            ? spacer(2)
            : spacer(0),
        },
      ]}>
      <TouchableOpacity
        key={item.key}
        activeOpacity={0.75}
        onPress={() => cardPressDebounce(item.key)}
        style={[
          layoutStyles.row,
          layoutStyles.startStart,
          {
            paddingVertical: spacer(6),
            paddingHorizontal: spacer(8),
          },
        ]}>
        <View
          style={{
            marginRight: spacer(4),
          }}>
          {item.icon}
        </View>

        <View
          style={{
            flex: spacer(!selectedKey || selectedKey === item.key ? 1 : -1),
          }}>
          <Typography
            label={
              !selectedKey
                ? item.defaultLabel
                : selectedKey !== item.key
                ? item.labelInactive
                : item.labelActive
            }
            color={FWDColors.greenDarker}
            variant="l3-m"
          />

          {selectedKey && selectedKey === item.key && item.limit}
        </View>
      </TouchableOpacity>
    </Transitioning.View>
  );
};
