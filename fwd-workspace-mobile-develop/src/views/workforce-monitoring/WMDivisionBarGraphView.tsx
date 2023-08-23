import React, {useMemo} from 'react';
import {View} from 'react-native';

import {spacer} from '@/utils';
import {FWDColors} from '@/components';
import {Hub, PinLocationAlt, Wfo} from '@/components/pictograms';
import WMDivisionBarGraphItemView, {
  WMDivisionBarGraphItemData,
} from './WMDivisionBarGraphItemView';
import {PieGraphProps} from '../graphs/PieGraph';

export interface WMBranchItemViewProps {
  branchName: string;
  count: number;
  barWidth: number;
}

const WMDivisionBarGraphView = ({
  wfaCount,
  wfoCount,
  wfbCount,
}: PieGraphProps) => {
  const barList: WMDivisionBarGraphItemData[] = useMemo(() => {
    return [
      {
        key: 1,
        defaultLabel: 'WFA',
        icon: <PinLocationAlt width={24} height={24} />,
        bgColor: FWDColors.orange70,
        count: wfaCount || 0,
      },
      {
        key: 2,
        defaultLabel: 'WFB',
        icon: <Hub width={24} height={24} />,
        bgColor: FWDColors.yellow50,
        count: wfbCount || 0,
      },
      {
        key: 3,
        defaultLabel: 'WFO',
        icon: <Wfo width={24} height={24} />,
        bgColor: FWDColors.greenLight,
        count: wfoCount || 0,
      },
    ];
  }, [wfaCount, wfbCount, wfoCount]);

  const max = barList.sort((a, b) => b.count - a.count)[0].count || 0;

  return (
    <View>
      {barList.map((type, index) => (
        <View
          key={index}
          style={{
            marginTop: index > 0 ? spacer(16) : spacer(0),
          }}>
          <WMDivisionBarGraphItemView {...type} max={max} />
        </View>
      ))}
    </View>
  );
};

export default WMDivisionBarGraphView;
