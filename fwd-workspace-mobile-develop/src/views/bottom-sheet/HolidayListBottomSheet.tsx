import React, {useMemo} from 'react';
import {View} from 'react-native';

import {HolidayModel} from '@/services/api/api.service';
import {WarningAlt} from '@/components/pictograms';
import {layoutStyles, spacer} from '@/utils';
import {format} from 'date-fns';
import {FWDColors, Typography} from '@/components';

interface HolidayListBottomSheetProps {
  holidays: HolidayModel[];
}

export const HolidayListBottomSheet = ({
  holidays = [],
}: HolidayListBottomSheetProps) => {
  const holidayHeaderLabel = useMemo(() => {
    if (holidays.length <= 0) {
      return '';
    }

    if (!holidays[0].holidayDate) {
      return '';
    }

    const holidayDate = new Date(holidays[0].holidayDate);
    const holidayLabel = format(holidayDate, 'MMMM yyyy');

    return `${holidayLabel} Holidays`;
  }, [holidays]);

  if (holidays.length <= 0) {
    return null;
  }

  return (
    <View
      style={{
        paddingHorizontal: spacer(16),
      }}>
      <View style={[layoutStyles.startCenter]}>
        <WarningAlt width={80} height={80} />

        <View
          style={[
            {
              marginTop: spacer(8),
            },
          ]}>
          <Typography
            label={holidayHeaderLabel}
            color={FWDColors.orange}
            variant="h3"
            align="center"
          />
        </View>
      </View>

      <View
        style={{
          marginBottom: spacer(24),
        }}>
        {holidays.map(holiday => (
          <View
            key={holiday.holidayId}
            style={[
              layoutStyles.row,
              layoutStyles.cover,
              layoutStyles.betweenStart,
              {
                marginTop: spacer(24),
              },
            ]}>
            <View style={[layoutStyles.cover]}>
              <Typography
                label={holiday.holidayName || ''}
                color={FWDColors.greenDarker}
                variant="l2-b"
              />
            </View>

            <View>
              <Typography
                label={
                  holiday.holidayDate
                    ? format(new Date(holiday.holidayDate), 'EEE, MMM d')
                    : ''
                }
                color={FWDColors.greenDarker}
                variant="l3-bold"
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
