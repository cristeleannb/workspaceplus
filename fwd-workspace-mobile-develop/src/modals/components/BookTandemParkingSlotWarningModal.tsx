import React from 'react';
import {View, Text} from 'react-native';
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

export const BookTandemParkingSlotWarningModal: ModalComponentWithOptions<
  ModalComponentProp<
    ModalStackParamsList,
    void,
    'BookTandemParkingSlotWarningModal'
  >
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
            label="You're reserving a slot that has 2 capacities"
            variant="h3"
            color={FWDColors.orange}
          />
          <Text
            style={[
              layoutStyles.textCenter,
              {
                marginTop: spacer(8),
                lineHeight: spacer(24),
              },
            ]}>
            <Typography
              align="center"
              label="Know your tandem. Reach out to "
              variant="l1-b"
              color={FWDColors.greenDarker}
            />
            <Typography
              align="center"
              label="Corporate "
              variant="l1-m"
              color={FWDColors.orange}
            />
            <Typography
              align="center"
              label="Services"
              variant="l1-m"
              color={FWDColors.orange}
            />
            <Typography
              align="center"
              label="."
              variant="l1-b"
              color={FWDColors.greenDarker}
            />
          </Text>
        </View>

        <View
          style={{
            marginTop: spacer(32),
          }}>
          <Button
            label="Contact Corporate Services"
            mode="contained"
            onPress={onYesPress}
          />
        </View>
        <View
          style={{
            marginTop: spacer(24),
          }}>
          <Button label="Close" mode="outlined" onPress={onNoPress} />
        </View>
      </View>
    </BaseModal>
  );
};
