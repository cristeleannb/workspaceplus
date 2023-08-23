import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/core';
import {ScrollView} from 'react-native-gesture-handler';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import {NavigationHeader, TeamList} from '@/views';
import {Button, Left, FWDColors, Typography, ShadowView} from '@/components';
import {spacer, layoutStyles} from '@/utils';
import {AssignCreditsRouteProp, NavigationKey} from '@/navigations';
import {
  useGetMonthWorkingCredits,
  useGetTeamMembersForCreditAssignment,
  useSaveTeamMembersCredits,
} from '@/services/query';
import {EmployeeWorkingCreditsModel} from '@/services/api/api.service';
import {useTimeframe} from '@/hooks/useTimeframe';

const AssignCreditsScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute<AssignCreditsRouteProp>();
  const insets = useSafeAreaInsets();

  const [selectedIds] = useState<string[]>(params.selectedIds);
  const [assigned] = useState<boolean>(params.assigned);
  const {assignCreditsMonthPeriod, assignCreditsCurrentMonthPeriodFormatted} =
    useTimeframe();

  const [remoteCredits, setRemoteCredits] = useState(0);
  const [totalRemoteCredits, setTotalRemoteCredits] = useState(0);

  const [employeeList, setEmployeeList] = useState<
    EmployeeWorkingCreditsModel[]
  >([]);
  const [employeeListWithCredits, setEmployeeListWithCredits] = useState<
    EmployeeWorkingCreditsModel[]
  >([]);

  const {data: monthWorkingCredits} = useGetMonthWorkingCredits(
    assignCreditsMonthPeriod,
  );
  const {data: creditsAssignment} = useGetTeamMembersForCreditAssignment(
    assignCreditsMonthPeriod,
  );
  const {
    mutateAsync: saveTeamMembersCredits,
    isLoading: saveTeamMembersCreditsLoading,
  } = useSaveTeamMembersCredits();

  const creditsCounter = useMemo(() => {
    const office = monthWorkingCredits?.totalOfficeCredits || 0;
    const remote = monthWorkingCredits?.totalRemoteCredits || 0;
    const total = office + remote;

    return {
      office,
      remote,
      total,
    };
  }, [monthWorkingCredits]);

  const onClose = () => {
    navigation.goBack();
  };

  const goToTeamMembersForAssignmentScreen = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_UNASSIGNED_EMPLOYEE_CREDITS,
        params: {
          success: true,
        },
      },
    });
  };

  const assignCreditsSuccess = async () => {
    try {
      await saveTeamMembersCredits({
        body: employeeListWithCredits,
        period: assignCreditsMonthPeriod,
      });

      goToTeamMembersForAssignmentScreen();
    } catch (error) {
      // TODO: Handle error
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (monthWorkingCredits && !assigned) {
      setRemoteCredits(monthWorkingCredits.totalRemoteCredits || 0);
      setTotalRemoteCredits(monthWorkingCredits.totalRemoteCredits || 0);
    }
  }, [monthWorkingCredits, assigned]);

  useEffect(() => {
    if (creditsAssignment) {
      const employeeWorkingCredits =
        creditsAssignment.employeeWorkingCreditsModelCollection || [];

      const selectedEmployeeList = employeeWorkingCredits.filter(employee =>
        selectedIds.includes(employee.employeeKeyId || ''),
      );

      if (assigned) {
        setRemoteCredits(selectedEmployeeList?.[0].totalRemoteCredits || 0);
        setTotalRemoteCredits(
          selectedEmployeeList?.[0].totalRemoteCredits || 0,
        );
      }
      setEmployeeList(selectedEmployeeList);
    }
  }, [creditsAssignment, selectedIds, assigned]);

  useEffect(() => {
    if (monthWorkingCredits) {
      let officeCredits = creditsCounter.total - remoteCredits;

      const newEmployeeListWithCredits: EmployeeWorkingCreditsModel[] =
        employeeList.map(employee => ({
          ...employee,
          totalRemoteCredits: remoteCredits,
          totalOfficeCredits: officeCredits,
          month: assignCreditsMonthPeriod.month,
          year: assignCreditsMonthPeriod.year,
        }));

      setEmployeeListWithCredits(newEmployeeListWithCredits);
    }
  }, [
    remoteCredits,
    employeeList,
    monthWorkingCredits,
    assignCreditsMonthPeriod,
    creditsCounter,
  ]);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        layoutStyles.cover,
        {
          backgroundColor: FWDColors.greyLight,
        },
      ]}>
      <View
        style={[
          layoutStyles.cover,
          {
            backgroundColor: !assigned ? FWDColors.white : FWDColors.greyLight,
            paddingBottom: spacer(insets.bottom),
          },
        ]}>
        <View
          style={[
            layoutStyles.cover,
            {
              backgroundColor: FWDColors.white,
            },
          ]}>
          <View
            style={[
              layoutStyles.cover,
              {
                backgroundColor: FWDColors.greyLight,
              },
            ]}>
            <NavigationHeader
              flat
              height={64}
              bgColor={FWDColors.greyLight}
              leftAction={
                <Button
                  iconOnly
                  icon={<Left />}
                  size="small"
                  color="primary"
                  onPress={onClose}
                />
              }
            />

            <View
              style={[
                layoutStyles.cover,
                {
                  paddingHorizontal: spacer(16),
                },
              ]}>
              <ShadowView
                style={[
                  layoutStyles.fullWidth,
                  {
                    borderRadius: spacer(8),
                    marginBottom: spacer(24),
                  },
                ]}>
                <View
                  style={[
                    layoutStyles.fullWidth,
                    {
                      padding: spacer(24),
                    },
                  ]}>
                  <View
                    style={[
                      layoutStyles.fullWidth,
                      layoutStyles.centerCenter,

                      {
                        marginTop: spacer(4),
                      },
                    ]}>
                    <Typography
                      label={`${creditsCounter.total} total working days for ${assignCreditsCurrentMonthPeriodFormatted}. Maximum of ${creditsCounter.remote} WFA credits only.`}
                      color={FWDColors.greenDarker}
                      variant="l1-m"
                      align="center"
                      style={
                        (layoutStyles.textCenter, {marginBottom: spacer(32)})
                      }
                    />

                    <View
                      style={[
                        layoutStyles.row,
                        layoutStyles.fullWidth,
                        layoutStyles.betweenStart,
                        {
                          marginBottom: spacer(20),
                        },
                      ]}>
                      <View
                        style={[
                          layoutStyles.centerCenter,
                          {
                            backgroundColor: FWDColors.greyLight,
                            paddingHorizontal: spacer(12),
                            paddingVertical: spacer(8),
                            borderRadius: spacer(8),
                          },
                        ]}>
                        <Typography
                          label={remoteCredits}
                          variant="h5"
                          color={FWDColors.greenDarker}
                        />

                        <Typography
                          label={'WFA/WFB'}
                          variant="l3-m"
                          color={FWDColors.greenDarker}
                        />
                      </View>

                      <View
                        style={[
                          layoutStyles.centerCenter,
                          {
                            backgroundColor: FWDColors.orange20,
                            paddingHorizontal: spacer(12),
                            paddingVertical: spacer(8),
                            borderRadius: spacer(8),
                            width: spacer(96),
                          },
                        ]}>
                        <Typography
                          label={creditsCounter.total - remoteCredits}
                          variant="h5"
                          color={FWDColors.greenDarker}
                        />

                        <Typography
                          label={'WFO'}
                          variant="l3-m"
                          color={FWDColors.orange}
                        />
                      </View>
                    </View>

                    <MultiSlider
                      enabledOne={!assigned}
                      enabledTwo={!assigned}
                      min={0}
                      max={monthWorkingCredits?.totalWorkingCredits}
                      values={[
                        totalRemoteCredits,
                        totalRemoteCredits + 1,
                        totalRemoteCredits + 2,
                      ]}
                      trackStyle={{
                        height: spacer(80),
                      }}
                      containerStyle={{height: spacer(80)}}
                      markerContainerStyle={{
                        height: spacer(130),
                      }}
                      selectedStyle={{
                        backgroundColor:
                          remoteCredits === 0
                            ? FWDColors.white
                            : FWDColors.greenDarker,
                        borderTopLeftRadius: spacer(6),
                        borderBottomLeftRadius: spacer(6),
                        borderRightWidth: spacer(1),
                        borderRightColor: FWDColors.white,
                      }}
                      unselectedStyle={{
                        backgroundColor: FWDColors.orange,
                        borderTopRightRadius: spacer(6),
                        borderBottomRightRadius: spacer(6),
                        borderTopLeftRadius:
                          remoteCredits === 0 ? spacer(6) : spacer(0),
                        borderBottomLeftRadius:
                          remoteCredits === 0 ? spacer(6) : spacer(0),
                        borderLeftWidth: spacer(1),
                        borderLeftColor: FWDColors.white,
                      }}
                      onValuesChange={e => {
                        if (e[0] > totalRemoteCredits) {
                          setRemoteCredits(totalRemoteCredits);
                        } else {
                          setRemoteCredits(e[0]);
                        }
                      }}
                      onValuesChangeFinish={e => {
                        if (e[0] > totalRemoteCredits) {
                          setRemoteCredits(totalRemoteCredits);
                        } else {
                          setRemoteCredits(e[0]);
                        }
                      }}
                      customMarker={_ => {
                        return (
                          <ShadowView
                            style={{
                              paddingHorizontal: spacer(13),
                              paddingVertical: spacer(10),
                              borderRadius: spacer(8),
                              borderColor: FWDColors.white,
                              marginLeft: spacer(remoteCredits === 0 ? 10 : 0),
                            }}>
                            <View
                              style={{
                                backgroundColor: FWDColors.orange70,
                                height: spacer(28),
                                width: spacer(3),
                              }}
                            />
                          </ShadowView>
                        );
                      }}
                      snapped={true}
                    />
                  </View>
                </View>
              </ShadowView>

              <Typography
                label={!assigned ? 'Employee/s to assign' : 'Assigned to'}
                variant="h1"
                color={FWDColors.greenDarker}
                style={{marginLeft: spacer(8), marginBottom: spacer(16)}}
              />

              <ScrollView
                style={[
                  layoutStyles.cover,
                  layoutStyles.fullWidth,
                  {
                    paddingHorizontal: spacer(8),
                    borderRadius: spacer(8),
                    backgroundColor: FWDColors.greyLight,
                  },
                ]}>
                <TeamList
                  title="Assigned work credits"
                  list={employeeList}
                  disableSelection
                  hideHeader
                  creditStatus="unassigned"
                  style={{
                    marginTop: spacer(0),
                  }}
                />
              </ScrollView>
            </View>
          </View>
        </View>

        {!assigned && (
          <View
            style={[
              layoutStyles.centerCenter,
              {
                backgroundColor: FWDColors.white,
                borderTopColor: FWDColors.grey1,
                borderTopWidth: spacer(1),
                padding: spacer(24),
              },
            ]}>
            <Button
              label={'Submit'}
              disabled={employeeListWithCredits.length === 0}
              loading={saveTeamMembersCreditsLoading}
              style={layoutStyles.fullWidth}
              onPress={assignCreditsSuccess}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AssignCreditsScreen;
