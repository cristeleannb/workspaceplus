import React, {memo, useMemo} from 'react';
import {View} from 'react-native';

import {spacer} from '@/utils';
import {FWDColors} from '..';

import {AvatarNonGendered, AvatarMale, AvatarFemale} from '../pictograms';

interface AvatarProps {
  size?: number;
  imageUrl?: string;
  gender?: string;
}

export const Avatar = memo(({size = 32, imageUrl, gender}: AvatarProps) => {
  const renderAvatar = useMemo(() => {
    if (imageUrl) {
      return <AvatarNonGendered width={size - 6} height={size - 6} />;
    }

    switch (gender) {
      case 'M':
        return <AvatarMale width={size - 6} height={size - 6} />;

      case 'F':
        return <AvatarFemale width={size - 6} height={size - 6} />;

      case 'O':
        return <AvatarNonGendered width={size - 6} height={size - 6} />;

      default:
        return <AvatarNonGendered width={size - 6} height={size - 6} />;
    }
  }, [imageUrl, gender, size]);

  return (
    <View
      style={[
        {
          width: spacer(size),
          height: spacer(size),
          borderRadius: spacer(size),
          borderWidth: spacer(3),
          borderColor: FWDColors.white,
          backgroundColor: FWDColors.lightblue,
        },
      ]}>
      {renderAvatar}
    </View>
  );
});
