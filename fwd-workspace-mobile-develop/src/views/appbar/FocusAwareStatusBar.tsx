import React from 'react';
import {StatusBar, StatusBarProps} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {FWDColors} from '@/components';

type FocusAwareStatusBarVariant = 'default';
const FocusAwareStatusBarVariants: Record<FocusAwareStatusBarVariant, string> =
  {
    default: FWDColors.orange,
  };

type FocusAwareStatusBarProps = {
  variant?: FocusAwareStatusBarVariant;
} & StatusBarProps;

export const FocusAwareStatusBar = ({
  variant = 'default',
  ...others
}: FocusAwareStatusBarProps) => {
  const isFocused = useIsFocused();

  return isFocused ? (
    <StatusBar
      {...others}
      translucent
      backgroundColor={FocusAwareStatusBarVariants[variant]}
    />
  ) : null;
};
