import React, {useMemo} from 'react';
import {View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/core';
import {useQueryClient} from 'react-query';

import {
  Button,
  Close,
  FWDColors,
  Typography,
  ShadowView,
  ExclamationCircle,
  Parking,
} from '@/components';
import {ParkingSparkles, ParkingCancel} from '@/components/pictograms';
import {layoutStyles, spacer} from '@/utils';
import {ParkingSuccessScreenRouteProp, NavigationKey} from '@/navigations';
import {BookingDate} from '@/views';
import {QueryKeys} from '@/services/query/config';

const ParkingSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ParkingSuccessScreenRouteProp>();
  const queryClient = useQueryClient();

  const {type, parkingSlot, selectedDates} = route.params;

  const onClose = () => {
    queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_RESERVE_PARKING,
      },
    });
  };

  const bookingConfig = useMemo(() => {
    switch (type) {
      case 'reserve':
        return {
          title: 'Parking Slot Reserved!',
          icon: <ParkingSparkles height={80} width={80} />,
          showNote: true,
          btnPrimaryLabel: 'Okay',
          btnSecondaryLabel: 'Book Again',
        };

      case 'change':
        return {
          title: 'Parking Slot Changed!',
          icon: <ParkingSparkles height={80} width={80} />,
          showNote: true,
          btnPrimaryLabel: 'Okay',
          btnSecondaryLabel: 'Change Another Parking Slot',
        };

      case 'cancel':
        return {
          title: 'Reservation Cancelled',
          icon: <ParkingCancel height={72} width={72} />,
          showNote: false,
          btnPrimaryLabel: 'Okay',
          btnSecondaryLabel: 'Book Again',
        };

      default:
        return {
          title: '',
          icon: undefined,
          showNote: false,
          btnPrimaryLabel: undefined,
          btnSecondaryLabel: undefined,
        };
    }
  }, [type]);

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
            {bookingConfig.icon && (
              <ShadowView
                style={[
                  layoutStyles.centerCenter,
                  layoutStyles.absolute,
                  {
                    elevation: spacer(6),
                    backgroundColor: FWDColors.white,
                    borderRadius: spacer(999),
                    width: spacer(105),
                    height: spacer(105),
                  },
                ]}>
                {bookingConfig.icon}
              </ShadowView>
            )}
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
                label={bookingConfig.title}
                variant="h2"
                color={FWDColors.greenDarker}
              />
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
                <Parking width={20} height={20} color={FWDColors.orange} />
              </View>

              <Typography
                label={parkingSlot}
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
              {selectedDates.map((d, i) => (
                <BookingDate key={i} text={d} />
              ))}
            </ScrollView>

            {bookingConfig.showNote && (
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
                    label={`You can only modify your reservation at least 24 hours before your check-in time.
                    \nPlease be on time. If you're unable to arrive at your parking slot within the 1 hour grace period, your reservation will be cancelled and you will be penalized.`}
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
            <Button
              label={bookingConfig.btnPrimaryLabel || ''}
              mode="contained"
              onPress={onClose}
            />

            <Button
              label={bookingConfig.btnSecondaryLabel || ''}
              mode="outlined"
              style={{marginTop: spacer(24)}}
              onPress={navigation.goBack}
            />
          </View>
        </ShadowView>
      </View>
    </SafeAreaView>
  );
};

export default ParkingSuccessScreen;
