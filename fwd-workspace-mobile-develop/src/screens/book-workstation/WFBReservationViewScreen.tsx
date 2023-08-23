import React, {useEffect, useMemo} from 'react';
import {View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/core';
import {WorkStationWFBViewScreenRouteProp} from '@/navigations';
import {format} from 'date-fns';

import {
  BookingDate,
  BranchOffice,
  FullScreenLoader,
  NavigationHeader,
} from '@/views';
import {Button, Left, FWDColors, Typography} from '@/components';
import {spacer, layoutStyles} from '@/utils';
import {TableOffice} from '@/components/pictograms';
import {useGetBranchPrefix, useGetWFBReservation} from '@/services/query';

const formatDate = (date?: Date) => {
  return date ? format(new Date(date), 'EEE, d MMM') : '';
};

const WFBReservationViewScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute<WorkStationWFBViewScreenRouteProp>();
  const insets = useSafeAreaInsets();

  const {data: branchPrefix} = useGetBranchPrefix();
  const {data: reservationData, isError} = useGetWFBReservation(
    params.planScheduleDatesId,
  );

  const onClose = () => {
    navigation.goBack();
  };

  const branch = useMemo(() => {
    return reservationData?.branch;
  }, [reservationData]);

  useEffect(() => {
    if (isError) {
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  if (!reservationData || !branch || !branchPrefix) {
    return <FullScreenLoader />;
  }

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
            backgroundColor: FWDColors.greyLight,
          },
        ]}>
        <View style={[layoutStyles.cover]}>
          <NavigationHeader
            flat
            height={64}
            title={
              <Typography
                label="View Workstation"
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
          <View style={[layoutStyles.cover]}>
            <View style={{padding: spacer(24)}}>
              <BranchOffice
                showInitial
                branchPrefix={branchPrefix}
                branchName={`${branch.branchName}`}
                branchAddress={`${branch.branchAddress}`}
                branchOfficeHours={`${branch.branchOfficeHours}`}
                branchContactNumber={`${branch.branchContactNumber}`}
              />
            </View>
          </View>
        </View>

        <View
          style={[
            {
              borderTopLeftRadius: spacer(16),
              borderTopRightRadius: spacer(16),
              padding: spacer(24),
              backgroundColor: FWDColors.white,
              paddingBottom: spacer(insets.bottom + 24),
            },
          ]}>
          <View>
            <Typography
              label="Workstation"
              variant="l3-b"
              color={FWDColors.grey3}
            />
          </View>
          <View
            style={[
              layoutStyles.row,
              layoutStyles.startStart,
              {marginTop: spacer(4)},
            ]}>
            <View
              style={[
                layoutStyles.centerCenter,
                {
                  paddingHorizontal: spacer(2),
                  marginRight: spacer(6),
                },
              ]}>
              <TableOffice width={20} height={20} />
            </View>

            <Typography
              label={`${branchPrefix} - ${
                reservationData.branch?.branchName || ''
              }`}
              variant="h1"
              style={[layoutStyles.cover]}
            />
          </View>

          <View style={{marginTop: spacer(24), marginBottom: spacer(4)}}>
            <Typography
              label="Selected Date"
              variant="l3-b"
              color={FWDColors.grey3}
            />
          </View>

          <View>
            <BookingDate text={formatDate(reservationData.branchSchedule)} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WFBReservationViewScreen;
