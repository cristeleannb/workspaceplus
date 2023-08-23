import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import {FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';

export enum WMTabs {
  DIVISION = 'division',
  BRANCH = 'branch',
}

interface WMTypeTabProps {
  selectedTab: WMTabs;
  onTabChange: (tab: WMTabs) => void;
}

const WMTypeTab = (props: WMTypeTabProps) => {
  var {selectedTab, onTabChange} = props;
  const toggleSelect = (tab: WMTabs) => {
    onTabChange(tab);
  };

  return (
    <View style={[layoutStyles.row]}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => toggleSelect(WMTabs.DIVISION)}
        style={[
          layoutStyles.row,
          layoutStyles.cover,
          layoutStyles.centerCenter,
          {
            backgroundColor:
              selectedTab === WMTabs.DIVISION
                ? FWDColors.greenDarker
                : FWDColors.lightblue,
            paddingVertical: spacer(8),
            borderTopLeftRadius: spacer(4),
            borderBottomLeftRadius: spacer(4),
            height: spacer(32),
          },
        ]}>
        <Typography
          label="By Division"
          color={
            selectedTab === WMTabs.DIVISION ? FWDColors.white : FWDColors.grey4
          }
          variant="l3-m"
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => toggleSelect(WMTabs.BRANCH)}
        style={[
          layoutStyles.row,
          layoutStyles.cover,
          layoutStyles.centerCenter,
          {
            backgroundColor:
              selectedTab === WMTabs.BRANCH
                ? FWDColors.greenDarker
                : FWDColors.lightblue,
            paddingVertical: spacer(8),
            borderTopRightRadius: spacer(4),
            borderBottomRightRadius: spacer(4),
            height: spacer(32),
          },
        ]}>
        <Typography
          label="By Branch"
          color={
            selectedTab === WMTabs.BRANCH ? FWDColors.white : FWDColors.grey4
          }
          variant="l3-m"
        />
      </TouchableOpacity>
    </View>
  );
};

export default WMTypeTab;
