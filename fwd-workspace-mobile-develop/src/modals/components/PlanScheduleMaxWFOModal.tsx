import React, {useMemo, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';
import _ from 'lodash';

import {layoutStyles, spacer} from '@/utils';
import {
  Button,
  FWDColors,
  Typography,
  ExclamationCircle,
  IconButton,
} from '@/components';
import {Close} from '@/components/icons';
import {TableOfficeFull} from '@/components/pictograms';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';
import {BookingDate} from '@/views';
import {format} from 'date-fns';

export const PlanScheduleMaxWFOModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'PlanScheduleMaxWFOModal'>
> = ({modal: {closeModal, getParam}}) => {
  const [dates] = useState(getParam('dates'));

  const close = () => {
    closeModal();
  };

  const formattedDates = useMemo(() => {
    return _.map(dates, d => format(new Date(d), 'EEE, dd MMM, yyyy'));
  }, [dates]);

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
          paddingHorizontal: spacer(24),
          paddingBottom: spacer(40),
          marginTop: spacer(24),
        }}>
        <View style={[layoutStyles.centerCenter]}>
          <TableOfficeFull width={64} height={64} />
        </View>

        <View
          style={{
            marginTop: spacer(8),
          }}>
          <Typography
            align="center"
            label="Oops, no more available WFO seats."
            variant="h3"
            color={FWDColors.orange}
          />
        </View>

        <View style={{marginTop: spacer(24), marginBottom: spacer(4)}}>
          <Typography
            label="Selected Dates"
            variant="l3-b"
            color={FWDColors.grey3}
          />
        </View>

        <ScrollView bounces={false} style={{maxHeight: spacer(28 * 5)}}>
          {formattedDates.map((d, i) => (
            <BookingDate key={i} text={d} />
          ))}
        </ScrollView>

        <View
          style={[
            layoutStyles.row,
            layoutStyles.startStart,
            {
              backgroundColor: FWDColors.yellow20,
              padding: spacer(8),
              marginTop: spacer(16),
              borderTopLeftRadius: spacer(8),
              borderTopRightRadius: spacer(8),
              borderBottomLeftRadius: spacer(8),
            },
          ]}>
          <View
            style={[
              layoutStyles.centerCenter,
              {
                padding: spacer(2),
                marginRight: spacer(8),
              },
            ]}>
            <ExclamationCircle
              height={20}
              width={20}
              color={FWDColors.orange}
            />
          </View>

          <View style={[layoutStyles.cover, layoutStyles.row]}>
            <Text>
              <Typography
                label={'Your '}
                variant="l3-b"
                color={FWDColors.grey4}
                style={[layoutStyles.cover]}
              />
              <Typography
                label={'WFO schedule '}
                variant="l3-bold"
                color={FWDColors.grey4}
                style={[layoutStyles.cover]}
              />
              <Typography
                label={' for these dates will be '}
                variant="l3-b"
                color={FWDColors.grey4}
                style={[layoutStyles.cover]}
              />
              <Typography
                label={'converted to WFA. '}
                variant="l3-bold"
                color={FWDColors.grey4}
                style={[layoutStyles.cover]}
              />
              <Typography
                label={'If you are out of '}
                variant="l3-b"
                color={FWDColors.grey4}
                style={[layoutStyles.cover]}
              />
              <Typography
                label={'WFA/WFB credits, '}
                variant="l3-bold"
                color={FWDColors.grey4}
                style={[layoutStyles.cover]}
              />
              <Typography
                label={'please re-arrange your schedule.'}
                variant="l3-b"
                color={FWDColors.grey4}
                style={[layoutStyles.cover]}
              />
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: spacer(32),
          }}>
          <Button label="Okay" mode="contained" onPress={close} />
        </View>
      </View>
    </BaseModal>
  );
};
