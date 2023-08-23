import React, {memo, useMemo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {format} from 'date-fns';

import {FWDColors, More, Typography} from '@/components';
import {TableOffice} from '@/components/pictograms';
import {layoutStyles, spacer} from '@/utils';

import {
  UpcomingReservationResponse,
  WorkType,
} from '@/services/api/api.service';

interface WorkstationSeatProps extends UpcomingReservationResponse {
  branchPrefix?: string;
  onPress?: () => void;
}

const formatDate = (date?: Date) => {
  return date ? format(new Date(date), 'EEE, d MMM') : '';
};

export const WorkstationSeat = memo((props: WorkstationSeatProps) => {
  const {
    seatCode,
    workstationSchedule,
    workType,
    divisionName,
    branchName = '',
    branchSchedule,
    onPress,
  } = props;

  const stationData = useMemo(() => {
    switch (workType) {
      case WorkType.WFO:
        return {
          schedule: formatDate(workstationSchedule),
          label: `${divisionName}, Seat ${seatCode}`,
        };

      case WorkType.WFB:
        return {
          schedule: formatDate(branchSchedule),
          label: branchName,
        };

      default:
        return null;
    }
  }, [
    branchSchedule,
    branchName,
    divisionName,
    seatCode,
    workType,
    workstationSchedule,
  ]);

  if (!stationData) {
    return null;
  }

  return (
    <View style={{paddingVertical: spacer(8)}}>
      <Typography
        label={stationData.schedule}
        color={FWDColors.grey3}
        variant="l3-b"
      />
      <View
        style={[
          layoutStyles.row,
          layoutStyles.startCenter,
          {marginTop: spacer(4)},
        ]}>
        <TableOffice width={24} height={24} />

        <Typography
          label={stationData.label}
          variant="h1"
          style={[layoutStyles.cover, {marginLeft: spacer(8)}]}
        />

        <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
          <More width={24} height={24} color={FWDColors.orange} />
        </TouchableOpacity>
      </View>
    </View>
  );
});
