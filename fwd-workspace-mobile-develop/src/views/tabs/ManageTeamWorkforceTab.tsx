import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import {FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {ManageTeamWorkforceTypes} from '@/types';

interface ManageTeamWorkforceTabData {
  key: ManageTeamWorkforceTypes;
  label: string;
  bgColor: string;
}

interface ManageTeamWorkforceTabProps {
  wfaCount: number;
  wfbCount: number;
  wfoCount: number;
  selectedTab: ManageTeamWorkforceTypes;
  onTabChange: (tab: ManageTeamWorkforceTypes) => void;
}

const ManageTeamWorkforceTab = (props: ManageTeamWorkforceTabProps) => {
  var {selectedTab, onTabChange} = props;

  const tabsList: ManageTeamWorkforceTabData[] = [
    {
      key: ManageTeamWorkforceTypes.WFA,
      label: `WFA ${props.wfaCount}`,
      bgColor: FWDColors.orange70,
    },
    {
      key: ManageTeamWorkforceTypes.WFB,
      label: `WFB ${props.wfbCount}`,
      bgColor: FWDColors.yellow50,
    },
    {
      key: ManageTeamWorkforceTypes.WFO,
      label: `WFO ${props.wfoCount}`,
      bgColor: FWDColors.greenLight50,
    },
  ];

  const toggleSelect = (tab: ManageTeamWorkforceTypes) => {
    onTabChange(tab);
  };

  return (
    <View style={[layoutStyles.row]}>
      {tabsList.map(type => (
        <TouchableOpacity
          key={type.key}
          activeOpacity={0.75}
          onPress={() => toggleSelect(type.key)}
          style={[
            layoutStyles.row,
            layoutStyles.cover,
            layoutStyles.centerCenter,
            {
              backgroundColor:
                selectedTab === type.key ? type.bgColor : FWDColors.white,
              paddingVertical: spacer(8),
              borderRadius: spacer(8),
            },
          ]}>
          <Typography
            label={type.label}
            color={
              selectedTab === type.key ? FWDColors.greenDark : FWDColors.grey3
            }
            variant="h2"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ManageTeamWorkforceTab;
