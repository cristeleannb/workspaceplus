import React, {useMemo, useState} from 'react';
import {View, TextInput} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/core';

import {NavigationHeader} from '@/views';
import {
  Button,
  Left,
  FWDColors,
  Typography,
  Advisor2,
  ShadowView,
  Avatar,
} from '@/components';
import {spacer, layoutStyles} from '@/utils';
import {NavigationKey, ScheduleRequestDeclineRouteProp} from '@/navigations';
import {EmployeePlanScheduleModel} from '@/services/api/api.service';
import {useSetScheduleRequestApproval} from '@/services/query';

const DeclineWorkScheduleScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<ScheduleRequestDeclineRouteProp>();
  const {item: employeeDetails} = route.params;

  const [messageLimit] = useState(280);
  const [declineMessage, setDeclineMessage] = useState('');

  const {
    mutateAsync: setScheduleRequestApproval,
    isLoading: setScheduleRequestApprovalLoading,
  } = useSetScheduleRequestApproval();

  const onClose = () => {
    navigation.goBack();
  };

  const declineSchedule = async () => {
    try {
      const transformedEmployee: EmployeePlanScheduleModel = {
        ...employeeDetails,
        recordStatus: 3,
        approvalMessage: declineMessage,
      };
      await setScheduleRequestApproval([transformedEmployee]);
      navigateToDeclineSuccessScreen();
    } catch (error) {
      // TODO: Handle error
      console.log('error', error);
    }
  };

  const navigateToDeclineSuccessScreen = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_DECLINE_WORK_SCHEDULE_SUCCESS,
        params: {
          item: employeeDetails,
        },
      },
    });
  };

  const messageCounter = useMemo(() => {
    let counterMessage = '';
    let counterColor = FWDColors.grey3;
    const messageLength = declineMessage.length;

    if (messageLength <= 0) {
      counterMessage = ' Maximum 280 characters';
    } else {
      counterMessage = `${messageLength}/${messageLimit}`;

      if (messageLength >= messageLimit) {
        counterColor = FWDColors.red;
      }
    }

    return (
      <Typography label={counterMessage} color={counterColor} variant="l3-b" />
    );
  }, [messageLimit, declineMessage]);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        layoutStyles.cover,
        {
          backgroundColor: FWDColors.greyLight,
          paddingBottom: spacer(insets.bottom),
        },
      ]}>
      <ScrollView
        style={[
          layoutStyles.cover,
          {
            backgroundColor: FWDColors.greyLight,
            paddingBottom: spacer(insets.bottom),
          },
        ]}>
        <View style={[layoutStyles.cover]}>
          <NavigationHeader
            flat
            height={64}
            bgColor={FWDColors.greyLight}
            leftAction={
              <Button
                iconOnly
                icon={<Left />}
                size="small"
                color="primary"
                onPress={onClose}
              />
            }
            title={
              <Typography
                label="Decline Work Schedule"
                variant="h2"
                color={FWDColors.greenDarker}
              />
            }
          />

          <View
            style={[
              layoutStyles.cover,
              {
                marginTop: spacer(24),
                paddingHorizontal: spacer(16),
              },
            ]}>
            <ShadowView
              style={[
                layoutStyles.fullWidth,
                {
                  borderRadius: spacer(8),
                  marginBottom: spacer(24),
                },
              ]}>
              <View
                style={[
                  layoutStyles.centerCenter,
                  {
                    top: spacer(-20),
                  },
                ]}>
                <View style={{marginBottom: spacer(4)}}>
                  <Avatar
                    size={64}
                    imageUrl={employeeDetails.employeeImage}
                    gender={employeeDetails.employeeGender}
                  />
                </View>
                <Typography
                  label={employeeDetails.employeeName || ''}
                  variant="h2"
                  color={FWDColors.greenDarker}
                />
                <View
                  style={[
                    layoutStyles.centerCenter,
                    layoutStyles.cover,
                    {marginTop: spacer(4), paddingHorizontal: spacer(24)},
                  ]}>
                  <View
                    style={[
                      layoutStyles.row,
                      layoutStyles.startCenter,
                      layoutStyles.fullWidth,
                    ]}>
                    <Advisor2
                      width={24}
                      height={24}
                      color={FWDColors.orange}
                      style={{
                        marginRight: spacer(4),
                      }}
                    />
                    <Typography
                      label={employeeDetails.employeePositionTitle || ''}
                      color={FWDColors.grey4}
                      variant="l2-b"
                    />
                  </View>
                </View>
              </View>

              <View
                style={[
                  {
                    paddingVertical: spacer(20),
                    paddingHorizontal: spacer(12),
                  },
                ]}>
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  maxLength={messageLimit}
                  value={declineMessage}
                  placeholder="Write a message explaining why schedule is being declined and what changes should be made..."
                  placeholderTextColor={FWDColors.grey4}
                  textAlignVertical="top"
                  style={[
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      borderRadius: spacer(4),
                      borderColor: FWDColors.grey1,
                      borderWidth: spacer(1),
                      paddingHorizontal: spacer(12),
                      paddingTop: spacer(12),
                      paddingBottom: spacer(12),
                      minHeight: spacer(114),
                      fontFamily: 'FWDCircularTT-Book',
                      fontSize: spacer(16),
                    },
                  ]}
                  onChangeText={setDeclineMessage}
                />
                <View
                  style={[
                    layoutStyles.row,
                    layoutStyles.endCenter,
                    {
                      marginTop: spacer(4),
                    },
                  ]}>
                  {messageCounter}
                </View>
              </View>
            </ShadowView>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          {
            borderTopColor: FWDColors.grey1,
            borderTopWidth: spacer(1),
            padding: spacer(24),
          },
        ]}>
        <Button
          label={'Submit'}
          disabled={!declineMessage}
          onPress={() =>
            !setScheduleRequestApprovalLoading && declineSchedule()
          }
          loading={setScheduleRequestApprovalLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default DeclineWorkScheduleScreen;
