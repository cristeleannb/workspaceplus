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

export const QRErrorModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'QRErrorModal'>
> = ({modal: {closeModal, getParam}}) => {
  const onUploadQR = () => {
    close();
  };

  const onScanQR = () => {
    getParam('onScanQR')();
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
            label="Oops, something went wrong."
            variant="h3"
            color={FWDColors.orange}
          />
          <Typography
            align="center"
            label="Cannot read QR code. Please try again."
            variant="l1-b"
            color={FWDColors.greenDarker}
          />
        </View>

        <View
          style={{
            marginTop: spacer(32),
          }}>
          <Button label="Scan QR" mode="outlined" onPress={onScanQR} />
        </View>
        <View
          style={{
            marginTop: spacer(24),
          }}>
          <Button label="Upload QR" mode="outlined" onPress={onUploadQR} />
        </View>
      </View>
    </BaseModal>
  );
};
