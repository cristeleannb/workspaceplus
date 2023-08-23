import React, {useMemo} from 'react';
import {Dimensions, View, TouchableOpacity, ScrollView} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';

import {layoutStyles, spacer} from '@/utils';
import {FWDColors, IconButton, Typography} from '@/components';
import {Close} from '@/components/icons';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';

const {height: screenHeight} = Dimensions.get('screen');

export const WorkStationAreaModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'WorkStationAreaModal'>
> = ({modal: {closeModal, getParam}}) => {
  const selectedId = getParam('selectedId');

  const close = () => {
    closeModal();
  };

  const onPressArea = getParam('onPressArea');

  const areaList = useMemo(() => getParam('areaList'), [getParam]);

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
              label="Select an area"
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

        <ScrollView bounces={false} style={{maxHeight: screenHeight / 3}}>
          {areaList.map(area => (
            <TouchableOpacity
              key={area.divisionId}
              style={{
                paddingVertical: spacer(12),
                marginBottom: spacer(16),
              }}
              activeOpacity={0.75}
              onPress={() => onPressArea(area)}>
              <Typography
                label={area.divisionName || ''}
                align="center"
                variant={selectedId === area.divisionId ? 'h2' : 'b3-b'}
                color={
                  selectedId === area.divisionId
                    ? FWDColors.orange
                    : FWDColors.greenDarker
                }
                style={{marginLeft: spacer(8)}}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </BaseModal>
  );
};
