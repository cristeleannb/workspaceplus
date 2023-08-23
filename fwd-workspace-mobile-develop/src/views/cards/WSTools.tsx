import React, {useMemo, useState} from 'react';
import {View, TouchableOpacity, LayoutChangeEvent} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {useNavigation} from '@react-navigation/core';

import {
  Calendar,
  FWDColors,
  ManageTeam,
  // ManageTeamText,
  ManageTeamText2,
  Parking,
  // ParkingText,
  ParkingText2,
  // PlanScheduleText,
  PlanScheduleText2,
  Typography,
  Workspace,
  // WorkstationText,
  WorkstationText2,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {NavigationKey} from '@/navigations';
import {useStores} from '@/stores';
import {AccountRole} from '@/types';
import {useTimeframe} from '@/hooks/useTimeframe';
import {useGetScheduleRequests} from '@/services/query';
import _ from 'lodash';

interface ToolData {
  label: React.ReactElement<SvgProps>;
  icon: React.ReactElement<SvgProps>;
  innerLabel: string | undefined;
  navigation: string | undefined;
  enabled: boolean;
}

const tools: {
  [key: string]: ToolData;
} = {
  manageTeam: {
    label: (
      <ManageTeamText2
        width={'100%'}
        height={'100%'}
        color={FWDColors.greenDarker}
      />
    ),
    icon: <ManageTeam width={20} height={20} color={FWDColors.white} />,
    innerLabel: 'manage-team',
    navigation: NavigationKey.SCREEN_MANAGE_TEAM,
    enabled: true,
  },
  planSchedule: {
    label: (
      <PlanScheduleText2
        width={'100%'}
        height={'100%'}
        color={FWDColors.greenDarker}
      />
    ),
    icon: <Calendar width={20} height={20} color={FWDColors.white} />,
    innerLabel: 'plan-schedule',
    navigation: NavigationKey.SCREEN_PLAN_SCHEDULE_LOADER,
    enabled: true,
  },
  bookWorkstation: {
    label: (
      <WorkstationText2
        width={'100%'}
        height={'100%'}
        color={FWDColors.greenDarker}
      />
    ),
    icon: <Workspace width={20} height={20} color={FWDColors.white} />,
    innerLabel: 'book-workstation',
    enabled: true,
    navigation: NavigationKey.SCREEN_BOOK_WORKSTATION,
  },
  reserveParking: {
    label: (
      <ParkingText2
        width={'100%'}
        height={'100%'}
        color={FWDColors.greenDarker}
      />
    ),
    icon: <Parking width={20} height={20} color={FWDColors.white} />,
    innerLabel: 'reserve-parking',
    navigation: NavigationKey.SCREEN_RESERVE_PARKING,
    enabled: true,
  },
  empty: {
    label: <></>,
    icon: <Parking width={20} height={20} color={FWDColors.white} />,
    innerLabel: '',
    navigation: undefined,
    enabled: false,
  },
};

const chiefTools = [tools.manageTeam];

const executiveAssistantTools = [
  tools.planSchedule,
  tools.bookWorkstation,
  tools.reserveParking,
];

const exCoTools = [tools.manageTeam];

const peopleManagerTools = [
  tools.manageTeam,
  tools.planSchedule,
  tools.bookWorkstation,
  tools.reserveParking,
];

const employeeTools = [
  tools.planSchedule,
  tools.bookWorkstation,
  tools.reserveParking,
];

interface WSToolItemProps {
  label: React.ReactElement<SvgProps>;
  icon: React.ReactElement<SvgProps>;
  size: number;
  badgeCount?: number;
  onPress: () => void;
}

const WSToolItem = ({
  label,
  icon,
  size,
  onPress,
  badgeCount = 0,
}: WSToolItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[layoutStyles.cover, layoutStyles.fullWidth]}>
      <View
        style={[
          layoutStyles.cover,
          layoutStyles.startCenter,
          {
            borderRadius: spacer(8),
            backgroundColor: FWDColors.white,
            paddingVertical: spacer(16),
            paddingHorizontal: spacer(8),
            height: size,
            width: size,
          },
        ]}>
        <View>
          <View
            style={[
              layoutStyles.centerCenter,
              {
                width: spacer(32),
                height: spacer(32),
                borderRadius: spacer(32),
                backgroundColor: FWDColors.orange,
              },
            ]}>
            {icon}
          </View>
          {badgeCount > 0 && (
            <View
              style={[
                layoutStyles.absolute,
                layoutStyles.centerCenter,
                {
                  top: spacer(-2),
                  right: spacer(-2),
                  width: spacer(16),
                  height: spacer(16),
                  borderRadius: spacer(16),
                  borderWidth: spacer(1),
                  borderColor: FWDColors.white,
                  backgroundColor: FWDColors.red,
                },
              ]}>
              <Typography
                label={badgeCount}
                color={FWDColors.white}
                variant="l4-bold"
              />
            </View>
          )}
        </View>
        <View
          style={[
            layoutStyles.row,
            layoutStyles.cover,
            {
              marginTop: spacer(8),
            },
          ]}>
          {label}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const WSTools = () => {
  const navigation = useNavigation();
  const {authStore} = useStores();
  const {planSchedulePeriod} = useTimeframe();
  const [containerWidth, setContainerWidth] = useState(0);

  const {data: scheduleRequests} = useGetScheduleRequests({
    ...planSchedulePeriod,
    recordStatuses: '1',
  });

  const accountRole =
    authStore.user?.employeeRoles?.[0].personaRoleId || AccountRole.Employee;

  let accountTools: ToolData[] = [];

  const onToolPress = (tool: ToolData) => {
    if (tool.navigation && tool.enabled) {
      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: tool.navigation as any,
        },
      });
    }
  };

  switch (accountRole) {
    case AccountRole.CEO:
      accountTools = chiefTools;
      break;
    case AccountRole.SpecialExcom:
      accountTools = chiefTools;
      break;
    case AccountRole.ExecutiveAssistant:
      accountTools = executiveAssistantTools;
      break;
    case AccountRole.ExCom:
      accountTools = exCoTools;
      break;
    case AccountRole.PeopleManager:
      accountTools = peopleManagerTools;
      break;
    case AccountRole.Employee:
      accountTools = employeeTools;
      break;

    default:
      break;
  }

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const gutterSize = 12;
    const columnCount = 3;

    setContainerWidth(
      (event.nativeEvent.layout.width - (gutterSize * columnCount - 1)) /
        columnCount,
    );
  };

  const scheduleRequestCount = useMemo(() => {
    if (scheduleRequests && !!scheduleRequests.employeePlanScheduleList) {
      const pendingScheduleRequests = _.filter(
        scheduleRequests?.employeePlanScheduleList || [],
        item => item.recordStatus === 1,
      );
      return pendingScheduleRequests.length;
    } else {
      return 0;
    }
  }, [scheduleRequests]);

  return (
    <>
      <Typography label="WS+ Tools" color={FWDColors.orange} variant="h2" />

      <View
        onLayout={onContainerLayout}
        style={[
          layoutStyles.row,
          layoutStyles.cover,
          layoutStyles.fullHeight,
          layoutStyles.wrap,
          {
            marginTop: spacer(16),
          },
        ]}>
        {accountTools.map((item, index) => {
          return item.label ? (
            <View
              key={`${item.label}-${index}`}
              style={{
                width: containerWidth,
                marginLeft: spacer(index % 3 > 0 ? 12 : 0),
                marginTop: spacer(index > 2 ? 12 : 0),
              }}>
              <WSToolItem
                label={item.label}
                icon={item.icon}
                size={containerWidth}
                badgeCount={
                  item.navigation === NavigationKey.SCREEN_MANAGE_TEAM
                    ? scheduleRequestCount
                    : 0
                }
                onPress={() => onToolPress(item)}
              />
            </View>
          ) : (
            <View key={`${item.label}-${index}`} />
          );
        })}
      </View>
    </>
  );
};
