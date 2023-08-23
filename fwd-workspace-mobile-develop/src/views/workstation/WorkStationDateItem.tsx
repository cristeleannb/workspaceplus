import React, {memo, useMemo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {format} from 'date-fns';

import {
  FWDColors,
  Typography,
  Check,
  Add,
  ShadowView,
  Close,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';

interface WorkStationDateItemProps {
  date: Date;
  selected?: boolean;
  viewOnly?: boolean;
  onPress?: () => void;
  onSelect?: () => void;
  onUnselect?: () => void;
  onChangeTime?: () => void;
}

export const WorkStationDateItem = memo((props: WorkStationDateItemProps) => {
  const {
    date,
    selected = false,
    viewOnly = false,
    onChangeTime,
    onUnselect,
  } = props;

  const styles = useMemo(() => {
    if (selected) {
      return {
        primary: FWDColors.greenDarker,
        contrast: FWDColors.white,
      };
    } else {
      return {
        primary: FWDColors.white,
        contrast: FWDColors.greenDarker,
      };
    }
  }, [selected]);

  const icon = useMemo(() => {
    if (selected) {
      return <Check height={16} width={16} color={FWDColors.greenDarker} />;
    } else {
      return <Add height={16} width={16} color={FWDColors.white} />;
    }
  }, [selected]);

  const label = useMemo(() => {
    if (selected) {
      return format(new Date(date), 'EEE, d MMM, h aa');
    } else {
      return format(new Date(date), 'EEE, d MMM');
    }
  }, [date, selected]);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onChangeTime}
      style={[layoutStyles.row]}>
      <ShadowView
        style={[
          layoutStyles.row,
          layoutStyles.startCenter,
          {
            padding: spacer(8),
            borderRadius: spacer(8),
            backgroundColor: styles.primary,
            marginRight: spacer(10),
          },
        ]}>
        <View
          style={[
            layoutStyles.centerCenter,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              height: 24,
              width: 24,
              backgroundColor: styles.contrast,
              borderRadius: 999,
              marginRight: spacer(10),
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => !selected && onChangeTime?.()}>
            {icon}
          </TouchableOpacity>
        </View>

        <Typography label={label} variant="b4-b" color={styles.contrast} />

        {!viewOnly && selected && (
          <View
            style={[
              {
                marginLeft: spacer(12),
                marginRight: spacer(2),
              },
            ]}>
            <TouchableOpacity activeOpacity={0.75} onPress={onUnselect}>
              <Close color={FWDColors.white} width={16} height={16} />
            </TouchableOpacity>
          </View>
        )}
      </ShadowView>
    </TouchableOpacity>
  );
});
