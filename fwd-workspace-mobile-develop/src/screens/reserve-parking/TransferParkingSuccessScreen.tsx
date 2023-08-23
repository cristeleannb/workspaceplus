import React, {memo} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';

import {
  Button,
  Close,
  FWDColors,
  Typography,
  ShadowView,
  Calendar,
} from '@/components';
import {ParkingSparkles, ParkingP} from '@/components/pictograms';
import {layoutStyles, spacer} from '@/utils';
import {NavigationKey} from '@/navigations';
import {useTransferParking} from '@/hooks/useTransferParking';

interface BookingDateProps {
  text: string;
}

const BookingDate = memo(({text}: BookingDateProps) => {
  return (
    <View
      style={[
        layoutStyles.row,
        layoutStyles.startCenter,
        {marginBottom: spacer(8)},
      ]}>
      <View style={[layoutStyles.centerCenter, {paddingHorizontal: spacer(2)}]}>
        <Calendar width={20} height={20} color={FWDColors.orange} />
      </View>

      <Typography label={text} variant="h1" style={[layoutStyles.cover]} />
    </View>
  );
});

const TransferParkingSuccessScreen = () => {
  const navigation = useNavigation();

  const {
    selectedSlot,
    selectedEmployee,
    selectedDatesSuccess,
    newTransferParking,
    clearTransferParking,
  } = useTransferParking();

  const onClose = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_LANDING,
      },
    });
    clearTransferParking();
  };

  const onBookAgain = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_TRANSFER_PARKING,
      },
    });
    newTransferParking();
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
                {
                  elevation: spacer(6),
                  backgroundColor: FWDColors.white,
                  borderRadius: spacer(105),
                  padding: spacer(20),
                },
              ]}>
              <ParkingSparkles
                width={80}
                height={80}
                color={FWDColors.orange}
              />
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
                label="Parking Transferred!"
                variant="h2"
                color={FWDColors.greenDarker}
              />

              <Text style={[layoutStyles.textCenter, {marginTop: spacer(8)}]}>
                <Typography
                  align="center"
                  label="We've notified "
                  variant="l2-b"
                  color={FWDColors.greenDarker}
                />

                <Typography
                  align="center"
                  label={selectedEmployee?.employeeName || ''}
                  variant="h1"
                  color={FWDColors.greenDarker}
                />

                <Typography
                  align="center"
                  label={` that you've transferred your parking space to ${
                    selectedEmployee?.employeeGender === 'm' ? 'him' : 'her'
                  } on the date/s below.`}
                  variant="l2-b"
                  color={FWDColors.greenDarker}
                />
              </Text>
            </View>

            <View style={{marginTop: spacer(24)}}>
              <Typography
                label="Parking Slot"
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
                <ParkingP width={20} height={20} />
              </View>

              <Typography
                label={`Basement ${selectedSlot?.floor}, ${
                  selectedSlot?.slot || ''
                }`}
                variant="h1"
                style={[layoutStyles.cover]}
              />
            </View>

            <View style={{marginTop: spacer(24), marginBottom: spacer(4)}}>
              <Typography
                label="Selected Dates"
                variant="l3-b"
                color={FWDColors.grey3}
              />
            </View>

            <ScrollView bounces={false} style={{maxHeight: spacer(28 * 5)}}>
              {selectedDatesSuccess.map((d, i) => (
                <BookingDate key={i} text={d} />
              ))}
            </ScrollView>
          </View>

          <View
            style={{
              paddingHorizontal: spacer(16),
              paddingBottom: spacer(24),
              marginTop: spacer(20),
            }}>
            <Button label="Okay" mode="contained" onPress={onClose} />

            <Button
              label="Book Again"
              mode="outlined"
              style={{marginTop: spacer(24)}}
              onPress={onBookAgain}
            />
          </View>
        </ShadowView>
      </View>
    </SafeAreaView>
  );
};

export default TransferParkingSuccessScreen;
