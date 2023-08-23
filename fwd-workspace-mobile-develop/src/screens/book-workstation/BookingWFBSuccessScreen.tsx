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
} from '@/components';
import {HubSparkles, CancelHub} from '@/components/pictograms';
import {layoutStyles, spacer} from '@/utils';
import {TableOffice} from '@/components/pictograms';
import {BookingWFBSuccessScreenRouteProp, NavigationKey} from '@/navigations';
import {BookingDate} from '@/views';
import {QueryKeys} from '@/services/query/config';

const BookingWFBSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<BookingWFBSuccessScreenRouteProp>();
  const queryClient = useQueryClient();

  const {type, workstation, selectedDates} = route.params;

  const onClose = () => {
    queryClient.refetchQueries([QueryKeys.DASHBOARD_CURRENT_SCHEDULE]);
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_BOOK_WORKSTATION,
      },
    });
  };

  const bookingConfig = useMemo(() => {
    switch (type) {
      case 'reserve':
        return {
          title: 'Branch Reserved!',
          icon: <HubSparkles height={80} width={80} />,
          note: (
            <Typography
              label={`Please be on time. If you're unable to arrive at your workstation within the 1 hour grace period, your reservation will be cancelled and you will be penalized.
                    \nYou can only modify your reservation at least 24 hours before your check-in time.`}
              variant="l3-b"
              color={FWDColors.grey4}
              style={[layoutStyles.cover]}
            />
          ),
          btnPrimaryLabel: 'Okay',
          btnSecondaryLabel: 'Book Again',
        };

      case 'change':
        return {
          title: 'Branch Changed!',
          icon: <HubSparkles height={80} width={80} />,
          note: (
            <Typography
              label={
                'You can only modify your reservation at least 24 hours before your check-in time.'
              }
              variant="l3-b"
              color={FWDColors.grey4}
              style={[layoutStyles.cover]}
            />
          ),
          btnPrimaryLabel: 'Okay',
          btnSecondaryLabel: 'Book Again',
        };

      case 'cancel':
        return {
          title: 'Reservation Cancelled',
          icon: <CancelHub height={72} width={72} />,
          note: undefined,
          btnPrimaryLabel: 'Okay',
          btnSecondaryLabel: 'Book Again',
        };

      default:
        return {
          title: '',
          icon: undefined,
          note: undefined,
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
                label={workstation}
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

            {bookingConfig.note && (
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
                  {bookingConfig.note}
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

export default BookingWFBSuccessScreen;
