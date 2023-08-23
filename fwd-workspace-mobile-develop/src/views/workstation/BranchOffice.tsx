import React, {
  memo,
  ReactNode,
  ReactText,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {StyleProp, View, ViewStyle, TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  FWDColors,
  Typography,
  AngleDownThin,
  Navigation,
  Time,
  Phone,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';

interface OfficeDetailProps {
  icon: ReactNode;
  text: ReactText;
}

const OfficeDetail = memo(({icon, text}: OfficeDetailProps) => {
  return (
    <View style={[layoutStyles.row, {marginTop: spacer(8)}]}>
      <View
        style={[
          layoutStyles.centerCenter,
          layoutStyles.startStart,
          {
            marginRight: spacer(8),
          },
        ]}>
        {icon}
      </View>

      <View style={[layoutStyles.cover]}>
        <Typography label={text} variant="l2-b" color={FWDColors.greenDarker} />
      </View>
    </View>
  );
});

interface BranchOfficeProps {
  selected?: boolean;
  disabled?: boolean;
  branchPrefix?: string;
  branchName: string;
  branchAddress: string;
  branchOfficeHours: string;
  branchContactNumber: string;
  showInitial?: boolean;
  onPress?: () => void;
}

export const BranchOffice = memo(
  ({
    selected,
    disabled,
    branchPrefix = '--',
    branchName,
    branchAddress,
    branchOfficeHours,
    branchContactNumber,
    showInitial = false,
    onPress,
  }: BranchOfficeProps) => {
    const [showDetails, setShowDetails] = useState(showInitial);

    const angleDownRotateZ = useSharedValue(showDetails ? 180 : 0);
    const angleDownTransitionStyle = useAnimatedStyle(() => ({
      transform: [{rotateZ: `-${angleDownRotateZ.value}deg`}],
    }));

    const maxHeight = useSharedValue(showDetails ? 1000 : 0);
    const maxHeightTransitionStyle = useAnimatedStyle(() => ({
      maxHeight: maxHeight.value,
    }));

    useEffect(() => {
      const degree = showDetails ? 180 : 0;
      angleDownRotateZ.value = withTiming(degree);

      const height = showDetails ? 1000 : 0;
      maxHeight.value = withTiming(height);
    }, [showDetails, angleDownRotateZ, maxHeight]);

    const containerStyle = useMemo(() => {
      let styles: StyleProp<ViewStyle>;

      if (disabled) {
        styles = {
          borderColor: FWDColors.greyLight,
          backgroundColor: FWDColors.greyLight,
        };
      } else {
        if (selected) {
          styles = {
            borderColor: FWDColors.orange,
          };
        } else {
          styles = {
            borderColor: FWDColors.grey1,
          };
        }
      }

      return styles;
    }, [disabled, selected]);

    const textColor = useMemo(() => {
      if (disabled) {
        return FWDColors.grey3;
      } else {
        return FWDColors.greenDarker;
      }
    }, [disabled]);

    return (
      <View
        style={[
          {
            marginBottom: spacer(24),
          },
        ]}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.75}
          disabled={disabled}
          style={[
            {
              padding: spacer(16),
              borderRadius: spacer(8),
              borderWidth: spacer(1),
            },
            containerStyle,
          ]}>
          <View
            style={[
              layoutStyles.row,
              layoutStyles.betweenStart,
              {marginBottom: spacer(4)},
            ]}>
            <View style={[layoutStyles.cover]}>
              <Typography label={branchPrefix} variant="h2" color={textColor} />
            </View>
          </View>

          <Typography label={branchName} variant="l2-b" color={textColor} />

          <Animated.View
            style={[maxHeightTransitionStyle, layoutStyles.overflowHidden]}>
            <View
              style={{
                marginTop: spacer(8),
                borderTopWidth: spacer(1),
                borderTopColor: FWDColors.lightblue,
              }}
            />

            <OfficeDetail
              text={branchAddress}
              icon={
                <Navigation height={20} width={20} color={FWDColors.orange} />
              }
            />

            <OfficeDetail
              text={branchOfficeHours}
              icon={<Time height={20} width={20} color={FWDColors.orange} />}
            />

            <OfficeDetail
              text={branchContactNumber}
              icon={<Phone height={20} width={20} color={FWDColors.orange} />}
            />
          </Animated.View>

          <TouchableOpacity
            style={[
              layoutStyles.row,
              layoutStyles.startCenter,
              {marginTop: spacer(8)},
            ]}
            disabled={disabled}
            activeOpacity={0.75}
            onPress={() => setShowDetails(v => !v)}>
            <Typography
              label={`${showDetails ? 'Hide' : 'Show'} Details`}
              variant="l3-m"
              color={FWDColors.orange}
            />

            <Animated.View
              style={[
                angleDownTransitionStyle,
                layoutStyles.centerCenter,
                {
                  marginRight: spacer(4),
                  padding: spacer(2),
                },
              ]}>
              <AngleDownThin height={14} width={14} color={FWDColors.orange} />
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  },
);
