import React from 'react';
import {View, Text} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';
import {addDays, format} from 'date-fns';

import {layoutStyles, spacer} from '@/utils';
import {Button, FWDColors, IconButton, Typography} from '@/components';
import {Close} from '@/components/icons';
import {WarningExclamation} from '@/components/pictograms';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';

export const BlockedParkingReservationModal: ModalComponentWithOptions<
  ModalComponentProp<
    ModalStackParamsList,
    void,
    'BlockedParkingReservationModal'
  >
> = ({modal: {closeModal, getParam}}) => {
  const onContactPeopleAndCulture = () => {
    getParam('onContactPeopleAndCulture')();
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
            label="You're temporarily blocked from reserving parking for 2 weeks."
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
              label="Please check back again on "
              variant="l1-b"
              color={FWDColors.greenDarker}
            />
            <Typography
              align="center"
              label={`${format(
                addDays(getParam('blockDate'), 14),
                'eeee, MMMM d, yyyy',
              )}`}
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
              label="If you have questions or clarifications, contact "
              variant="l1-b"
              color={FWDColors.greenDarker}
            />
            <Typography
              align="center"
              label={'People & Culture'}
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
            label={'Contact People & Culture'}
            mode="contained"
            onPress={onContactPeopleAndCulture}
          />
        </View>
      </View>
    </BaseModal>
  );
};
