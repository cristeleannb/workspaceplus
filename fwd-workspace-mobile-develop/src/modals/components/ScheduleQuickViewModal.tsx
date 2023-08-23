import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';

import {layoutStyles, spacer} from '@/utils';
import {
  Close,
  Calendar,
  FWDColors,
  Typography,
  CheckIn,
  CheckOut,
  Parking,
  Transfer,
  IconButton,
} from '@/components';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';

export const ScheduleQuickViewModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'ScheduleQuickViewModal'>
> = ({modal: {closeModal, getParam}}) => {
  const onPressPlanSchedule = getParam('onPressPlanSchedule');
  const onPressParkingCheckIn = getParam('onPressParkingCheckIn');
  const onPressTransferParking = getParam('onPressTransferParking');
  const onPressViewParking = getParam('onPressViewParking');

  const checkIn = getParam('checkIn');
  const viewOnly = getParam('viewOnly');

  const canTransferParking = getParam('canTransferParking');

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
          label={getParam('title')}
          variant="h2"
          color={FWDColors.greenDark}
        />
      </View>

      {getParam('type') === 'workstation' && (
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
            onPress={onPressPlanSchedule}>
            <Calendar height={18} width={18} color={FWDColors.orange} />

            <Typography
              label="Plan Schedule"
              variant="b3-m"
              color={FWDColors.greenDarker}
              style={{marginLeft: spacer(8)}}
            />
          </TouchableOpacity>
        </View>
      )}

      {getParam('type') === 'parking' && (
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
            onPress={onPressViewParking}>
            <Parking height={18} width={18} color={FWDColors.orange} />

            <Typography
              label="View Parking"
              variant="b3-m"
              color={FWDColors.greenDarker}
              style={{marginLeft: spacer(8)}}
            />
          </TouchableOpacity>

          {!viewOnly && checkIn !== undefined && checkIn.status !== null && (
            <TouchableOpacity
              style={[
                layoutStyles.row,
                layoutStyles.centerCenter,
                {paddingVertical: spacer(12)},
              ]}
              activeOpacity={0.75}
              onPress={onPressParkingCheckIn}>
              {checkIn.status ? (
                <CheckIn height={18} width={18} color={FWDColors.orange} />
              ) : (
                <CheckOut height={18} width={18} color={FWDColors.orange} />
              )}

              <Typography
                label={checkIn.status ? 'Check In' : 'Check Out'}
                variant="b3-m"
                color={FWDColors.greenDarker}
                style={{marginLeft: spacer(8)}}
              />
            </TouchableOpacity>
          )}

          {!viewOnly && canTransferParking && (
            <TouchableOpacity
              style={[
                layoutStyles.row,
                layoutStyles.centerCenter,
                {paddingVertical: spacer(12)},
              ]}
              activeOpacity={0.75}
              onPress={onPressTransferParking}>
              <Transfer height={18} width={18} color={FWDColors.orange} />

              <Typography
                label="Transfer Parking"
                variant="b3-m"
                color={FWDColors.greenDarker}
                style={{marginLeft: spacer(8)}}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </BaseModal>
  );
};
