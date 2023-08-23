import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import _ from 'lodash';

import {useNavigation, useRoute} from '@react-navigation/core';
import {NavigationKey, UnassignEmployeeCreditsRouteProp} from '@/navigations';

import {NavigationHeader, TeamList} from '@/views';
import {Button, Left, FWDColors, Typography} from '@/components';
import {spacer, layoutStyles} from '@/utils';
import {useTimeframe} from '@/hooks/useTimeframe';
import {useGetTeamMembersForCreditAssignment} from '@/services/query';
import {EmployeeWorkingCreditsModel} from '@/services/api/api.service';
import {useToastMessage} from '@/toast';

const UnassignedEmployeeCreditsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<UnassignEmployeeCreditsRouteProp>();
  const insets = useSafeAreaInsets();
  const {assignCreditsMonthPeriod} = useTimeframe();
  const {showToast} = useToastMessage();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [employeeList, setEmployeeList] = useState<{
    assigned: EmployeeWorkingCreditsModel[];
    unassigned: EmployeeWorkingCreditsModel[];
  }>({
    assigned: [],
    unassigned: [],
  });

  const {data: creditsAssignment} = useGetTeamMembersForCreditAssignment(
    assignCreditsMonthPeriod,
  );

  const onClose = () => {
    navigation.goBack();
  };

  const onSelectEmployee = useCallback(
    (id: string) => {
      const idIndex = _.findIndex(selectedIds, selectedId => selectedId === id);
      setSelectedIds(oldSelectedIds => {
        const newSelectedIds = [...oldSelectedIds];
        if (idIndex < 0) {
          newSelectedIds.push(id);
        } else {
          newSelectedIds.splice(idIndex, 1);
        }
        return newSelectedIds;
      });
    },
    [selectedIds],
  );

  const onViewEmployeeCreditDetails = useCallback((id: string) => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_ASSIGN_CREDITS,
        params: {
          selectedIds: [id],
          assigned: true,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const assignCredits = () => {
    setSelectedIds([]);
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_ASSIGN_CREDITS,
        params: {
          selectedIds: selectedIds,
          assigned: false,
        },
      },
    });
  };

  useEffect(() => {
    if (creditsAssignment) {
      const employeeWorkingCredits =
        creditsAssignment.employeeWorkingCreditsModelCollection || [];

      const unassignedEmployeeList = employeeWorkingCredits.filter(
        employee => employee.totalOfficeCredits === 0,
      );

      const assignedEmployeeList = employeeWorkingCredits.filter(
        employee =>
          !!employee.totalOfficeCredits && employee.totalOfficeCredits > 0,
      );

      setEmployeeList({
        unassigned: unassignedEmployeeList,
        assigned: assignedEmployeeList,
      });
    }
  }, [creditsAssignment]);

  useEffect(() => {
    if (route.params?.success) {
      showToast({
        type: 'success',
        label: 'Successfully added credits!',
        topOffset: 86,
      });

      navigation.setParams({success: false});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.success]);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        layoutStyles.cover,
        {
          backgroundColor: FWDColors.orange,
        },
      ]}>
      <View
        style={[
          layoutStyles.cover,
          {
            backgroundColor: FWDColors.white,
            paddingBottom: spacer(insets.bottom),
          },
        ]}>
        <View style={[layoutStyles.cover]}>
          <NavigationHeader
            flat
            height={64}
            title={
              <Typography
                label="Team Credits"
                variant="h2"
                color={FWDColors.white}
              />
            }
            leftAction={
              <Button
                iconOnly
                icon={<Left />}
                size="small"
                color="light"
                onPress={onClose}
              />
            }
          />
          <ScrollView
            style={[
              layoutStyles.cover,
              {
                backgroundColor: FWDColors.white,
              },
            ]}>
            <View style={{padding: spacer(24)}}>
              <Typography
                label={'Assign Work Credits for Next Month'}
                variant="h1"
                color={FWDColors.greenDarker}
                style={{marginBottom: spacer(7)}}
              />
              <Typography
                label={
                  "If you are unable to assign credits before deadline, the previous month's credit count will be followed."
                }
                variant="l3-b"
                color={FWDColors.greenDarker}
              />

              <View
                style={{
                  paddingTop: spacer(24),
                }}>
                {employeeList.unassigned.length > 0 && (
                  <View
                    style={{
                      marginBottom: spacer(24),
                    }}>
                    <TeamList
                      title="No assigned credits"
                      list={employeeList.unassigned}
                      creditStatus="unassigned"
                      selectedIds={selectedIds}
                      onSelect={onSelectEmployee}
                    />
                  </View>
                )}

                {employeeList.assigned.length > 0 && (
                  <View
                    style={{
                      marginBottom: spacer(24),
                    }}>
                    <TeamList
                      title="Assigned work credits"
                      list={employeeList.assigned}
                      creditStatus="assigned"
                      onSelect={onViewEmployeeCreditDetails}
                    />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>

        <View
          style={[
            layoutStyles.row,
            layoutStyles.centerCenter,
            {
              borderTopColor: FWDColors.grey1,
              borderTopWidth: spacer(1),
              padding: spacer(24),
            },
          ]}>
          <Button
            label={'Next'}
            onPress={assignCredits}
            style={layoutStyles.fullWidth}
            disabled={!(selectedIds.length > 0)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UnassignedEmployeeCreditsScreen;
