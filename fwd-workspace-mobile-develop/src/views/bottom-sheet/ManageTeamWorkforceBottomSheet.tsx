import React from 'react';
import {ScrollView, View} from 'react-native';
import {format} from 'date-fns';

import {layoutStyles, spacer} from '@/utils';
import {FWDColors, Typography} from '@/components';
import {Calendar} from '@/components/icons';
import {EmployeePlanScheduleBranchWorkstationModel} from '@/services/api/api.service';
import {ManageTeamWorkforceTypes} from '@/types';
import ManageTeamWorkforceTab from '../tabs/ManageTeamWorkforceTab';
import {EmployeeCard} from '../cards/EmployeeCard';
import {NoWorking} from '@/components/pictograms';

type WMDirectReportTabCount = {
  [key in ManageTeamWorkforceTypes]: number;
};

interface ManageTeamWorkforceBottomSheetProps {
  date: Date;
  data: EmployeePlanScheduleBranchWorkstationModel[];
  tabCount: WMDirectReportTabCount;
  selectedTab: ManageTeamWorkforceTypes;
  onTabChange: (key: ManageTeamWorkforceTypes) => void;
}

export const ManageTeamWorkforceBottomSheet = ({
  date,
  data = [],
  selectedTab,
  onTabChange,
  tabCount,
}: ManageTeamWorkforceBottomSheetProps) => {
  return (
    <View>
      <View style={[layoutStyles.fullHeight, {paddingBottom: spacer(24)}]}>
        <View style={[layoutStyles.row, layoutStyles.startCenter]}>
          <Calendar width={24} height={24} color={FWDColors.orange} />
          <Typography
            style={{marginLeft: spacer(4)}}
            label={`${format(date, 'eeee')} • ${format(date, 'MMMM d, yyyy')}`}
            variant="h3"
            color={FWDColors.greenDark}
            align="center"
          />
        </View>

        <View
          style={{
            marginTop: spacer(24),
          }}>
          <ManageTeamWorkforceTab
            selectedTab={selectedTab}
            onTabChange={onTabChange}
            wfaCount={tabCount.WFA}
            wfbCount={tabCount.WFB}
            wfoCount={tabCount.WFO}
          />
          <ScrollView>
            <View
              style={{
                marginTop: spacer(24),
              }}>
              {data.length > 0 ? (
                data.map((employee, index) => (
                  <View
                    key={index}
                    style={{marginTop: index > 0 ? spacer(16) : spacer(0)}}>
                    <EmployeeCard
                      data={employee}
                      showBranch={selectedTab === ManageTeamWorkforceTypes.WFB}
                      showCheckInStatus={
                        selectedTab === ManageTeamWorkforceTypes.WFO
                      }
                    />
                  </View>
                ))
              ) : (
                <View style={[layoutStyles.startCenter]}>
                  <NoWorking width={80} height={80} />
                  <Typography
                    label="No Employees Scheduled"
                    color={FWDColors.orange}
                    variant="h2"
                    style={{
                      marginTop: spacer(8),
                    }}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
