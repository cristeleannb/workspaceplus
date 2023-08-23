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

export const NoCameraPermissionModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'NoCameraPermissionModal'>
> = ({modal: {closeModal}}) => {
  const onOkayPress = () => {
    closeModal();
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
            label="Oops, Camera Access is Required!"
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
            label="To use the QR scanner, please allow camera access in your device’s settings."
            variant="l1-b"
            color={FWDColors.greenDarker}
          />
        </View>

        <View
          style={{
            marginTop: spacer(32),
          }}>
          <Button label="Okay" mode="contained" onPress={onOkayPress} />
        </View>
      </View>
    </BaseModal>
  );
};
