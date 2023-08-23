import React from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/core';

import {Button, Close, FWDColors, ShadowView, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {MailSentSparkles} from '@/components/pictograms';
import {
  NavigationKey,
  ScheduleRequestDeclineSuccessRouteProp,
} from '@/navigations';
import {useStores} from '@/stores';

const DeclineWorkScheduleSuccessScreen = () => {
  const route = useRoute<ScheduleRequestDeclineSuccessRouteProp>();
  const navigation = useNavigation();

  const {item: employeeDetails} = route.params;

  const {authStore} = useStores();

  const onClose = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_WORK_SCHEDULE_REQUESTS,
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
              <MailSentSparkles
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
                paddingHorizontal: spacer(28),
              },
            ]}>
            <View>
              <Typography
                align="center"
                label={`Thanks, ${authStore.fullName}!`}
                variant="h3"
                color={FWDColors.orange}
              />
            </View>
            <View
              style={{
                marginTop: spacer(8),
              }}>
              <Text
                style={[
                  layoutStyles.textCenter,
                  {
                    lineHeight: spacer(24),
                  },
                ]}>
                <Typography
                  align="center"
                  label={'We’ll inform '}
                  variant="l1-b"
                  color={FWDColors.greenDarker}
                />
                <Typography
                  align="center"
                  label={`${employeeDetails.employeeName}`}
                  variant="h2"
                  color={FWDColors.greenDarker}
                />
                <Typography
                  align="center"
                  label={' of the changes needed.'}
                  variant="l1-b"
                  color={FWDColors.greenDarker}
                />
              </Text>
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

export default DeclineWorkScheduleSuccessScreen;
