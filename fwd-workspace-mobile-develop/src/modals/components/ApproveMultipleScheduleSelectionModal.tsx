import React from 'react';
import {View} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';
import _ from 'lodash';

import {layoutStyles, spacer} from '@/utils';
import {Button, FWDColors, Typography} from '@/components';
import {WarningExclamation} from '@/components/pictograms';
import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';
import {useSetScheduleRequestApproval} from '@/services/query';
import {EmployeePlanScheduleModel} from '@/services/api/api.service';

export const ApproveMultipleScheduleSelectionModal: ModalComponentWithOptions<
  ModalComponentProp<
    ModalStackParamsList,
    void,
    'ApproveMultipleScheduleSelectionModal'
  >
> = ({modal: {closeModal, getParam}}) => {
  const {
    mutateAsync: setScheduleRequestApproval,
    isLoading: setScheduleRequestApprovalLoading,
  } = useSetScheduleRequestApproval();

  const onNoPress = () => {
    close();
  };

  const onYesPress = async () => {
    try {
      const scheduleRequests = getParam('scheduleRequests');
      const transformedDetails: EmployeePlanScheduleModel[] = _.map(
        scheduleRequests,
        scheduleRequest => {
          return {
            ...scheduleRequest,
            approvalMessage: '',
            recordStatus: 2,
            planScheduleDates: _.map(
              scheduleRequest.planScheduleDates || [],
              schedule => {
                let locked: number = 0;
                if (schedule.workTypeId === 3) {
                  locked = 1;
                }

                return {
                  ...schedule,
                  isLock: locked,
                };
              },
            ),
          };
        },
      );

      await setScheduleRequestApproval(transformedDetails);
      getParam('onYesPress')();
    } catch (error) {
      // TODO: Handle error by adding toast banner
      console.log('error', error);
    }
  };

  const close = () => {
    closeModal();
  };

  return (
    <BaseModal>
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
            label="Are you sure you
            want to approve all
            without reviewing?"
            variant="h3"
            color={FWDColors.orange}
            style={{marginBottom: spacer(8)}}
          />
          <Typography
            label={'Once approved, it can no longer be edited.'}
            align="center"
            variant="l1-b"
            color={FWDColors.greenDarker}
          />
        </View>

        <View
          style={{
            marginTop: spacer(32),
          }}>
          <Button
            label="Yes, Approve"
            onPress={() => !setScheduleRequestApprovalLoading && onYesPress()}
            loading={setScheduleRequestApprovalLoading}
          />
        </View>
        <View
          style={{
            marginTop: spacer(24),
          }}>
          <Button label="No" mode="outlined" onPress={onNoPress} />
        </View>
      </View>
    </BaseModal>
  );
};
