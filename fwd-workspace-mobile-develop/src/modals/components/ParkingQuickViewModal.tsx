import React from 'react';
import {View} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';
import {TouchableOpacity} from 'react-native';

import {layoutStyles, spacer} from '@/utils';
import {Close, Parking, FWDColors, Typography, IconButton} from '@/components';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';

export const ParkingQuickViewModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'ParkingQuickViewModal'>
> = ({modal: {closeModal, getParam}}) => {
  const onPressView = () => {
    getParam('onTransferParking')();
  };

  const close = () => {
    closeModal();
  };

  return (
    <BaseModal>
      <View
        style={[
          layoutStyles.startCenter,
          {
            padding: spacer(24),
          },
        ]}>
        <View
          style={[
            layoutStyles.absolute,
            {
              left: spacer(24),
              top: spacer(24),
            },
          ]}>
          <IconButton
            size={24}
            iconSize={16}
            icon={<Close width={16} height={16} color={FWDColors.grey4} />}
            onPress={close}
          />
        </View>

        <Typography
          align="center"
          label={getParam('slot')}
          variant="h2"
          color={FWDColors.greenDark}
        />
      </View>

      <View
        style={[
          {
            paddingHorizontal: spacer(24),
            paddingBottom: spacer(24),
          },
        ]}>
        <TouchableOpacity
          style={[
            layoutStyles.row,
            layoutStyles.centerCenter,
            {paddingVertical: spacer(12)},
          ]}
          activeOpacity={0.75}
          onPress={onPressView}>
          <Parking height={18} width={18} color={FWDColors.orange} />

          <Typography
            label="Transfer Parking"
            variant="b3-m"
            color={FWDColors.greenDarker}
            style={{marginLeft: spacer(8)}}
          />
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};
