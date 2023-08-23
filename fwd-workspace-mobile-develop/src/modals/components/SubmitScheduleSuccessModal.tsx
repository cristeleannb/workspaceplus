import React from 'react';
import {View} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';

import {layoutStyles, spacer} from '@/utils';
import {Button, FWDColors, ShadowView, Typography} from '@/components';
import {Close} from '@/components/icons';
import {MailSent} from '@/components/pictograms';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';

export const SubmitScheduleSuccessModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'SubmitScheduleSuccessModal'>
> = ({modal: {closeModal, getParam}}) => {
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
        <Button
          iconOnly
          color="light"
          size="small"
          icon={<Close width={16} height={16} color={FWDColors.white} />}
          onPress={close}
        />
      </View>
      <View
        style={{
          paddingHorizontal: spacer(40),
          paddingBottom: spacer(40),
          marginTop: spacer(24),
        }}>
        <ShadowView
          style={[
            layoutStyles.centerCenter,
            layoutStyles.absolute,
            layoutStyles.alignSelfCenter,
            {
              top: spacer(-130),
              backgroundColor: FWDColors.white,
              borderRadius: 100 / 2,
              padding: spacer(10),
            },
          ]}>
          <MailSent width={80} height={80} color={FWDColors.orange} />
        </ShadowView>

        <View
          style={{
            marginTop: spacer(8),
          }}>
          <Typography
            align="center"
            label="Thanks, <Employee Name>!"
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
            label="Your proposed schedule has been submitted for approval."
            variant="l1-b"
            color={FWDColors.greenDarker}
          />
        </View>

        <View
          style={{
            marginTop: spacer(32),
          }}>
          <Button label="Okay" mode="contained" onPress={onYesPress} />
        </View>
      </View>
    </BaseModal>
  );
};
