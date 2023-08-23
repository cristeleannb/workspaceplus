import React, {useMemo} from 'react';
import {View} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';

import {layoutStyles, spacer} from '@/utils';
import {Button, FWDColors, IconButton, Typography} from '@/components';
import {WarningExclamation} from '@/components/pictograms';
import {Close} from '@/components/icons';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';

export const CheckInOutModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'CheckInOutModal'>
> = ({modal: {closeModal, getParam}}) => {
  const status = getParam('status');

  const title = useMemo(() => {
    switch (status) {
      case 'wrong-seat':
        return 'Oops, you didn’t reserve this seat.';

      case 'not-working':
        return 'Oops, something went wrong.';

      case 'missed-time':
        return 'Oops, you’ve missed your seat.';

      case 'wrong-slot':
        return 'Oops, you didn’t reserve this slot.';

      default:
        return '';
    }
  }, [status]);

  const description = useMemo(() => {
    switch (status) {
      case 'wrong-seat':
        return 'Please try again.';

      case 'not-working':
        return 'Cannot read QR code. Please try again.';

      case 'missed-time':
        return `Your reserved workstation has already been cancelled because you’re past the 1-hour grace period. This is your 1st strike.

        If you have questions or clarifications, you contact People & Culture or try booking another workstation.`;

      case 'wrong-slot':
        return 'Please try again.';

      default:
        return '';
    }
  }, [status]);

  const close = () => {
    closeModal();
  };

  const onPressScanQR = getParam('onPressScanQR');
  const onPressUploadQR = getParam('onPressUploadQR');
  const onPressBookWS = getParam('onPressBookWS');
  const onPressContact = getParam('onPressContact');

  return (
    <BaseModal>
      <View style={[{padding: spacer(24), paddingBottom: spacer(40)}]}>
        <View
          style={[
            layoutStyles.row,
            layoutStyles.startCenter,
            {marginBottom: spacer(24)},
          ]}>
          <IconButton
            size={24}
            iconSize={16}
            icon={<Close width={16} height={16} color={FWDColors.grey4} />}
            onPress={close}
          />
        </View>

        <View style={[layoutStyles.centerCenter]}>
          <WarningExclamation height={80} width={80} />

          <View style={[layoutStyles.row, {marginTop: spacer(12)}]}>
            <Typography
              align="center"
              label={title}
              variant="h3"
              color={FWDColors.orange}
              style={[layoutStyles.cover]}
            />
          </View>

          <View
            style={{
              marginTop: spacer(8),
            }}>
            <Typography
              align="center"
              label={description}
              variant="l1-b"
              color={FWDColors.greenDarker}
            />
          </View>
        </View>

        <View style={{marginTop: spacer(32), paddingHorizontal: spacer(16)}}>
          {onPressScanQR && (
            <Button label="Scan QR" mode="outlined" onPress={onPressScanQR} />
          )}

          {onPressUploadQR && (
            <Button
              label="Upload QR"
              mode="outlined"
              onPress={onPressUploadQR}
              style={{marginTop: spacer(24)}}
            />
          )}

          {onPressBookWS && (
            <Button label="Book another workstation" onPress={onPressBookWS} />
          )}

          {onPressContact && (
            <Button
              label={'Contact People & Culture'}
              mode="outlined"
              onPress={onPressContact}
              style={{marginTop: spacer(24)}}
            />
          )}
        </View>
      </View>
    </BaseModal>
  );
};
