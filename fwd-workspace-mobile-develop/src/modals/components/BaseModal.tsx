import React from 'react';
import {View, Dimensions, Platform, ScrollView} from 'react-native';

import {spacer} from '@/utils';
import {FWDColors} from '@/components';

const {width, height} = Dimensions.get('window');

export const BaseModal: React.FC = ({children}) => {
  return (
    <View
      style={{
        borderRadius: spacer(16),
        backgroundColor: FWDColors.white,
        width: spacer(
          width -
            (Platform.select({
              android: 80,
              ios: 96,
            }) || 0),
        ),
        maxHeight: spacer(height - 240),
        marginTop: spacer(24),
      }}>
      <View>
        <ScrollView>{children}</ScrollView>
      </View>
    </View>
  );
};
