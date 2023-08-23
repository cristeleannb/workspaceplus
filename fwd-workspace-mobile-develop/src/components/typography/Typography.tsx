import React, {ReactText} from 'react';
import {Text, TextProps, TextStyle} from 'react-native';

import {FWDColors} from './../theme/Colors';

type TypographyAlignment = 'left' | 'center' | 'right' | 'auto' | 'justify';

type TypographyFontFamily =
  | 'FWDCircularTT-Book'
  | 'FWDCircularTT-Medium'
  | 'FWDCircularTT-Bold';

type TypographyWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | undefined;
type TypographyStyles = Pick<
  TextStyle,
  'fontSize' | 'fontWeight' | 'fontFamily'
>;

const createTypographyVariantStyles = (
  size: number,
  weight: TypographyWeight,
  family: TypographyFontFamily,
): TypographyStyles => {
  return {
    fontSize: size,
    fontWeight: weight,
    fontFamily: family,
  };
};
type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'b1-b'
  | 'b1-m'
  | 'b2-b'
  | 'b2-m'
  | 'b3-b'
  | 'b3-m'
  | 'b4-b'
  | 'b4-m'
  | 'l1-b'
  | 'l1-m'
  | 'l2-b'
  | 'l2-m'
  | 'l3-b'
  | 'l3-m'
  | 'l3-bold'
  | 'l4-bold';
const TypographyVariants: Record<TypographyVariant, TypographyStyles> = {
  h1: createTypographyVariantStyles(14, undefined, 'FWDCircularTT-Bold'),
  h2: createTypographyVariantStyles(16, undefined, 'FWDCircularTT-Bold'),
  h3: createTypographyVariantStyles(20, undefined, 'FWDCircularTT-Bold'),
  h4: createTypographyVariantStyles(24, undefined, 'FWDCircularTT-Bold'),
  h5: createTypographyVariantStyles(32, undefined, 'FWDCircularTT-Bold'),
  h6: createTypographyVariantStyles(40, undefined, 'FWDCircularTT-Bold'),
  'b1-b': createTypographyVariantStyles(24, '400', 'FWDCircularTT-Book'),
  'b1-m': createTypographyVariantStyles(24, '400', 'FWDCircularTT-Medium'),
  'b2-b': createTypographyVariantStyles(20, '400', 'FWDCircularTT-Book'),
  'b2-m': createTypographyVariantStyles(20, '400', 'FWDCircularTT-Medium'),
  'b3-b': createTypographyVariantStyles(16, '400', 'FWDCircularTT-Book'),
  'b3-m': createTypographyVariantStyles(16, '400', 'FWDCircularTT-Medium'),
  'b4-b': createTypographyVariantStyles(14, '400', 'FWDCircularTT-Book'),
  'b4-m': createTypographyVariantStyles(14, '400', 'FWDCircularTT-Medium'),
  'l1-b': createTypographyVariantStyles(16, '400', 'FWDCircularTT-Book'),
  'l1-m': createTypographyVariantStyles(16, '400', 'FWDCircularTT-Medium'),
  'l2-b': createTypographyVariantStyles(14, '400', 'FWDCircularTT-Book'),
  'l2-m': createTypographyVariantStyles(14, '400', 'FWDCircularTT-Medium'),
  'l3-b': createTypographyVariantStyles(13, '400', 'FWDCircularTT-Book'),
  'l3-m': createTypographyVariantStyles(13, '400', 'FWDCircularTT-Medium'),
  'l3-bold': createTypographyVariantStyles(13, undefined, 'FWDCircularTT-Bold'),
  'l4-bold': createTypographyVariantStyles(8, undefined, 'FWDCircularTT-Bold'),
};

interface TypographyProps extends TextProps {
  label: ReactText;
  color?: string;
  variant?: TypographyVariant;
  align?: TypographyAlignment;
}

export const Typography = ({
  label,
  color = FWDColors.greenDarker,
  variant = 'l3-b',
  align = 'left',
  ...others
}: TypographyProps) => {
  return (
    <Text
      {...others}
      style={[
        others.style || {},
        TypographyVariants[variant],
        {
          color: color,
          textAlign: align,
        },
      ]}>
      {label}
    </Text>
  );
};
