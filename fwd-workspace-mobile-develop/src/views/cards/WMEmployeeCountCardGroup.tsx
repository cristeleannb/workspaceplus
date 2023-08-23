import React from 'react';
import {View} from 'react-native';

import {FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {ScheduleType} from '@/types';

interface WMEmployeeCountCardGroupProps {
  count: number;
  type: ScheduleType;
  label: string;
  typeColor: string;
}

interface EmployeeCount extends WMEmployeeCountCardGroupProps {}

const WMEmployeeCountCardGroup = () => {
  const employeeCountList: EmployeeCount[] = [
    {
      type: ScheduleType.WFA,
      count: 120,
      label: 'WFA',
      typeColor: FWDColors.orange70,
    },
    {
      type: ScheduleType.WFO,
      count: 10,
      label: 'WFO',
      typeColor: FWDColors.greenLight,
    },
    {
      type: ScheduleType.WFB,
      count: 8,
      label: 'WFB',
      typeColor: FWDColors.yellow50,
    },
  ];

  return (
    <View style={[layoutStyles.row]}>
      {employeeCountList.map((type, index) => (
        <View
          style={[
            layoutStyles.row,
            layoutStyles.cover,
            layoutStyles.centerCenter,
            {
              marginLeft: index > 0 ? spacer(16) : spacer(0),
              paddingVertical: spacer(8),
              borderWidth: spacer(1),
              borderColor: FWDColors.greyLight,
              borderRadius: spacer(8),
              height: spacer(88),
              backgroundColor: FWDColors.white,
            },
          ]}>
          <View>
            <Typography
              label={type.count}
              variant="h5"
              align="center"
              color={FWDColors.greenDark}
            />
            <View
              style={[
                layoutStyles.row,
                layoutStyles.centerCenter,
                {
                  marginTop: spacer(4),
                },
              ]}>
              <View
                style={{
                  height: spacer(10),
                  width: spacer(10),
                  borderRadius: spacer(10),
                  backgroundColor: type.typeColor,
                  marginRight: spacer(4),
                }}
              />
              <Typography
                label={type.label}
                variant="l3-m"
                color={FWDColors.greenDark}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default WMEmployeeCountCardGroup;
