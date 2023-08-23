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

export const WorkStationBranchModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'WorkStationBranchModal'>
> = ({modal: {closeModal, getParam}}) => {
  const selectedCityId = getParam('selectedCityId');

  const close = () => {
    closeModal();
  };

  const onPressBranchCity = (id: number) => {
    getParam('onPressBranch')(id);
    close();
  };

  const headerLabel = useMemo(() => {
    const isInitialLoad = getParam('initialSelection');
    return isInitialLoad
      ? 'Before we proceed, choose your default branch location'
      : 'Choose a branch location';
  }, [getParam]);
  const branchCityList = useMemo(() => getParam('branchCityList'), [getParam]);

  return (
    <BaseModal>
      <View style={[{padding: spacer(24)}]}>
        <View
          style={[
            layoutStyles.row,
            layoutStyles.startStart,
            {marginBottom: spacer(24)},
          ]}>
          <IconButton
            size={24}
            iconSize={16}
            icon={<Close width={16} height={16} color={FWDColors.grey4} />}
            onPress={close}
          />

          <View style={[layoutStyles.cover, {marginRight: spacer(12)}]}>
            <Typography
              align="center"
              label={headerLabel}
              variant="h2"
              color={FWDColors.greenDarker}
            />
          </View>
        </View>

        <ScrollView bounces={false} style={{maxHeight: screenHeight / 3}}>
          {branchCityList.map(branch => (
            <TouchableOpacity
              key={branch.cityId}
              style={{
                paddingVertical: spacer(6),
                marginBottom: spacer(12),
              }}
              activeOpacity={0.75}
              onPress={() => onPressBranchCity(branch.cityId || 0)}>
              <Typography
                label={branch.cityName || ''}
                align="center"
                variant={selectedCityId === branch.cityId ? 'h2' : 'b3-m'}
                color={
                  selectedCityId === branch.cityId
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
