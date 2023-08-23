import React from 'react';
import {View} from 'react-native';
import {format} from 'date-fns';

import {FWDColors, ShadowView, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {CalendarWithLock} from '@/components/pictograms';

interface PastDeadlineScheduleNoteProps {
  currentDate: Date;
}

export const PastDeadlineScheduleNote = ({
  currentDate,
}: PastDeadlineScheduleNoteProps) => {
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
          <CalendarWithLock height={32} width={32} />
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
              label="WFO days have been lumped in the beginning of the month because you’ve missed the deadline for submitting your work schedule."
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
