import React from 'react';
import {GestureResponderEvent, View} from 'react-native';

import {Button, FWDColors, Typography} from '@/components';
import {Right} from '@/components/icons';
import {layoutStyles, spacer} from '@/utils';

interface RequestWorkforceReportProps {
  onPress?: (event: GestureResponderEvent) => void;
}

export const RequestWorkforceReport = ({
  onPress,
}: RequestWorkforceReportProps) => {
  return (
    <View
      style={[
        layoutStyles.row,
        layoutStyles.betweenCenter,
        {
          borderRadius: spacer(8),
          padding: spacer(16),
          backgroundColor: FWDColors.orange5,
        },
      ]}>
      <View style={[layoutStyles.centerStart, {maxWidth: spacer(206)}]}>
        <Typography
          label="Request Workforce Report"
          variant="h1"
          color={FWDColors.orange}
        />

        <Typography
          style={{paddingTop: spacer(6)}}
          label="A detailed report will be emailed to you as soon as possible."
          variant="l3-m"
          color={FWDColors.grey4}
        />
      </View>

      <Button
        iconOnly
        color="primary"
        size="small"
        icon={<Right width={24} height={24} />}
        onPress={onPress}
      />
    </View>
  );
};
