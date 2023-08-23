import React from 'react';
import {View} from 'react-native';

import {Advisor2, Avatar, Branch, FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {EmployeePlanScheduleBranchWorkstationModel} from '@/services/api/api.service';

interface EmployeeCardProps {
  data: EmployeePlanScheduleBranchWorkstationModel;
  showBranch?: boolean;
  showCheckInStatus?: boolean;
}

export const EmployeeCard = ({
  data,
  showBranch = false,
  showCheckInStatus = false,
}: EmployeeCardProps) => {
  return (
    <View
      style={[
        layoutStyles.row,
        {
          padding: spacer(16),
          borderRadius: spacer(8),
          borderWidth: spacer(1),
          borderColor: FWDColors.lightblue,
        },
      ]}>
      <View>
        {/* TODO: update the avatar component to be supplied with gender */}
        <Avatar
          size={32}
          imageUrl={data.employeeImage}
          gender={data.employeeGender}
        />
      </View>

      <View style={[layoutStyles.cover, {marginLeft: spacer(12)}]}>
        <Typography
          label={data.employeeName || ''}
          color={FWDColors.greenDark}
          variant="h1"
        />
        <View
          style={[
            layoutStyles.row,
            layoutStyles.startCenter,
            {marginTop: spacer(4)},
          ]}>
          <Advisor2
            width={24}
            height={24}
            color={FWDColors.orange}
            style={{
              marginRight: spacer(2),
            }}
          />
          <Typography
            label={data.employeePositionTitle || ''}
            color={FWDColors.grey4}
            variant="l2-b"
          />
        </View>

        {showBranch && (
          <View
            style={[
              layoutStyles.row,
              layoutStyles.startCenter,
              {marginTop: spacer(4)},
            ]}>
            <Branch
              width={24}
              height={24}
              color={FWDColors.orange}
              style={{
                marginRight: spacer(2),
              }}
            />
            <Typography
              label={data.branchName || ''}
              color={FWDColors.grey4}
              variant="l2-b"
            />
          </View>
        )}
      </View>

      {showCheckInStatus && (
        <View
          style={[
            layoutStyles.absolute,
            {
              paddingHorizontal: spacer(8),
              paddingVertical: spacer(2),
              top: spacer(0),
              right: spacer(0),
              borderTopRightRadius: spacer(8),
              borderBottomLeftRadius: spacer(8),
              backgroundColor:
                data.workstationStatus === 1
                  ? FWDColors.greenLight20
                  : FWDColors.yellow20,
            },
          ]}>
          <Typography
            label={
              data.workstationStatus === 1 ? 'Checked-In' : 'Pending check-in'
            }
            color={FWDColors.greenDark}
            variant="l3-b"
          />
        </View>
      )}
    </View>
  );
};
