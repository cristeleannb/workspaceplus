import React, {useMemo} from 'react';
import {View, Text} from 'react-native';

import {CheckCircle, FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';

export type ToastType = 'success' | 'fullwidth';

export interface ToastMessageProps {
  type: ToastType;
  label: string;
  isFullWidth?: boolean;
  rightIcon?: React.ReactElement;
}

export const ToastMessage = ({type, label, rightIcon}: ToastMessageProps) => {
  const color = useMemo(() => {
    let newColor = {
      fgColor: FWDColors.green,
      bgColor: FWDColors.green5,
    };

    switch (type) {
      case 'success':
        newColor.fgColor = FWDColors.green;
        newColor.bgColor = FWDColors.green5;
        break;

      case 'fullwidth':
        newColor.fgColor = FWDColors.white;
        newColor.bgColor = FWDColors.greenDarker;
    }

    return newColor;
  }, [type]);

  return (
    <View
      style={[
        layoutStyles.fullWidth,
        {
          paddingHorizontal: type === 'success' ? spacer(24) : spacer(0),
        },
      ]}>
      <View
        style={[
          layoutStyles.row,
          layoutStyles.startCenter,
          layoutStyles.betweenCenter,
          {
            paddingHorizontal: spacer(16),
            paddingVertical: type === 'success' ? spacer(12) : spacer(16),
            borderRadius: type === 'success' ? spacer(16) : spacer(0),
            borderBottomRightRadius: spacer(0),
            backgroundColor: color.bgColor,
          },
        ]}>
        <View
          style={[
            layoutStyles.row,
            layoutStyles.startCenter,
            layoutStyles.cover,
          ]}>
          <View
            style={{
              marginRight: spacer(12),
            }}>
            {type === 'success' ? (
              <CheckCircle width={24} height={24} color={color.fgColor} />
            ) : null}
          </View>
          <Text
            numberOfLines={1}
            style={[
              layoutStyles.row,
              layoutStyles.cover,
              {marginLeft: spacer(8)},
            ]}>
            <Typography
              label={label}
              variant={type === 'fullwidth' ? 'h1' : 'l2-b'}
              color={color.fgColor}
            />
          </Text>
        </View>
        <View style={{marginLeft: spacer(16)}}>{rightIcon}</View>
      </View>
    </View>
  );
};
