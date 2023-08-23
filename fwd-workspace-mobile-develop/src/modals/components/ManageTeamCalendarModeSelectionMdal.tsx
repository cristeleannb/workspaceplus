import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';

import {Close} from '@/components/icons';
import {FWDColors, IconButton, Typography} from '@/components';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';
import {layoutStyles, spacer} from '@/utils';
import {WSDirectReportViewType} from '@/types';

interface CalendarMode {
  key: WSDirectReportViewType;
  value: WSDirectReportViewType;
}

const calendarModes: CalendarMode[] = [
  {
    key: 'Weekly',
    value: 'Weekly',
  },
  {
    key: 'Monthly',
    value: 'Monthly',
  },
];

export const ManageTeamCalendarModeSelectionMdal: ModalComponentWithOptions<
  ModalComponentProp<
    ModalStackParamsList,
    void,
    'ManageTeamCalendarModeSelectionMdal'
  >
> = ({modal: {closeModal, getParam}}) => {
  const close = () => {
    closeModal();
  };

  const onSelect = (mode: WSDirectReportViewType) => {
    getParam('onSelect')(mode);
  };

  return (
    <BaseModal>
      <View
        style={[
          layoutStyles.fullWidth,
          {
            paddingHorizontal: spacer(24),
            paddingVertical: spacer(24),
          },
        ]}>
        <Typography label="Select" variant="h2" align="center" />
        <IconButton
          size={24}
          iconSize={16}
          icon={<Close width={16} height={16} color={FWDColors.grey4} />}
          onPress={close}
        />

        <View
          style={[
            layoutStyles.fullWidth,
            {
              marginTop: spacer(24),
            },
          ]}>
          {calendarModes.map((mode, modeIndex) => (
            <TouchableOpacity
              key={mode.key}
              onPress={() => onSelect(mode.value)}
              style={[
                layoutStyles.centerCenter,
                {
                  height: spacer(48),
                  borderRadius: spacer(16),
                  backgroundColor:
                    getParam('currentMode') === mode.value
                      ? FWDColors.greyLight
                      : FWDColors.transparent,
                  marginTop: spacer(modeIndex > 0 ? 16 : 0),
                },
              ]}>
              <Typography
                label={mode.value}
                variant={getParam('currentMode') === mode.value ? 'h2' : 'l1-m'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </BaseModal>
  );
};
