import React, {useState} from 'react';
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

export const WorkStationBookConfirmModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'WorkStationBookConfirmModal'>
> = ({modal: {getParam}}) => {
  const [loading, setLoading] = useState(false);

  const title = getParam('title');
  const description = getParam('description');

  const close = () => {
    getParam('onPressNo')();
  };

  const onPressYes = () => {
    if (!loading) {
      setLoading(true);
      getParam('onPressYes')();
    }
  };

  const onPressNo = () => {
    getParam('onPressNo')();
  };

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
            disabled={loading}
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

          {description && (
            <View style={[layoutStyles.row, {marginTop: spacer(12)}]}>
              <Typography
                align="center"
                label={description}
                variant="b3-b"
                color={FWDColors.greenDarker}
                style={[layoutStyles.cover]}
              />
            </View>
          )}
        </View>

        <View style={{marginTop: spacer(32), paddingHorizontal: spacer(16)}}>
          <Button
            label="Yes"
            mode="contained"
            loading={loading}
            onPress={onPressYes}
          />

          <Button
            label="Not Yet"
            mode="outlined"
            onPress={onPressNo}
            disabled={loading}
            style={{marginTop: spacer(24)}}
          />
        </View>
      </View>
    </BaseModal>
  );
};
