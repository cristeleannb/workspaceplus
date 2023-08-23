import React, {useMemo, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {endOfDay, format, startOfDay} from 'date-fns';
import _ from 'lodash';
import {observer} from 'mobx-react';

import {AngleRightThick, FWDColors, ShadowView, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {NavigationKey} from '@/navigations';
import {useGetSummaryReport} from '@/services/query/';
import {DateUtil} from '@/utils/date.util';
import {EmployeePlanScheduleBranchWorkstationSummaryModel} from '@/services/api/api.service';
import {useStores} from '@/stores';
import {AccountRole} from '@/types';

interface WFMSummaryProps {
  count: number;
  type: string;
  label: string;
  typeColor: string;
}

export const DashboardWMCard = observer(() => {
  const {authStore} = useStores();
  const navigation = useNavigation();
  const [currentDate] = useState(new Date());
  const accountRole = authStore.user?.employeeRoles?.[0].personaRoleId;

  const {data} = useGetSummaryReport({
    dateStart: DateUtil.asUTCDate(startOfDay(currentDate)).toISOString(),
    dateEnd: endOfDay(DateUtil.asUTCDate(currentDate)).toISOString(),
  });

  const swappedData = useMemo(() => {
    const summaryData =
      data?.employeePlanScheduleBranchWorkstationSummaryCollection || [];

    if (summaryData.length <= 0) {
      return [];
    }

    const summaryDictionary = _.mapValues(
      _.groupBy(summaryData, summary => summary.workTypeCode),
      summary => summary[0],
    );

    const summaryList: EmployeePlanScheduleBranchWorkstationSummaryModel[] = [];

    if (summaryDictionary.WFA) {
      summaryList.push(summaryDictionary.WFA);
    }

    if (summaryDictionary.WFB) {
      summaryList.push(summaryDictionary.WFB);
    }

    if (summaryDictionary.WFO) {
      summaryList.push(summaryDictionary.WFO);
    }

    return summaryList;
  }, [data]);

  const employeeCountList: WFMSummaryProps[] = useMemo(() => {
    return swappedData.map(type => {
      return {
        type: type?.workTypeCode || '',
        count: type?.totalCount || 0,
        label:
          type?.workTypeId === 1
            ? 'Working From Anywhere'
            : type?.workTypeId === 2
            ? 'Working From Branch'
            : type?.workTypeId === 3
            ? 'Working From Office'
            : '',
        typeColor:
          type?.workTypeId === 1
            ? FWDColors.orange70
            : type?.workTypeId === 2
            ? FWDColors.yellow
            : FWDColors.greenLight50,
      };
    });
  }, [swappedData]);

  const checkWorkforceMonitoring = () => {
    if (
      accountRole === AccountRole.PeopleManager ||
      accountRole === AccountRole.ExCom
    ) {
      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_MANAGE_TEAM,
        },
      });
    } else {
      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_WORKFORCE_MONITORING,
        },
      });
    }
  };

  return (
    <ShadowView
      style={{
        marginTop: spacer(24),
        paddingVertical: spacer(16),
        borderRadius: spacer(8),
      }}>
      <View
        style={[
          layoutStyles.row,
          layoutStyles.betweenStart,
          {paddingHorizontal: spacer(16)},
        ]}>
        <View>
          <Typography
            label="Workforce Monitoring"
            variant="h1"
            color={FWDColors.orange}
            style={{marginBottom: spacer(4)}}
          />
          <Typography
            label={`As of Today, ${format(new Date(), 'h:mma')}`}
            variant="l3-b"
            color={FWDColors.grey4}
          />
        </View>

        <TouchableOpacity
          style={[layoutStyles.row, layoutStyles.centerCenter]}
          onPress={checkWorkforceMonitoring}>
          <Typography label={'View'} variant="l3-m" color={FWDColors.orange} />
          <AngleRightThick
            width={16}
            height={16}
            color={FWDColors.orange}
            style={{marginLeft: spacer(6)}}
          />
        </TouchableOpacity>
      </View>
      <View
        style={[
          layoutStyles.fullWidth,
          {
            marginTop: spacer(12),
            borderWidth: spacer(1),
            borderColor: FWDColors.transparent,
            borderTopColor: FWDColors.greyLight,
          },
        ]}>
        {employeeCountList.map((type, index) => (
          <View
            key={index}
            style={[
              layoutStyles.row,
              layoutStyles.fullWidth,
              layoutStyles.betweenCenter,
              {marginTop: spacer(12), paddingHorizontal: spacer(16)},
            ]}>
            <View style={[layoutStyles.row, layoutStyles.startCenter]}>
              <View
                style={{
                  height: spacer(10),
                  width: spacer(10),
                  borderRadius: spacer(10),
                  backgroundColor: type.typeColor,
                  marginRight: spacer(12),
                }}
              />
              <Typography
                label={type.label}
                variant="l3-b"
                color={FWDColors.greenDarker}
              />
            </View>

            <Typography
              label={type.count}
              variant="l3-bold"
              color={FWDColors.greenDarker}
            />
          </View>
        ))}
      </View>
    </ShadowView>
  );
});
