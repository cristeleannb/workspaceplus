import React from 'react';
import {StyleProp, View, ViewStyle, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {layoutStyles, spacer} from '@/utils';
import {Advisor2, Avatar, FWDColors, Typography} from '@/components';
import {EmployeePlanScheduleForTransferModel} from '@/services/api/api.service';

interface EmployeeSearchResultListProps {
  searchResults: EmployeePlanScheduleForTransferModel[];
  style?: StyleProp<ViewStyle>;
  onPress?: (employeeId: string) => void;
}

export const EmployeeSearchResultList = ({
  searchResults,
  style = {},
  onPress,
}: EmployeeSearchResultListProps) => {
  return (
    <View
      style={{
        marginTop: spacer(12),
        ...(style as any),
      }}>
      <FlatList
        style={{
          borderWidth: spacer(1),
          borderRadius: spacer(4),
          borderColor: FWDColors.grey1,
          backgroundColor: FWDColors.white,
        }}
        data={searchResults}
        keyExtractor={(employee, index) =>
          employee.employeeKeyId || index.toString()
        }
        renderItem={({item: employee}) => (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              if (employee.employeeKeyId) {
                onPress?.(employee.employeeKeyId);
              }
            }}
            style={[
              {
                paddingHorizontal: spacer(16),
                paddingVertical: spacer(8),
              },
            ]}>
            <View style={[layoutStyles.row, layoutStyles.startCenter]}>
              <Avatar
                size={24}
                gender={employee.employeeGender}
                imageUrl={employee.employeeImage}
              />
              <View
                style={[
                  layoutStyles.cover,
                  {
                    marginLeft: spacer(8),
                  },
                ]}>
                <Typography
                  label={employee.employeeName || ''}
                  variant="h1"
                  color={FWDColors.greenDarker}
                  style={[layoutStyles.cover]}
                />
              </View>
            </View>
            <View
              style={[
                layoutStyles.row,
                layoutStyles.startCenter,
                {
                  marginTop: spacer(4),
                },
              ]}>
              <Advisor2
                width={24}
                height={24}
                color={FWDColors.orange}
                style={{
                  marginRight: spacer(8),
                }}
              />
              <Typography
                label={employee.departmentName || ''}
                color={FWDColors.grey4}
                variant="l2-b"
                style={[layoutStyles.cover]}
              />
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{marginTop: spacer(16)}} />}
      />
    </View>
  );
};
