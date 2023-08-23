import React from 'react';
import {View, FlatList} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {useModal} from 'react-native-modalfy';

import {Button, Left, FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {NavigationHeader, WorkstationSeat} from '@/views';
import {ModalStackParamsList} from '@/modals';
import {NavigationKey} from '@/navigations';

import {useGetBranchPrefix, useGetUpcomingReservations} from '@/services/query';
import {
  UpcomingReservationResponse,
  WorkType,
} from '@/services/api/api.service';

const UpcomingReservationsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {data: upcomingReservationData} = useGetUpcomingReservations();
  const {data: branchPrefix} = useGetBranchPrefix();

  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const onPressBookOffice = (
    type: 'view' | 'change' | 'reserve' | 'cancel' = 'reserve',
    data?: UpcomingReservationResponse,
  ) => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_WORKSTATION_SELECT,
        params: data
          ? {
              viewReservation: type === 'view' ? data : undefined,
              changeReservation: type === 'change' ? data : undefined,
              cancelReservation: type === 'cancel' ? data : undefined,
            }
          : {},
      },
    });
  };

  const onPressBookBranch = (
    type: 'view' | 'change' | 'reserve' | 'cancel' = 'reserve',
    data?: UpcomingReservationResponse,
  ) => {
    if (type === 'view') {
      if (!data?.planScheduleDatesId) {
        return true;
      }

      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_WORK_FROM_BRANCH_VIEW,
          params: {
            planScheduleDatesId: data.planScheduleDatesId,
          },
        },
      });
    } else {
      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_WORK_FROM_BRANCH,
          params: data
            ? {
                changeReservation: type === 'change' ? data : undefined,
                cancelReservation: type === 'cancel' ? data : undefined,
              }
            : {},
        },
      });
    }
  };

  const onPressViewSeat = (wsData: UpcomingReservationResponse) => {
    const label =
      wsData.workType === WorkType.WFO
        ? `Seat ${wsData.seatCode}`
        : branchPrefix || '';

    const date =
      wsData.workType === WorkType.WFO
        ? wsData.workstationSchedule
        : wsData.branchSchedule;

    openModal('BookSeatModal', {
      label: label || '',
      date,
      onPressView: () => {
        closeModal('BookSeatModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          if (wsData.workType === WorkType.WFO) {
            onPressBookOffice('view', wsData);
          } else if (wsData.workType === WorkType.WFB) {
            onPressBookBranch('view', wsData);
          }
        }, 150);
      },
      onPressChange: () => {
        closeModal('BookSeatModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          if (wsData.workType === WorkType.WFO) {
            onPressBookOffice('change', wsData);
          } else if (wsData.workType === WorkType.WFB) {
            onPressBookBranch('change', wsData);
          }
        }, 150);
      },
      onPressCancel: () => {
        closeModal('BookSeatModal');

        // encountered a timing issue, adding a timeout of 150ms
        setTimeout(() => {
          if (wsData.workType === WorkType.WFO) {
            onPressBookOffice('cancel', wsData);
          } else if (wsData.workType === WorkType.WFB) {
            onPressBookBranch('cancel', wsData);
          }
        }, 150);
      },
    });
  };

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
            height={72}
            title={
              <Typography
                label="Book a Workstation"
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
                onPress={navigation.goBack}
              />
            }
          />

          <View
            style={[
              layoutStyles.cover,
              {
                paddingTop: spacer(16),
                paddingBottom: spacer(24),
              },
            ]}>
            <FlatList
              data={upcomingReservationData}
              keyExtractor={d => `${d.planScheduleDatesId}`}
              renderItem={({item}) => (
                <WorkstationSeat
                  {...item}
                  branchPrefix={branchPrefix}
                  onPress={() => onPressViewSeat(item)}
                />
              )}
              ItemSeparatorComponent={() => (
                <View style={{paddingVertical: spacer(0)}} />
              )}
              style={{
                paddingHorizontal: spacer(32),
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UpcomingReservationsScreen;
