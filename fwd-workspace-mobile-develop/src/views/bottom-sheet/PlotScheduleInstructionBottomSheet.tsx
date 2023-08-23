import React from 'react';
import {GestureResponderEvent, Text, View} from 'react-native';

import {layoutStyles, spacer} from '@/utils';
import {Button, FWDColors, Typography} from '@/components';
import {Calendar} from '@/components/pictograms';
import {InfoCircle} from '@/components/icons';

const tipList = [
  'Tap on a date or tap and hold to select multiple dates',
  'Then select "Clear Selection" to remove the status',
];

interface PlotScheduleInstructionBottomSheetProps {
  onClose: (event: GestureResponderEvent) => void;
}

export const PlotScheduleInstructionBottomSheet = ({
  onClose,
}: PlotScheduleInstructionBottomSheetProps) => {
  return (
    <View
      style={{
        paddingHorizontal: spacer(16),
        paddingBottom: spacer(16),
      }}>
      <View style={[layoutStyles.centerCenter]}>
        <Calendar width={80} height={80} color={FWDColors.orange} />
      </View>

      <View
        style={{
          marginTop: spacer(8),
        }}>
        <Typography
          align="center"
          label="How to plot your schedule"
          variant="h3"
          color={FWDColors.orange}
        />
      </View>

      <View
        style={{
          marginTop: spacer(24),
        }}>
        <View style={{marginBottom: spacer(16)}}>
          <Typography
            label="Assigning WFO/WFB/WFA"
            variant="h2"
            style={{marginBottom: spacer(8)}}
          />
          <Typography
            label="Select a status and tap on a date to set the schedule"
            variant="b4-b"
          />
        </View>

        <View
          style={[
            layoutStyles.row,
            {
              backgroundColor: FWDColors.yellow20,
              padding: spacer(12),
              borderRadius: spacer(8),
              borderBottomRightRadius: spacer(0),
              marginBottom: spacer(32),
            },
          ]}>
          <InfoCircle
            height={24}
            width={24}
            color={FWDColors.orange}
            style={{marginRight: spacer(12)}}
          />
          <Text style={[layoutStyles.cover]}>
            <Typography
              label="WFA credits"
              variant="l3-bold"
              color={FWDColors.grey4}
            />
            <Typography
              label=" can be used for either "
              variant="l3-b"
              color={FWDColors.grey4}
            />
            <Typography
              label="WFA or WFB."
              variant="l3-bold"
              color={FWDColors.grey4}
            />
          </Text>
        </View>

        <View>
          <Typography
            label="Clearing a date"
            variant="h2"
            style={{marginBottom: spacer(8)}}
          />

          {tipList.map((tip, index) => (
            <View
              key={index}
              style={[
                layoutStyles.row,
                {
                  marginTop: spacer(index > 0 ? 8 : 0),
                },
              ]}>
              <View
                style={{
                  marginRight: spacer(4),
                }}>
                <Typography label={`${index + 1}. `} />
              </View>
              <Typography
                label={tip}
                variant="l3-b"
                color={FWDColors.greenDarker}
              />
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          marginTop: spacer(48),
        }}>
        <Button label="Got it" onPress={onClose} />
      </View>
    </View>
  );
};
