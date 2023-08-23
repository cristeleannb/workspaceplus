import React from 'react';
import {View} from 'react-native';

import {FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {PieGraphProps} from '../graphs/PieGraph';

enum ScheduleType {
  WFO = 'wfo',
  WFA = 'wfa',
  WFB = 'wfb',
}

interface WMEmployeeCountViewProps {
  count: number;
  type: ScheduleType;
  label: string;
  typeColor: string;
}

interface EmployeeCount extends WMEmployeeCountViewProps {}

const WMEmployeeCountView = ({wfaCount, wfoCount, wfbCount}: PieGraphProps) => {
  const employeeCountList: EmployeeCount[] = [
    {
      type: ScheduleType.WFA,
      count: wfaCount,
      label: 'WFA',
      typeColor: FWDColors.orange70,
    },
    {
      type: ScheduleType.WFB,
      count: wfbCount,
      label: 'WFB',
      typeColor: FWDColors.yellow50,
    },
    {
      type: ScheduleType.WFO,
      count: wfoCount,
      label: 'WFO',
      typeColor: FWDColors.greenLight,
    },
  ];

  return (
    <View style={[layoutStyles.row]}>
      {employeeCountList.map((type, index) => (
        <View
          key={index}
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

export default WMEmployeeCountView;
