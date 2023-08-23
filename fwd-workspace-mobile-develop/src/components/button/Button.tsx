import React, {useEffect, useState, cloneElement, useMemo} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
} from 'react-native';
import {SvgProps} from 'react-native-svg';

import {Typography} from './../typography/Typography';
import {generateShadow} from '../shadow/ShadowView';
import {FWDColors} from './../theme/Colors';

type ButtonMode = 'contained' | 'outlined';

type TButtonSize = {
  btn: number;
  icon: number;
};
type ButtonSize = 'default' | 'small';
const ButtonSizes: Record<ButtonSize, TButtonSize> = {
  default: {
    btn: 48,
    icon: 24,
  },
  small: {
    btn: 32,
    icon: 16,
  },
};

type TButtonColor = {
  default: string;
  active: string;
};
type ButtonColor = 'primary' | 'light';
const ButtonColors: Record<ButtonColor, TButtonColor> = {
  primary: {
    default: FWDColors.orange,
    active: FWDColors.white,
  },
  light: {
    default: FWDColors.white,
    active: FWDColors.orange,
  },
};

type DefaultButtonProps = {
  label: string;
  mode?: ButtonMode;
  size?: ButtonSize;
  color?: ButtonColor;
  leftIcon?: React.ReactElement<SvgProps>;
  rightIcon?: React.ReactElement<SvgProps>;
  iconSize?: never;
  loading?: boolean;
  iconOnly?: false;
  icon?: never;
};

type IconButtonProps = {
  label?: never;
  mode?: never;
  size?: ButtonSize;
  color?: ButtonColor;
  leftIcon?: never;
  rightIcon?: never;
  iconSize?: number;
  loading?: never;
  iconOnly: true;
  icon: React.ReactElement<SvgProps>;
};

type ButtonProps = (DefaultButtonProps | IconButtonProps) &
  TouchableHighlightProps;

export const Button = ({
  size = 'default',
  mode = 'contained',
  color = 'primary',
  leftIcon,
  rightIcon,
  iconSize,
  loading,
  iconOnly,
  icon,
  ...others
}: ButtonProps) => {
  const [btnColors, setBtnColors] = useState<{
    bgColor?: string;
    borderColor?: string;
    underLayColor?: string;
    labelColor: {
      default?: string;
      active?: string;
    };
  }>({
    bgColor: undefined,
    borderColor: undefined,
    underLayColor: undefined,
    labelColor: {
      default: undefined,
      active: undefined,
    },
  });

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    switch (mode) {
      case 'contained':
        setBtnColors({
          bgColor: ButtonColors[color].default,
          borderColor: ButtonColors[color].active,
          underLayColor: ButtonColors[color].active,
          labelColor: {
            default: ButtonColors[color].active,
            active: ButtonColors[color].default,
          },
        });
        break;

      case 'outlined':
        setBtnColors({
          bgColor: ButtonColors[color].active,
          borderColor: ButtonColors[color].default,
          underLayColor: ButtonColors[color].default,
          labelColor: {
            default: ButtonColors[color].default,
            active: ButtonColors[color].active,
          },
        });
        break;

      default:
        setBtnColors({
          bgColor: ButtonColors[color].default,
          borderColor: ButtonColors[color].active,
          underLayColor: ButtonColors[color].active,
          labelColor: {
            default: ButtonColors[color].active,
            active: ButtonColors[color].default,
          },
        });
        break;
    }
  }, [mode, color]);

  const generateLeftIcon = useMemo(() => {
    if (leftIcon) {
      return cloneElement<SvgProps>(leftIcon, {
        width: ButtonSizes[size].icon,
        height: ButtonSizes[size].icon,
        color: !isActive
          ? btnColors.labelColor.default
          : btnColors.labelColor.active,
        style: styles.leftIcon,
      });
    } else {
      return <></>;
    }
  }, [leftIcon, isActive, btnColors, size]);

  const generateRightIcon = useMemo(() => {
    if (rightIcon) {
      return cloneElement<SvgProps>(rightIcon, {
        width: ButtonSizes[size].icon,
        height: ButtonSizes[size].icon,
        color: !isActive
          ? btnColors.labelColor.default
          : btnColors.labelColor.active,
        style: styles.rightIcon,
      });
    } else {
      return <></>;
    }
  }, [rightIcon, isActive, btnColors, size]);

  const generateIcon = useMemo(() => {
    if (icon) {
      return cloneElement<SvgProps>(icon, {
        width: iconSize ? iconSize : ButtonSizes[size].icon,
        height: iconSize ? iconSize : ButtonSizes[size].icon,
        color: !isActive
          ? btnColors.labelColor.default
          : btnColors.labelColor.active,
      });
    } else {
      return <></>;
    }
  }, [icon, isActive, btnColors, size, iconSize]);

  return (
    <>
      {!iconOnly ? (
        <TouchableHighlight
          {...others}
          onPressIn={() => !loading && setIsActive(true)}
          onPressOut={() => setIsActive(false)}
          underlayColor={btnColors.underLayColor}
          style={[
            others.style || {},
            {
              height: ButtonSizes[size].btn,
              backgroundColor: btnColors.bgColor,
              borderColor: btnColors.borderColor,
              borderRadius: ButtonSizes[size].btn,
            },
            styles.center,
            styles.btnContainer,
            others.disabled && styles.disabled,
            isActive && generateShadow(),
          ]}>
          <>
            {loading && !others.disabled ? (
              <ActivityIndicator
                size={24}
                color={btnColors.labelColor.default}
              />
            ) : (
              <>
                {!!leftIcon && generateLeftIcon}
                <Typography
                  label={others.label || ''}
                  variant="b3-m"
                  color={
                    isActive
                      ? btnColors.labelColor.active
                      : btnColors.labelColor.default
                  }
                  align="center"
                />
                {!!rightIcon && generateRightIcon}
              </>
            )}
          </>
        </TouchableHighlight>
      ) : (
        <TouchableHighlight
          {...others}
          onPressIn={() => setIsActive(true)}
          onPressOut={() => setIsActive(false)}
          underlayColor={btnColors.underLayColor}
          style={[
            others.style || {},
            {
              width: ButtonSizes[size].btn,
              height: ButtonSizes[size].btn,
              backgroundColor: btnColors.bgColor,
              borderColor: btnColors.borderColor,
              borderRadius: ButtonSizes[size].btn,
            },
            styles.center,
            styles.iconBtnContainer,
            others.disabled && styles.disabled,
            isActive && generateShadow(),
          ]}>
          {icon && generateIcon}
        </TouchableHighlight>
      )}
    </>
  );
};

type ButtonIconOnlyProps = {
  size: number;
  iconSize: number;
  icon: React.ReactElement<SvgProps>;
};

type TouchableButtonIconProps = ButtonIconOnlyProps & TouchableHighlightProps;

export const IconButton = ({
  size,
  iconSize,
  icon,
  ...others
}: TouchableButtonIconProps) => {
  return (
    <TouchableHighlight
      activeOpacity={0.75}
      underlayColor={FWDColors.transparent}
      {...others}
      style={[
        {
          width: size,
          height: size,
        },
        styles.center,
      ]}>
      <View
        style={[
          {
            width: size,
            height: size,
          },
          styles.center,
        ]}>
        {cloneElement<SvgProps>(icon, {
          width: iconSize,
          height: iconSize,
        })}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderWidth: 1,
  },
  iconBtnContainer: {
    flexDirection: 'row',
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
