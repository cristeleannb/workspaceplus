import React, {useMemo} from 'react';
import {View} from 'react-native';
import _ from 'lodash';

import {spacer} from '@/utils';
import {FWDColors, Typography} from '@/components';
import WMDivisionItemView from './WMDivisionItemView';
import {EmployeePlanScheduleBranchWorkstationModel} from '@/services/api/api.service';
import {ManageTeamWorkforceTypes} from '@/types';

interface WMByDivisionViewProps {
  workforceRecordList: EmployeePlanScheduleBranchWorkstationModel[];
}

const WMByDivisionView = ({
  workforceRecordList = [],
}: WMByDivisionViewProps) => {
  const reportData = useMemo(() => {
    return _.chain(
      _.entries(
        _.mapValues(
          _.groupBy(workforceRecordList, record => record.divisionId),
          records => ({
            name: records[0].divisionName,
            data: _.mapValues(
              _.groupBy(records, record => record.workTypeCode),
              innerRecords => innerRecords.length,
            ),
          }),
        ),
      ),
    )
      .map(([k, v]) => ({id: k, ...v}))
      .sortBy(item => item.name)
      .value();
  }, [workforceRecordList]);

  return (
    <View
      style={{
        paddingVertical: spacer(24),
        paddingHorizontal: spacer(16),
      }}>
      <Typography label="Per Division" variant="h2" color={FWDColors.orange} />
      <View
        style={{
          marginTop: spacer(16),
        }}>
        {reportData?.map((report, index) => (
          <View
            key={report.id}
            style={{
              marginTop: index > 0 ? spacer(16) : spacer(0),
            }}>
            <WMDivisionItemView
              name={report.name || ''}
              wfaCount={report.data[ManageTeamWorkforceTypes.WFA]}
              wfbCount={report.data[ManageTeamWorkforceTypes.WFB]}
              wfoCount={report.data[ManageTeamWorkforceTypes.WFO]}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default WMByDivisionView;
