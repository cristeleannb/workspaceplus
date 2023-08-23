import React from 'react';
import {View} from 'react-native';
import {format} from 'date-fns';

import {FWDColors, ShadowView, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {Calendar} from '@/components/pictograms';

interface PastScheduleApprovalNoteProps {
  currentDate: Date;
}

export const PastScheduleApprovalNote = ({
  currentDate,
}: PastScheduleApprovalNoteProps) => {
  return (
    <ShadowView
      level={6}
      style={[
        layoutStyles.fullWidth,
        {
          borderRadius: spacer(8),
          paddingVertical: spacer(18),
          paddingHorizontal: spacer(20),
        },
      ]}>
      <View style={[layoutStyles.row, layoutStyles.fullWidth]}>
        <View
          style={[
            layoutStyles.row,
            layoutStyles.cover,
            layoutStyles.startCenter,
          ]}>
          <Calendar height={32} width={32} />
          <View
            style={[
              layoutStyles.cover,
              {
                marginLeft: spacer(12),
              },
            ]}>
            <Typography
              variant="h1"
              color={FWDColors.greenDarker}
              label={`Work Schedule for ${format(currentDate, 'MMMM yyyy')}`}
            />
          </View>
        </View>
      </View>
    </ShadowView>
  );
};
