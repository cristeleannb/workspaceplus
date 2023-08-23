import React, {useMemo} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {layoutStyles, spacer} from '@/utils';
import {
  Advisor2,
  Avatar,
  Check,
  FWDColors,
  RadioSelected,
  Typography,
} from '@/components';
import {EmployeeWorkingCreditsModel} from '@/services/api/api.service';

type EmployeeCreditsStatus = 'assigned' | 'unassigned';

interface TeamListCreditsFields {
  badgeColor: string;
  icon: React.ReactElement;
}

interface TeamListProps {
  title: string;
  list: EmployeeWorkingCreditsModel[];
  selectedIds?: string[];
  disableSelection?: boolean;
  hideHeader?: boolean;
  style?: StyleProp<ViewStyle>;
  creditStatus: EmployeeCreditsStatus;
  onSelect?: (id: string) => void;
}

export const TeamList = ({
  title,
  list,
  creditStatus,
  selectedIds = [],
  disableSelection = false,
  hideHeader = false,
  style = {},
  onSelect,
}: TeamListProps) => {
  const creditStatusProps = useMemo<TeamListCreditsFields>(() => {
    let badgeColor = FWDColors.grey1;
    let icon: React.ReactElement = <></>;

    switch (creditStatus) {
      case 'unassigned':
        badgeColor = FWDColors.grey1;
        icon = (
          <RadioSelected width={20} height={20} color={FWDColors.orange} />
        );
        break;

      case 'assigned':
        badgeColor = FWDColors.greenLight20;
        icon = (
          <View
            style={[
              layoutStyles.centerCenter,
              {
                width: spacer(24),
                height: spacer(24),
                borderRadius: spacer(24),
                backgroundColor: FWDColors.orange,
              },
            ]}>
            <Check width={14} height={14} color={FWDColors.white} />
          </View>
        );
        break;
    }

    return {
      badgeColor,
      icon,
    };
  }, [creditStatus]);

  return (
    <View
      style={{
        ...(style as any),
      }}>
      {!hideHeader && (
        <View
          style={[
            layoutStyles.row,
            layoutStyles.betweenCenter,
            {marginBottom: spacer(16)},
          ]}>
          {title && (
            <View
              style={[
                layoutStyles.row,
                layoutStyles.betweenCenter,
                {
                  left: spacer(0),
                  right: spacer(0),
                },
              ]}>
              <Typography
                label={title}
                variant="h2"
                color={FWDColors.greenDarker}
              />

              <View
                style={[
                  layoutStyles.centerCenter,
                  {
                    backgroundColor: creditStatusProps.badgeColor,
                    paddingHorizontal: spacer(8),
                    paddingVertical: spacer(6),
                    borderRadius: spacer(8),
                    marginLeft: spacer(8),
                    minWidth: spacer(32),
                  },
                ]}>
                <Typography
                  label={list.length}
                  color={FWDColors.greenDarker}
                  variant="h2"
                />
              </View>
            </View>
          )}
        </View>
      )}

      <View>
        {list.map((employee, index) => (
          <TouchableOpacity
            key={employee.employeeKeyId}
            activeOpacity={disableSelection ? 1 : 0.75}
            onPress={() =>
              !disableSelection && onSelect?.(employee.employeeKeyId || '')
            }
            style={[
              layoutStyles.row,
              layoutStyles.betweenCenter,
              {
                borderRadius: spacer(8),
                borderWidth: spacer(1),
                borderColor:
                  creditStatus === 'assigned'
                    ? FWDColors.greenLight50
                    : selectedIds.includes(employee.employeeKeyId || '')
                    ? FWDColors.orange
                    : FWDColors.lightblue,
                backgroundColor: FWDColors.white,
                padding: spacer(16),
                marginTop: spacer(index > 0 ? 16 : 0),
              },
            ]}>
            <View
              style={[
                layoutStyles.row,
                layoutStyles.cover,
                layoutStyles.fullWidth,
              ]}>
              <Avatar
                imageUrl={employee.employeeImage}
                gender={employee.employeeGender}
              />
              <View
                style={[
                  layoutStyles.cover,
                  {
                    marginLeft: spacer(12),
                  },
                ]}>
                <Typography
                  label={employee.employeeName || ''}
                  variant="h1"
                  color={FWDColors.greenDarker}
                  style={[layoutStyles.cover]}
                />
                <View
                  style={[
                    layoutStyles.row,
                    layoutStyles.startCenter,
                    layoutStyles.cover,
                    {
                      marginTop: spacer(4),
                    },
                  ]}>
                  <Advisor2
                    width={24}
                    height={24}
                    color={FWDColors.orange}
                    style={{
                      marginRight: spacer(4),
                    }}
                  />
                  <Typography
                    label={employee.employeePositionTitle || ''}
                    color={FWDColors.grey4}
                    variant="l2-b"
                    style={[layoutStyles.cover]}
                  />
                </View>
              </View>
            </View>

            {creditStatus === 'unassigned' &&
              selectedIds.includes(employee.employeeKeyId || '') &&
              creditStatusProps.icon}

            {creditStatus === 'assigned' && creditStatusProps.icon}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
