import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Bar, FWDColors, Pie} from '@/components';
import {layoutStyles, spacer} from '@/utils';

export enum WMGraphs {
  PIE = 'pie',
  BAR = 'bar',
}

interface WMGraphTypeTabProps {
  selectedGraph: WMGraphs;
  onGraphChange: (tab: WMGraphs) => void;
}

const WMGraphTypeTab = (props: WMGraphTypeTabProps) => {
  const {selectedGraph, onGraphChange} = props;

  const toggleSelect = (graph: WMGraphs) => {
    onGraphChange(graph);
  };

  return (
    <View style={[layoutStyles.row]}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => toggleSelect(WMGraphs.PIE)}
        style={[
          layoutStyles.row,
          layoutStyles.centerCenter,
          {
            backgroundColor:
              selectedGraph === WMGraphs.PIE
                ? FWDColors.lightblue
                : FWDColors.white,
            paddingVertical: spacer(8),
            borderTopLeftRadius: spacer(4),
            borderBottomLeftRadius: spacer(4),
            height: spacer(32),
            width: spacer(52),
            borderWidth: selectedGraph === WMGraphs.PIE ? spacer(0) : spacer(1),
            borderColor: FWDColors.lightblue,
          },
        ]}>
        <Pie
          width={16}
          height={16}
          color={
            selectedGraph === WMGraphs.PIE ? FWDColors.grey4 : FWDColors.blue20
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => toggleSelect(WMGraphs.BAR)}
        style={[
          layoutStyles.row,
          layoutStyles.centerCenter,
          {
            backgroundColor:
              selectedGraph === WMGraphs.BAR
                ? FWDColors.lightblue
                : FWDColors.white,
            paddingVertical: spacer(8),
            borderTopRightRadius: spacer(4),
            borderBottomRightRadius: spacer(4),
            height: spacer(32),
            width: spacer(52),
            borderWidth: selectedGraph === WMGraphs.BAR ? spacer(0) : spacer(1),
            borderColor: FWDColors.lightblue,
          },
        ]}>
        <Bar
          width={16}
          height={16}
          color={
            selectedGraph === WMGraphs.BAR ? FWDColors.grey4 : FWDColors.blue20
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default WMGraphTypeTab;
