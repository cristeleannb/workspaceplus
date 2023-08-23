import React from 'react';
import {View} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';

import {layoutStyles, spacer} from '@/utils';
import {Button, FWDColors, IconButton, Typography} from '@/components';
import {Close} from '@/components/icons';
import {WarningExclamation} from '@/components/pictograms';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';

export const SubmitScheduleModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'SubmitScheduleModal'>
> = ({modal: {closeModal, getParam}}) => {
  const onNoPress = () => {
    close();
  };

  const onYesPress = () => {
    getParam('onYesPress')();
  };

  const close = () => {
    closeModal();
  };

  return (
    <BaseModal>
      <View
        style={[
          {
            paddingHorizontal: spacer(24),
            marginTop: spacer(24),
          },
        ]}>
        <IconButton
          size={24}
          iconSize={16}
          icon={<Close width={16} height={16} color={FWDColors.grey4} />}
          onPress={close}
        />
      </View>
      <View
        style={{
          paddingHorizontal: spacer(40),
          paddingBottom: spacer(40),
          marginTop: spacer(24),
        }}>
        <View style={[layoutStyles.centerCenter]}>
          <WarningExclamation width={80} height={80} color={FWDColors.orange} />
        </View>

        <View
          style={{
            marginTop: spacer(8),
          }}>
          <Typography
            align="center"
            label="Are you sure you want to submit your schedule for approval?"
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
            label="Once approved, WFO days will be locked and can no longer be edited."
            variant="l1-b"
            color={FWDColors.greenDarker}
          />
        </View>

        <View
          style={{
            marginTop: spacer(32),
          }}>
          <Button label="Submit" mode="contained" onPress={onYesPress} />
        </View>
        <View
          style={{
            marginTop: spacer(24),
          }}>
          <Button label="No" mode="outlined" onPress={onNoPress} />
        </View>
      </View>
    </BaseModal>
  );
};
