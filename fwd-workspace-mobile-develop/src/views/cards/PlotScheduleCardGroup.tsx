import React, {memo, useMemo} from 'react';
import {Text, View} from 'react-native';

import {FWDColors, Typography} from '@/components';
import {Workspace, Office, Navigation} from '@/components/icons';
import {layoutStyles} from '@/utils';
import {
  PlotScheduleCardItemData,
  PlotScheduleCardItem,
} from './PlotScheduleCardItem';

export type ScheduleKey = number | undefined;

interface PlotScheduleCardGroupProps {
  selectedKey: ScheduleKey;
  remoteCredits?: number;
  officeCredits?: number;
  usedCredits?: number;
  onCardPress?: (key: ScheduleKey) => void;
}

export const PlotScheduleCardGroup = memo(
  ({
    selectedKey,
    remoteCredits = 0,
    officeCredits = 0,
    usedCredits = 0,
    onCardPress,
  }: PlotScheduleCardGroupProps) => {
    const scheduleTypeList: PlotScheduleCardItemData[] = useMemo(() => {
      let remainingRemoteCredits = remoteCredits - usedCredits;
      remainingRemoteCredits =
        remainingRemoteCredits > 0 ? remainingRemoteCredits : 0;

      return [
        {
          key: 1,
          defaultLabel: 'Select \nWFA Days',
          labelInactive: 'WFA',
          labelActive: 'Select WFA Days',
          icon: (
            <Navigation width={18} height={18} color={FWDColors.greenDarker} />
          ),
          bgColor: FWDColors.orange70,
          borderColor: FWDColors.orange,
          limit: (
            <Text>
              {usedCredits === 0 ? (
                <>
                  <Typography label="Max. of " variant="l3-b" />
                  <Typography
                    label={`${remoteCredits} days`}
                    variant="l3-bold"
                  />
                </>
              ) : (
                <>
                  <Typography
                    label={`${remainingRemoteCredits} days`}
                    variant="l3-bold"
                  />
                  <Typography label=" remaining" variant="l3-b" />
                </>
              )}
            </Text>
          ),
        },
        {
          key: 2,
          defaultLabel: 'Select \nWFB Days',
          labelInactive: 'WFB',
          labelActive: 'Select WFB Days',
          icon: <Office width={18} height={18} color={FWDColors.greenDarker} />,
          bgColor: FWDColors.yellow50,
          borderColor: FWDColors.yellow,
          limit: (
            <Text>
              {usedCredits === 0 ? (
                <>
                  <Typography label="Max. of " variant="l3-b" />
                  <Typography
                    label={`${remoteCredits} days`}
                    variant="l3-bold"
                  />
                </>
              ) : (
                <>
                  <Typography
                    label={`${remainingRemoteCredits} days`}
                    variant="l3-bold"
                  />
                  <Typography label=" remaining" variant="l3-b" />
                </>
              )}
            </Text>
          ),
        },
        {
          key: 3,
          defaultLabel: 'Select \nWFO Days',
          labelInactive: 'WFO',
          labelActive: 'Select WFO Days',
          icon: (
            <Workspace width={18} height={18} color={FWDColors.greenDarker} />
          ),
          bgColor: FWDColors.greenLight50,
          borderColor: FWDColors.greenLight,
          limit: (
            <Text>
              <Typography label="Min. of " variant="l3-b" />
              <Typography label={`${officeCredits} days`} variant="l3-bold" />
            </Text>
          ),
        },
      ];
    }, [officeCredits, remoteCredits, usedCredits]);

    return (
      <View
        style={[
          layoutStyles.row,
          layoutStyles.cover,
          !!selectedKey && layoutStyles.startCenter,
        ]}>
        {scheduleTypeList.map((type, index) => (
          <PlotScheduleCardItem
            key={type.key}
            index={index}
            selectedKey={selectedKey}
            onCardPress={onCardPress}
            item={type}
            remainingCredits={remoteCredits - usedCredits}
          />
        ))}
      </View>
    );
  },
);
