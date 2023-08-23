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
import {EmployeePlanScheduleModel} from '@/services/api/api.service';

interface ScheduleRequestFields {
  badgeColor: string;
  icon: React.ReactElement;
}

interface ScheduleRequestListProps {
  title: string;
  list: EmployeePlanScheduleModel[];
  selectedIds?: string[];
  disableView?: boolean;
  disableSelection?: boolean;
  actionRenderer?: () => React.ReactElement;
  hideHeader?: boolean;
  style?: StyleProp<ViewStyle>;
  status: number;
  onView?: (item: EmployeePlanScheduleModel) => void;
  onSelect?: (id: string) => void;
}

export const ScheduleRequestList = ({
  title,
  list,
  status,
  selectedIds = [],
  disableView = false,
  disableSelection = false,
  actionRenderer,
  hideHeader = false,
  style = {},
  onView,
  onSelect,
}: ScheduleRequestListProps) => {
  const creditStatusProps = useMemo<ScheduleRequestFields>(() => {
    let badgeColor = FWDColors.orange20;
    let icon: React.ReactElement = <></>;

    switch (status) {
      case 1:
        badgeColor = FWDColors.grey1;
        icon = (
          <RadioSelected width={20} height={20} color={FWDColors.orange} />
        );
        break;

      case 2:
        badgeColor = FWDColors.greenLight50;
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

      case 3:
        badgeColor = FWDColors.yellow20;
        break;
    }

    return {
      badgeColor,
      icon,
    };
  }, [status]);

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

          {actionRenderer && actionRenderer()}
        </View>
      )}

      <View>
        {list.map((employee, index) => (
          <TouchableOpacity
            key={employee.employeeKeyId}
            disabled={disableView && disableSelection}
            activeOpacity={disableView && disableSelection ? 1 : 0.75}
            onPress={() => !disableView && onView?.(employee)}
            onLongPress={() =>
              !disableSelection && onSelect?.(employee.employeeKeyId || '')
            }
            style={[
              layoutStyles.row,
              layoutStyles.betweenCenter,
              {
                borderRadius: spacer(8),
                borderWidth: spacer(1),
                borderColor:
                  status === 2
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

            {status === 1 &&
              selectedIds.includes(employee.employeeKeyId || '') &&
              creditStatusProps.icon}

            {status === 2 && creditStatusProps.icon}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
