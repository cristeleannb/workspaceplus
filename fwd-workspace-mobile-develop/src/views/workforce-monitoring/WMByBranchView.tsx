import React, {useMemo} from 'react';
import {View} from 'react-native';
import _ from 'lodash';

import {layoutStyles, spacer} from '@/utils';
import WMBranchItemView from './WMBranchItemView';
import {EmployeePlanScheduleBranchWorkstationModel} from '@/services/api/api.service';
import {NoWorking} from '@/components/pictograms';
import {FWDColors, Typography} from '@/components';

interface WMByBranchViewProps {
  workforceRecordList: EmployeePlanScheduleBranchWorkstationModel[];
}

const WMByBranchView = ({workforceRecordList = []}: WMByBranchViewProps) => {
  const reportData = useMemo(() => {
    return _.chain(
      _.entries(
        _.mapValues(
          _.groupBy(workforceRecordList, record => record.branchId),
          records => ({
            name: records[0].branchName,
            count: records.length,
          }),
        ),
      ),
    )
      .map(([k, v]) => ({id: k, ...v}))
      .filter(item => !!item.name)
      .orderBy(item => item.count, ['desc'])
      .value();
  }, [workforceRecordList]);

  return !!reportData && reportData.length > 0 ? (
    <View
      style={[
        {
          paddingVertical: spacer(24),
          paddingHorizontal: spacer(16),
        },
      ]}>
      {reportData?.map((report, index) => (
        <View
          key={report.id}
          style={{
            marginTop: index > 0 ? spacer(16) : spacer(0),
          }}>
          <WMBranchItemView
            branchName={report.name || ''}
            count={report.count}
            max={reportData[0].count}
          />
        </View>
      ))}
    </View>
  ) : (
    <View style={layoutStyles.centerCenter}>
      <NoWorking width={64} height={64} />
      <Typography
        label="No Employees Scheduled"
        variant="h2"
        color={FWDColors.orange}
        style={{
          marginTop: spacer(8),
          marginBottom: spacer(12),
        }}
      />
    </View>
  );
};

export default WMByBranchView;
