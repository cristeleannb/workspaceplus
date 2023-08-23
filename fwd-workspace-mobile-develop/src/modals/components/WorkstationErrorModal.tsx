import React from 'react';
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

export const WorkstationErrorModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'WorkstationErrorModal'>
> = ({modal: {getParam, closeModal}}) => {
  const onPressYes = getParam('onPressYes');

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
            onPress={() => closeModal()}
          />
        </View>

        <View style={[layoutStyles.centerCenter]}>
          <WarningExclamation height={80} width={80} />

          <View style={[layoutStyles.row, {marginTop: spacer(12)}]}>
            <Typography
              align="center"
              label="Sorry, you cannot cancel this reservation."
              variant="h3"
              color={FWDColors.orange}
              style={[layoutStyles.cover]}
            />
          </View>
        </View>

        <View style={{marginTop: spacer(32), paddingHorizontal: spacer(16)}}>
          <Button label="Okay" mode="contained" onPress={onPressYes} />
        </View>
      </View>
    </BaseModal>
  );
};
