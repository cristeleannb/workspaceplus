import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';

import {layoutStyles, spacer} from '@/utils';
import {FWDColors, IconButton, Typography} from '@/components';
import {Close, Parking, Edit} from '@/components/icons';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';
import {differenceInHours} from 'date-fns';

export const BookSlotModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'BookSlotModal'>
> = ({modal: {closeModal, getParam}}) => {
  const close = () => {
    closeModal();
  };

  const label = getParam('label');
  const date = new Date(getParam('date') || Date.now());

  const showChangeCancel = differenceInHours(date, new Date()) >= 24;
  const isPermanent = getParam('isPermanent');

  const onPressView = getParam('onPressView');

  const onPressChange = getParam('onPressChange');

  const onPressCancel = getParam('onPressCancel');

  return (
    <BaseModal>
      <View style={[{padding: spacer(24)}]}>
        <View
          style={[
            layoutStyles.row,
            layoutStyles.startCenter,
            {marginBottom: spacer(24)},
          ]}>
          <View
            style={[
              layoutStyles.absolute,
              layoutStyles.row,
              layoutStyles.centerCenter,
              {
                left: spacer(0),
                right: spacer(0),
              },
            ]}>
            <Typography
              align="center"
              label={`${label}`}
              variant="h2"
              color={FWDColors.greenDarker}
              style={[layoutStyles.cover]}
            />
          </View>

          <IconButton
            size={24}
            iconSize={16}
            icon={<Close width={16} height={16} color={FWDColors.grey4} />}
            onPress={close}
          />
        </View>

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
            label="View Parking Slot"
            variant="b3-m"
            color={FWDColors.greenDarker}
            style={{marginLeft: spacer(8)}}
          />
        </TouchableOpacity>

        {!isPermanent && showChangeCancel && (
          <>
            <View
              style={[
                layoutStyles.fullWidth,
                {
                  borderTopWidth: spacer(1),
                  borderTopColor: FWDColors.greyLight,
                  marginVertical: spacer(12),
                },
              ]}
            />

            <TouchableOpacity
              style={[
                layoutStyles.row,
                layoutStyles.centerCenter,
                {paddingVertical: spacer(12)},
              ]}
              activeOpacity={0.75}
              onPress={onPressChange}>
              <Edit height={18} width={18} color={FWDColors.orange} />

              <Typography
                label="Change Reservation"
                variant="b3-m"
                color={FWDColors.greenDarker}
                style={{marginLeft: spacer(8)}}
              />
            </TouchableOpacity>

            <View
              style={[
                layoutStyles.fullWidth,
                {
                  borderTopWidth: spacer(1),
                  borderTopColor: FWDColors.greyLight,
                  marginVertical: spacer(12),
                },
              ]}
            />

            <TouchableOpacity
              style={[
                layoutStyles.row,
                layoutStyles.centerCenter,
                {paddingVertical: spacer(12)},
              ]}
              activeOpacity={0.75}
              onPress={onPressCancel}>
              <Close height={16} width={16} color={FWDColors.red} />

              <Typography
                label="Cancel Reservation"
                variant="b3-m"
                color={FWDColors.red}
                style={{marginLeft: spacer(8)}}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </BaseModal>
  );
};
