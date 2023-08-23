import React from 'react';
import {View} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';
import {TouchableOpacity} from 'react-native';

import {layoutStyles, spacer} from '@/utils';
import {FWDColors, IconButton, Typography} from '@/components';
import {Close} from '@/components/icons';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';

export const SelectDateFilterTypeModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'SelectDateFilterTypeModal'>
> = ({modal: {closeModal, getParam}}) => {
  const onSelect = (type: string) => {
    getParam('onSelect')(type);
  };

  const close = () => {
    closeModal();
  };

  const selectionsList = ['Daily', 'Weekly', 'Monthly'];

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
          label="Select"
          variant="h2"
          color={FWDColors.greenDark}
        />
      </View>

      <View
        style={[
          {
            paddingHorizontal: spacer(24),
            paddingBottom: spacer(24),
          },
        ]}>
        {selectionsList.map((item, index) => (
          <SelectionItem
            key={index}
            label={item}
            selected={index === 0}
            onSelect={onSelect}
          />
        ))}
      </View>
    </BaseModal>
  );
};

interface SelectionItemData {
  label: string;
  selected?: boolean;
  onSelect?: (type: string) => void;
}
const SelectionItem = (props: SelectionItemData) => {
  const {label, selected, onSelect} = props;
  return (
    <TouchableOpacity
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        backgroundColor: selected ? FWDColors.greyLight : FWDColors.white,
        borderRadius: spacer(16),
        paddingVertical: spacer(12),
        minWidth: '100%',
      }}
      onPress={() => onSelect && onSelect(label)}>
      <Typography
        align="center"
        label={label}
        variant="h2"
        color={FWDColors.greenDark}
      />
    </TouchableOpacity>
  );
};
