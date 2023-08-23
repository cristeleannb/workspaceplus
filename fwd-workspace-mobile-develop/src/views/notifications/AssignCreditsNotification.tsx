import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {AngleRightThick, FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {AssignForNextMonth} from '@/components/pictograms';
import {NavigationKey} from '@/navigations';
import {useTimeframe} from '@/hooks/useTimeframe';

const AssignCreditsNotification = () => {
  const navigation = useNavigation();
  const {creditsAssignmentDeadline} = useTimeframe();

  const assignCredits = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_UNASSIGNED_EMPLOYEE_CREDITS,
      },
    });
  };

  return (
    <View
      style={[
        layoutStyles.fullWidth,
        layoutStyles.row,
        {
          backgroundColor: FWDColors.red5,
          padding: spacer(12),
          borderTopLeftRadius: spacer(8),
          borderTopRightRadius: spacer(8),
        },
      ]}>
      <AssignForNextMonth width={40} height={40} />
      <View style={{marginLeft: spacer(10)}}>
        <Typography
          label={'Assign Work Credits for Next Month'}
          variant="h1"
          color={FWDColors.greenDarker}
        />
        <Typography
          label={`Deadline is on ${creditsAssignmentDeadline}`}
          variant="l3-b"
          color={FWDColors.greenDarker}
          style={{marginTop: spacer(4)}}
        />
        <TouchableOpacity
          style={[
            layoutStyles.row,
            layoutStyles.startCenter,
            {
              marginTop: spacer(12),
            },
          ]}
          onPress={assignCredits}>
          <Typography
            label={'Assign Now'}
            variant="l3-m"
            color={FWDColors.orange}
          />
          <AngleRightThick
            width={16}
            height={16}
            color={FWDColors.orange}
            style={{marginLeft: spacer(6)}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AssignCreditsNotification;
