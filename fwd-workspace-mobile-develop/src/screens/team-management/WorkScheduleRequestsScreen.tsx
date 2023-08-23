import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/core';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useModal} from 'react-native-modalfy';
import _ from 'lodash';

import {NavigationHeader, ScheduleRequestList} from '@/views';
import {Button, Left, FWDColors, Typography, Check} from '@/components';
import {spacer, layoutStyles} from '@/utils';
import {ModalStackParamsList} from '@/modals';
import {NavigationKey, ScheduleRequestListRouteProp} from '@/navigations';
import {useGetScheduleRequests} from '@/services/query';
import {useTimeframe} from '@/hooks/useTimeframe';
import {EmployeePlanScheduleModel} from '@/services/api/api.service';
import {useToastMessage} from '@/toast';
import {CalendarWithWork} from '@/components/pictograms';

const WorkScheduleRequestsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ScheduleRequestListRouteProp>();
  const insets = useSafeAreaInsets();
  const {showToast} = useToastMessage();

  const {planSchedulePeriod} = useTimeframe();
  const {data: scheduleRequests, isLoading: scheduleRequestsLoading} =
    useGetScheduleRequests({
      ...planSchedulePeriod,
      recordStatuses: '1,2,3',
    });

  const {openModal, closeModal} = useModal<ModalStackParamsList>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const onClose = () => {
    navigation.goBack();
  };

  const onApproveMultipleSelection = (isApproveAll?: boolean) => {
    let scheduleRequestList: EmployeePlanScheduleModel[] =
      scheduleRequests?.employeePlanScheduleList || [];

    if (!isApproveAll) {
      if (selectedIds.length > 0) {
        scheduleRequestList = _.filter(scheduleRequestList, request => {
          return !!_.find(selectedIds, id => request.employeeKeyId === id);
        });
      }
    }

    openModal('ApproveMultipleScheduleSelectionModal', {
      onYesPress: () => {
        showApprovedSuccessToast();
        setSelectedIds([]);
        closeModal('ApproveMultipleScheduleSelectionModal');
      },
      onNoPress: () => {
        closeModal('ApproveMultipleScheduleSelectionModal');
      },
      scheduleRequests: scheduleRequestList,
    });
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

  const viewDetails = (item: EmployeePlanScheduleModel) => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_DETAILED_SCHEDULE_REQUEST,
        params: {
          item: item,
        },
      },
    });

    setSelectedIds([]);
  };

  const requestGroup = useMemo(() => {
    let groups: {
      pending: EmployeePlanScheduleModel[];
      approved: EmployeePlanScheduleModel[];
      declined: EmployeePlanScheduleModel[];
    } = {
      pending: [],
      approved: [],
      declined: [],
    };

    const filterGroup = (list: EmployeePlanScheduleModel[], status: number) => {
      return _.filter(list, item => item.recordStatus === status);
    };

    if (scheduleRequests?.employeePlanScheduleList) {
      groups.pending = filterGroup(
        scheduleRequests?.employeePlanScheduleList,
        1,
      );
      groups.approved = filterGroup(
        scheduleRequests?.employeePlanScheduleList,
        2,
      );
      groups.declined = filterGroup(
        scheduleRequests?.employeePlanScheduleList,
        3,
      );
    }

    return groups;
  }, [scheduleRequests]);

  const approveAllActionRenderer = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => onApproveMultipleSelection(true)}>
        <View style={[layoutStyles.row, layoutStyles.startCenter]}>
          <Check width={16} height={16} color={FWDColors.orange} />
          <Typography
            label="Approve All"
            variant="l3-b"
            color={FWDColors.orange}
            style={{
              marginLeft: spacer(4),
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const showApprovedSuccessToast = () => {
    showToast({
      type: 'success',
      label: 'Successfully approved!',
      topOffset: 86,
    });
  };

  useEffect(() => {
    if (route.params?.success) {
      showApprovedSuccessToast();
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
                label="Work Schedule Requests"
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

          {(scheduleRequests?.employeePlanScheduleList || []).length <= 0 &&
          !scheduleRequestsLoading ? (
            <View
              style={[
                layoutStyles.startCenter,
                {
                  marginTop: spacer(120),
                },
              ]}>
              <CalendarWithWork width={80} height={80} />

              <Typography
                label="No Work Schedule Requests"
                align="center"
                color={FWDColors.orange}
                variant="h2"
                style={{
                  marginTop: spacer(8),
                }}
              />
            </View>
          ) : (
            <ScrollView
              style={[
                layoutStyles.cover,
                {
                  backgroundColor: FWDColors.white,
                  paddingBottom: spacer(insets.bottom),
                },
              ]}>
              <View style={[layoutStyles.cover]}>
                <View style={{padding: spacer(24)}}>
                  <Typography
                    label={'Work Schedule Requests'}
                    variant="h1"
                    color={FWDColors.greenDarker}
                    style={{marginBottom: spacer(8)}}
                  />
                  <Typography
                    label={
                      'If you are unable to approve before deadline, all pending requests will be auto-approved.'
                    }
                    variant="l3-b"
                    color={FWDColors.greenDarker}
                  />

                  <View
                    style={{
                      paddingTop: spacer(24),
                    }}>
                    {requestGroup.pending.length > 0 && (
                      <View
                        style={{
                          marginBottom: spacer(24),
                        }}>
                        <ScheduleRequestList
                          title="Requests"
                          status={1}
                          list={requestGroup.pending}
                          selectedIds={selectedIds}
                          actionRenderer={approveAllActionRenderer}
                          onView={viewDetails}
                          onSelect={onSelectEmployee}
                        />
                      </View>
                    )}

                    {requestGroup.declined.length > 0 && (
                      <View
                        style={{
                          marginBottom: spacer(24),
                        }}>
                        <ScheduleRequestList
                          disableSelection
                          title="Amendment"
                          status={3}
                          list={requestGroup.declined}
                          onView={viewDetails}
                        />
                      </View>
                    )}

                    {requestGroup.approved.length > 0 && (
                      <View
                        style={{
                          marginBottom: spacer(24),
                        }}>
                        <ScheduleRequestList
                          disableSelection
                          title="Approved"
                          status={2}
                          list={requestGroup.approved}
                          onView={viewDetails}
                        />
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>

        {selectedIds.length > 0 ? (
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
              label={'Cancel'}
              mode="outlined"
              style={[layoutStyles.cover, {marginRight: spacer(24)}]}
              onPress={() => setSelectedIds([])}
            />
            <Button
              label={'Approve'}
              style={[layoutStyles.cover]}
              onPress={() => onApproveMultipleSelection(false)}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default WorkScheduleRequestsScreen;
