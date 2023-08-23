import React, {useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import _ from 'lodash';
import {format} from 'date-fns';

import {
  Calendar,
  FWDColors,
  QuestionmarkCircle,
  Typography,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {HolidayModel} from '@/services/api/api.service';

interface HolidayListNoteProps {
  holidays?: HolidayModel[];
  onPress?: () => void;
}

export const HolidayListNote = ({
  holidays = [],
  onPress,
}: HolidayListNoteProps) => {
  const holidayLabel = useMemo(() => {
    if (holidays.length <= 0) {
      return {
        rangeLabel: '',
        supportLabel: '',
      };
    }

    if (!holidays[0].holidayDate) {
      return {
        rangeLabel: '',
        supportLabel: '',
      };
    }

    const holidayMonth = format(new Date(holidays[0].holidayDate), 'MMM');
    const holidayDates = _.map(holidays, holiday =>
      holiday.holidayDate ? format(new Date(holiday.holidayDate), 'd') : '',
    );

    let datesLabel = '';
    let supportLabel = '';

    if (holidayDates.length > 1) {
      const lastIndex = holidayDates.length - 1;
      const endDate = holidayDates.splice(lastIndex, 1);
      datesLabel = `${holidayDates.join(', ')} and ${endDate}`;

      if (holidays.length === 2) {
        supportLabel = ' are both holidays.';
      } else {
        supportLabel = ' are all holidays.';
      }
    } else {
      datesLabel = holidayDates.join(', ');
      supportLabel = ' is a holiday.';
    }

    return {
      rangeLabel: `${holidayMonth} ${datesLabel}`,
      supportLabel: supportLabel,
    };
  }, [holidays]);

  if (holidays.length <= 0) {
    return null;
  }

  return (
    <View
      style={[
        layoutStyles.row,
        layoutStyles.startCenter,
        {
          paddingVertical: spacer(8),
          paddingHorizontal: spacer(12),
          backgroundColor: FWDColors.greyLight,
          borderRadius: spacer(8),
          borderBottomRightRadius: spacer(0),
        },
      ]}>
      <View
        style={[
          layoutStyles.centerCenter,
          {
            width: spacer(24),
            height: spacer(24),
          },
        ]}>
        <Calendar width={16} height={16} color={FWDColors.greenDarker} />
      </View>

      <View
        style={[
          layoutStyles.row,
          layoutStyles.cover,
          {
            marginLeft: spacer(4),
            marginRight: spacer(4),
          },
        ]}>
        <Text>
          <Typography
            label={holidayLabel.rangeLabel}
            color={FWDColors.greenDarker}
            variant="l3-bold"
          />
          <Typography
            label={holidayLabel.supportLabel}
            color={FWDColors.dark}
            variant="l3-b"
          />
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.75} onPress={() => onPress?.()}>
        <View
          style={[
            layoutStyles.centerCenter,
            {
              width: spacer(24),
              height: spacer(24),
            },
          ]}>
          <QuestionmarkCircle width={24} height={24} color={FWDColors.orange} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
