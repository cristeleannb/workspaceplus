import React from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';
import {format} from 'date-fns';

import {layoutStyles, spacer} from '@/utils';
import {Button, FWDColors, Typography, IconButton} from '@/components';
import {Close} from '@/components/icons';
import {WarningExclamation} from '@/components/pictograms';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';

export const MissedGracePeriodModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'MissedGracePeriodModal'>
> = ({modal: {closeModal, getParam}}) => {
  const onBookAnotherParkingSlot = getParam('onBookAnotherParkingSlot');

  const onContactPeopleAndCulture = getParam('onContactPeopleAndCulture');

  const close = () => {
    closeModal();
  };

  const penalizedUntil = getParam('penalizedUntil') || new Date();

  const type = getParam('type');
  const penaltyStrike = getParam('penaltyStrike');
  const reservationStatus = getParam('reservationStatus');

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
          marginTop: spacer(12),
        }}>
        <View style={[layoutStyles.centerCenter]}>
          <WarningExclamation width={80} height={80} color={FWDColors.orange} />
        </View>

        <View
          style={{
            marginTop: spacer(8),
          }}>
          {type === 'workstation' ? (
            <Typography
              align="center"
              label={`${
                penaltyStrike < 3
                  ? 'Oops, you missed your seat.'
                  : "You're temporarily blocked from booking a workstation for 2 weeks."
              }`}
              variant="h3"
              color={FWDColors.orange}
            />
          ) : (
            <Typography
              align="center"
              label="Oops, you missed your parking slot."
              variant="h3"
              color={FWDColors.orange}
            />
          )}
          <Text
            style={[
              layoutStyles.textCenter,
              {
                marginTop: spacer(8),
                lineHeight: spacer(24),
              },
            ]}>
            {type === 'workstation' ? (
              penaltyStrike < 3 ? (
                <>
                  <Typography
                    align="center"
                    label={`Your reservation has been cancelled because you're past the 1-hour grace period. ${
                      penaltyStrike === 1
                        ? 'This is your first strike.'
                        : penaltyStrike === 2
                        ? 'This is your second strike.'
                        : 'You are now blocked from reserving for 2 weeks.'
                    }`}
                    variant="l1-b"
                    color={FWDColors.greenDarker}
                  />

                  <Typography
                    align="center"
                    label={` If you miss ${
                      penaltyStrike === 1 ? '2 ' : '1 '
                    } more check-in confirmation, you'll be blocked from booking a workstation for 2 weeks`}
                    variant="l1-b"
                    color={FWDColors.greenDarker}
                  />
                </>
              ) : (
                <>
                  <Text
                    style={{
                      lineHeight: spacer(21),
                      marginTop: spacer(8),
                    }}>
                    <Typography
                      align="center"
                      label={'Please check back in again on '}
                      variant="l1-b"
                      color={FWDColors.greenDarker}
                    />
                    <Typography
                      align="center"
                      label={`${format(
                        new Date(penalizedUntil),
                        'MMMM d, yyyy',
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
                    style={{
                      lineHeight: spacer(21),
                      marginTop: spacer(8),
                    }}>
                    <Typography
                      align="center"
                      label={'\n\nYou can only check-in in the '}
                      variant="l1-b"
                      color={FWDColors.greenDarker}
                    />
                    <TouchableWithoutFeedback>
                      <Typography
                        align="center"
                        label={'Innovation '}
                        variant="l1-m"
                        color={FWDColors.orange}
                      />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                      <Typography
                        align="center"
                        label={'Area'}
                        variant="l1-m"
                        color={FWDColors.orange}
                      />
                    </TouchableWithoutFeedback>
                    <Typography
                      align="center"
                      label={' and '}
                      variant="l1-b"
                      color={FWDColors.greenDarker}
                    />
                    <TouchableWithoutFeedback>
                      <Typography
                        align="center"
                        label={'Collaboration '}
                        variant="l1-m"
                        color={FWDColors.orange}
                      />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                      <Typography
                        align="center"
                        label={'Area'}
                        variant="l1-m"
                        color={FWDColors.orange}
                      />
                    </TouchableWithoutFeedback>
                    <Typography
                      align="center"
                      label="."
                      variant="l1-b"
                      color={FWDColors.greenDarker}
                    />
                  </Text>
                </>
              )
            ) : (
              <Typography
                align="center"
                label={`Your reservation has been cancelled because you're past the 1-hour grace period. ${
                  penaltyStrike === 1
                    ? 'This is your first strike.'
                    : penaltyStrike === 2
                    ? 'This is your second strike.'
                    : 'You are now blocked from reserving for 2 weeks.'
                }`}
                variant="l1-b"
                color={FWDColors.greenDarker}
              />
            )}

            <Typography
              align="center"
              label={`\n\n${
                type === 'workstation'
                  ? 'If you have questions or clarification, contact'
                  : 'For any question, please contact'
              } `}
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
          {type === 'workstation' ? (
            <Button
              label={`${
                penaltyStrike < 3
                  ? 'Book another workstation'
                  : 'Contact People & Culture'
              }`}
              mode="contained"
              onPress={onBookAnotherParkingSlot}
            />
          ) : (
            <Button
              label={`${
                penaltyStrike < 3
                  ? 'Book another parking slot'
                  : 'Contact People & Culture'
              }`}
              mode="contained"
              onPress={onBookAnotherParkingSlot}
            />
          )}
        </View>
        {penaltyStrike < 3 && reservationStatus === 1 && (
          <View
            style={{
              marginTop: spacer(24),
            }}>
            <Button
              label={'Contact People & Culture'}
              mode="outlined"
              onPress={onContactPeopleAndCulture}
            />
          </View>
        )}
      </View>
    </BaseModal>
  );
};
