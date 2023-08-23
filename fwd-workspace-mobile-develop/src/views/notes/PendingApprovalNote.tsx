import React from 'react';
import {View} from 'react-native';
import {format} from 'date-fns';

import {FWDColors, ShadowView, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {Calendar} from '@/components/pictograms';

interface PendingApprovalNoteProps {
  currentDate: Date;
}

export const PendingApprovalNote = ({
  currentDate,
}: PendingApprovalNoteProps) => {
  return (
    <ShadowView
      level={6}
      style={[
        layoutStyles.fullWidth,
        {
          borderRadius: spacer(8),
          padding: spacer(12),
        },
      ]}>
      <View style={[layoutStyles.row, layoutStyles.fullWidth]}>
        <View
          style={[
            layoutStyles.row,
            layoutStyles.cover,
            {
              marginRight: spacer(12),
            },
          ]}>
          <Calendar height={32} width={32} />
          <View style={[layoutStyles.cover]}>
            <Typography
              variant="h1"
              color={FWDColors.greenDarker}
              label={`Work Schedule for ${format(currentDate, 'MMMM yyyy')}`}
              style={[
                {
                  marginLeft: spacer(12),
                },
              ]}
            />
            <Typography
              variant="l3-b"
              color={FWDColors.grey4}
              label="Your work schedule request is pending for approval."
              style={[
                {
                  marginLeft: spacer(12),
                  marginTop: spacer(8),
                },
              ]}
            />
          </View>
        </View>
      </View>
    </ShadowView>
  );
};
