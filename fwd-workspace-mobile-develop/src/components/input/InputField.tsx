import React, {cloneElement, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated as RNAnimated,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  View,
  ViewStyle,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {SvgProps} from 'react-native-svg';

import {spacer} from '@/utils';
import {useAnimatedValue} from '@/utils/animations';

import {Typography} from '..';
import {FWDColors} from './../theme/Colors';

type InputFieldSize = 'default'; // To add -> expanded | dense
const InputFieldSizes: Record<InputFieldSize, number> = {
  default: 48,
};

type RNTextInputProps = React.ComponentProps<typeof TextInput>;

type InputFieldProps = {
  label: string;
  size?: InputFieldSize;
  error?: string;
  caption?: string;
  rightIcon?: React.ReactElement<SvgProps>;
  onRightIconPress?: () => void;
} & RNTextInputProps;

export const InputField = ({
  label = '',
  size = 'default',
  editable = true,
  error,
  caption,
  value,
  rightIcon,
  onRightIconPress,
  ...others
}: InputFieldProps) => {
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);

  const animatedLabelPosition = useAnimatedValue(4);
  const animatedLabelTextSize = useSharedValue(16);

  const onFocus = (ev: NativeSyntheticEvent<TextInputFocusEventData>) => {
    others.onFocus?.(ev);
    setFocused(true);
  };

  const onBlur = (ev: NativeSyntheticEvent<TextInputFocusEventData>) => {
    others.onBlur?.(ev);
    setFocused(false);
  };

  const animatedLabelStyle = useAnimatedStyle(() => ({
    fontSize: animatedLabelTextSize.value,
  }));

  const defaultContainerStyle = useMemo<ViewStyle>(() => {
    return {
      height: InputFieldSizes[size],
    };
  }, [size]);

  const labelColor = useMemo(() => {
    if (!editable) {
      return FWDColors.grey2;
    }
    if (focused) {
      if (error) {
        return FWDColors.red;
      } else {
        return FWDColors.orange;
      }
    }
    if (value) {
      return FWDColors.grey4;
    }
    return FWDColors.grey4;
  }, [value, focused, editable, error]);

  const borderColor = useMemo(() => {
    if (!editable) {
      return FWDColors.grey1;
    }
    if (error) {
      return FWDColors.red;
    }
    if (focused) {
      return FWDColors.orange;
    }
    if (value) {
      return FWDColors.grey4;
    }
    return FWDColors.grey1;
  }, [value, focused, editable, error]);

  const generateRightIcon = useMemo(() => {
    if (rightIcon) {
      return cloneElement<SvgProps>(rightIcon, {
        width: 24,
        height: 24,
      });
    } else {
      return <></>;
    }
  }, [rightIcon]);

  const onChangeText = (newValue: string) => {
    setInputValue(newValue);
    others.onChangeText?.(newValue);
  };

  useEffect(() => {
    const labelPosition = focused || inputValue ? 4 : InputFieldSizes[size] / 4;
    const labelFontSize = focused || inputValue ? 13 : 16;
    animatedLabelPosition.startTiming({toValue: labelPosition});
    animatedLabelTextSize.value = withTiming(labelFontSize, {duration: 200});
  }, [focused, inputValue, size, animatedLabelPosition, animatedLabelTextSize]);

  return (
    <>
      <View
        style={[
          defaultContainerStyle,
          styles.inputContainer,
          {
            borderColor: borderColor,
            backgroundColor: FWDColors.white,
            height: spacer(48),
          },
        ]}>
        <RNAnimated.View
          style={[
            styles.inputLabel,
            {
              transform: [
                {
                  translateY: animatedLabelPosition.value,
                },
              ],
            },
          ]}>
          <Animated.Text
            {...(!editable && {
              onPress: () => inputRef?.current?.focus?.(),
            })}
            style={[
              animatedLabelStyle,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                color: labelColor,
                fontFamily: 'FWDCircularTT-Book',
                fontSize: spacer(16),
              },
            ]}>
            {label}
          </Animated.Text>
        </RNAnimated.View>

        <TextInput
          ref={inputRef}
          {...others}
          value={value}
          editable={editable}
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeText={onChangeText}
          placeholder={!!label && !focused ? '' : others.placeholder}
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              color: FWDColors.greenDarker,
              paddingTop: InputFieldSizes[size] / spacer(2.5),
              fontFamily: 'FWDCircularTT-Medium',
              fontSize: spacer(14),
            },
          ]}
        />

        {rightIcon && (
          <TouchableOpacity activeOpacity={0.75} onPress={onRightIconPress}>
            <View style={styles.rightIconContainer}>{generateRightIcon}</View>
          </TouchableOpacity>
        )}
      </View>

      {(caption || error) && (
        <View style={styles.errorCaption}>
          {error ? (
            <Typography label={error} variant="l2-b" color={FWDColors.red} />
          ) : caption ? (
            <Typography
              label={caption}
              variant="l2-b"
              color={FWDColors.grey4}
            />
          ) : (
            <></>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    borderColor: 'gray',
    flexDirection: 'row',
  },
  inputLabel: {
    flex: 1,
    paddingHorizontal: 12,
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    paddingHorizontal: 0,
    paddingBottom: 4,
    zIndex: 2,
  },
  errorCaption: {
    marginTop: 4,
  },
  rightIconContainer: {
    height: '100%',
    marginLeft: 8,
    justifyContent: 'center',
  },
});
