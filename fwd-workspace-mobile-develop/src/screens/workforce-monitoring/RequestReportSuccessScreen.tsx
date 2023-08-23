import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';

import {Button, Close, FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {MailSent} from '@/components/pictograms';
import {NavigationKey} from '@/navigations';

const RequestReportSuccessScreen = () => {
  const navigation = useNavigation();

  const onClose = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_WORKFORCE_MONITORING,
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
        <View
          style={[
            layoutStyles.relative,
            {
              backgroundColor: FWDColors.white,
              borderTopLeftRadius: spacer(24),
              borderTopRightRadius: spacer(24),
              borderBottomLeftRadius: spacer(24),
            },
          ]}>
          <View style={[layoutStyles.centerCenter]}>
            <View
              style={[
                layoutStyles.centerCenter,
                layoutStyles.absolute,
                {
                  elevation: spacer(6),
                  backgroundColor: FWDColors.white,
                  borderRadius: 100 / 2,
                  padding: spacer(8),
                },
              ]}>
              <MailSent width={80} height={80} color={FWDColors.orange} />
            </View>
          </View>

          <View
            style={[
              {
                paddingTop: spacer(72),
                paddingHorizontal: spacer(28),
              },
            ]}>
            <View>
              <Typography
                align="center"
                label="Request Workforce Report Submitted!"
                variant="h3"
                color={FWDColors.orange}
              />
            </View>
            <View
              style={{
                marginTop: spacer(8),
              }}>
              <Typography
                align="center"
                label="A detailed report will be emailed to you as soon as possible."
                variant="l1-b"
                color={FWDColors.greenDarker}
              />
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: spacer(20),
              paddingBottom: spacer(32),
              marginTop: spacer(56),
            }}>
            <Button label="Okay" mode="contained" onPress={onClose} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RequestReportSuccessScreen;
