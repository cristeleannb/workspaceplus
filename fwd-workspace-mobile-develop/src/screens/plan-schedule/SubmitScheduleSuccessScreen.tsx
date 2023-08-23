import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/core';
import {format} from 'date-fns';

import {Button, Close, FWDColors, Typography, ShadowView} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {MailSentSparkles} from '@/components/pictograms';
import {NavigationKey, ScheduleSubmitRouteProp} from '@/navigations';
import {useTimeframe} from '@/hooks/useTimeframe';

const SubmitScheduleSuccessScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute<ScheduleSubmitRouteProp>();
  const {planScheduleDate} = useTimeframe();

  const [employeeName, setEmployeeName] = useState(params.name || '');

  const onClose = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_LANDING,
        params: {
          submitScheduleSuccess: true,
        },
      },
    });
  };

  useEffect(() => {
    setEmployeeName(params.name);
  }, [params.name]);

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
                label={`Thanks, ${employeeName}!`}
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
                label={`You have successfully submitted your ${format(
                  planScheduleDate,
                  'MMMM',
                )} schedule.`}
                variant="l1-b"
                color={FWDColors.greenDarker}
              />
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: spacer(20),
              paddingBottom: spacer(24),
              marginTop: spacer(32),
            }}>
            <Button label="Okay" mode="contained" onPress={onClose} />
          </View>
        </ShadowView>
      </View>
    </SafeAreaView>
  );
};

export default SubmitScheduleSuccessScreen;
