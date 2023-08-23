import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';
import {format} from 'date-fns';

import {useSavePlanSchedule} from '@/services/query/useSchedule';
import {layoutStyles, spacer} from '@/utils';
import {Button, FWDColors, IconButton, Typography} from '@/components';
import {Close} from '@/components/icons';
import {WarningExclamation} from '@/components/pictograms';
import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';

export const DraftScheduleModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'DraftScheduleModal'>
> = ({modal: {closeModal, getParam}}) => {
  const [currentDate] = useState(new Date());
  const {mutateAsync: savePlanSchedule, isLoading} = useSavePlanSchedule();

  const onNoPress = () => {
    close();
  };

  const onYesPress = async () => {
    const draftSchedule = getParam('draftSchedule');
    try {
      await savePlanSchedule(draftSchedule);
      getParam('onYesPress')();
    } catch (error) {
      console.log('error', error);
      // TODO: Handle error
    }
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
            label="Do you want to save the changes and continue plotting later?"
            variant="h3"
            color={FWDColors.orange}
          />
        </View>

        <View
          style={{
            marginTop: spacer(8),
          }}>
          <Text style={[layoutStyles.textCenter]}>
            <Typography
              align="center"
              label="You can only plot your schedule until "
              variant="l1-b"
              color={FWDColors.greenDarker}
            />
            <Typography
              align="center"
              label={`${format(currentDate, 'MMMM')} 24. `}
              variant="h2"
              color={FWDColors.greenDarker}
            />
            <Typography
              align="center"
              label="If you're unable to submit by then, your WFO schedule will be lumped in the beginning of the month."
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
            label="Yes, save and exit"
            mode="outlined"
            onPress={onYesPress}
            loading={isLoading}
          />
        </View>
        <View
          style={{
            marginTop: spacer(24),
          }}>
          <Button
            label="No, discard and exit"
            mode="outlined"
            onPress={onNoPress}
          />
        </View>
      </View>
    </BaseModal>
  );
};
