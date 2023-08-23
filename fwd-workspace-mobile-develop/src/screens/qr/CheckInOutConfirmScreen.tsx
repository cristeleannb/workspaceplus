import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/core';
import {format} from 'date-fns';

import {
  Button,
  Close,
  FWDColors,
  Typography,
  ShadowView,
  ExclamationCircle,
  Parking,
} from '@/components';
import {
  CheckInOut,
  ParkingCheckInOut,
  TableOffice,
} from '@/components/pictograms';
import {layoutStyles, spacer} from '@/utils';
import {CheckInOutConfirmScreenRouteProp, NavigationKey} from '@/navigations';
import {BookingDate} from '@/views';

import {CheckType, QRType} from '@/services/api/api.service';

const formatDate = (date?: Date) => {
  return date ? format(new Date(date), 'EEE, d MMM, h:mm aa') : '';
};

const CheckInOutConfirmScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<CheckInOutConfirmScreenRouteProp>();

  const {qrResponse} = route.params;

  const {code, checkTime, divisionName, checkType, qrType, parkingFloor} =
    qrResponse;

  const onClose = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_LANDING,
      },
    });
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        {
          backgroundColor: FWDColors.orange,
          paddingHorizontal: spacer(20),
        },
      ]}>
      <View style={[layoutStyles.centerCenter, layoutStyles.fullHeight]}>
        <View
          style={[
            layoutStyles.absolute,
            {
              elevation: spacer(6),
              top: spacer(24),
              left: spacer(0),
            },
          ]}>
          <Button
            iconOnly
            icon={<Close />}
            size="small"
            color="light"
            onPress={onClose}
          />
        </View>
        <ShadowView
          style={[
            layoutStyles.fullWidth,
            {
              backgroundColor: FWDColors.white,
              borderTopLeftRadius: spacer(24),
              borderTopRightRadius: spacer(24),
              borderBottomLeftRadius: spacer(24),
            },
          ]}>
          <View style={[layoutStyles.centerCenter]}>
            <ShadowView
              style={[
                layoutStyles.centerCenter,
                layoutStyles.absolute,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  elevation: spacer(6),
                  backgroundColor: 'transparent',
                  borderRadius: spacer(999),
                  width: spacer(150),
                  height: spacer(150),
                },
              ]}>
              {qrType === QRType.Workstation ? (
                <CheckInOut height="100%" width="100%" />
              ) : (
                <ParkingCheckInOut height="100%" width="100%" />
              )}
            </ShadowView>
          </View>

          <View
            style={[
              {
                paddingTop: spacer(72),
                paddingHorizontal: spacer(16),
              },
            ]}>
            <View>
              <Typography
                align="center"
                label={`${
                  checkType === CheckType.CheckIn ? 'Check-in' : 'Checkout'
                } confirmed!`}
                variant="h2"
                color={FWDColors.greenDarker}
              />
            </View>

            <View style={{marginTop: spacer(24)}}>
              <Typography
                label={
                  qrType === QRType.Workstation ? 'Workstation' : 'Parking Slot'
                }
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
                {qrType === QRType.Workstation ? (
                  <TableOffice width={20} height={20} />
                ) : (
                  <Parking width={20} height={20} color={FWDColors.orange} />
                )}
              </View>

              {qrType === QRType.Workstation ? (
                <Typography
                  label={`${divisionName}, Seat ${code}`}
                  variant="h1"
                  style={[layoutStyles.cover]}
                />
              ) : (
                <Typography
                  label={`Basement ${parkingFloor}, ${code}`}
                  variant="h1"
                  style={[layoutStyles.cover]}
                />
              )}
            </View>

            <View style={{marginTop: spacer(24), marginBottom: spacer(4)}}>
              <Typography label="Date" variant="l3-b" color={FWDColors.grey3} />
            </View>

            {/* Date */}
            <BookingDate text={formatDate(checkTime)} />

            {qrType === QRType.Workstation && checkType === CheckType.CheckIn && (
              <View
                style={[
                  layoutStyles.row,
                  layoutStyles.startStart,
                  {
                    backgroundColor: FWDColors.yellow20,
                    padding: spacer(8),
                    marginTop: spacer(16),
                    borderTopLeftRadius: spacer(8),
                    borderTopRightRadius: spacer(8),
                    borderBottomLeftRadius: spacer(8),
                  },
                ]}>
                <View
                  style={[
                    layoutStyles.centerCenter,
                    {
                      padding: spacer(2),
                      marginRight: spacer(8),
                    },
                  ]}>
                  <ExclamationCircle
                    height={20}
                    width={20}
                    color={FWDColors.orange}
                  />
                </View>

                <View style={[layoutStyles.cover, layoutStyles.row]}>
                  <Typography
                    label="Practice physical distancing by avoiding unnecessary travel and staying away from large groups of people."
                    variant="l3-b"
                    color={FWDColors.grey4}
                    style={[layoutStyles.cover]}
                  />
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              paddingHorizontal: spacer(16),
              paddingBottom: spacer(24),
              marginTop: spacer(20),
            }}>
            <Button label="Okay" mode="contained" onPress={onClose} />
          </View>
        </ShadowView>
      </View>
    </SafeAreaView>
  );
};

export default CheckInOutConfirmScreen;
