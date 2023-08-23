import React from 'react';
import {Image, View} from 'react-native';

import {Button, FWDColors, Typography} from '@/components';
import {TableOffice} from '@/components/pictograms';
import {layoutStyles, spacer} from '@/utils';

const imageSource = {
  tapDeparment: require('@/assets/images/workstation-tap-department.png'),
  selectDate: require('@/assets/images/workstation-select-date.png'),
  selectSeat: require('@/assets/images/workstation-select-seat.png'),
};

const cardList = [
  {
    id: 'tap-department',
    source: imageSource.tapDeparment,
    width: 138,
    height: 110,
    title: "Tap on your department's area",
    subtitle: null,
    textGap: 12,
  },
  {
    id: 'select-date',
    source: imageSource.selectDate,
    width: 138,
    height: 110,
    title: 'Select the date',
    subtitle: 'Dates are based on your Work from Office schedule',
    textGap: 12,
  },
  {
    id: 'select-seat',
    source: imageSource.selectSeat,
    width: 130,
    height: 110,
    title: 'Select an available seat to reserve',
    subtitle: null,
    textGap: 20,
  },
];

interface WorkStationHelperBottomSheetProps {
  onClose: () => void;
}

export const WorkStationHelperBottomSheet = ({
  onClose,
}: WorkStationHelperBottomSheetProps) => {
  return (
    <View style={{padding: spacer(24)}}>
      <View style={[layoutStyles.centerCenter]}>
        <TableOffice height={80} width={80} />
      </View>

      <View
        style={{
          marginTop: spacer(8),
        }}>
        <Typography
          align="center"
          label="How to book your workstation"
          variant="h3"
          color={FWDColors.orange}
        />
      </View>

      <View
        style={{
          marginBottom: spacer(24),
        }}>
        {cardList.map(card => (
          <View
            key={card.id}
            style={[
              layoutStyles.row,
              layoutStyles.startCenter,
              {
                marginTop: spacer(16),
                borderRadius: spacer(8),
                paddingHorizontal: spacer(20),
                backgroundColor: FWDColors.orange5,
              },
            ]}>
            <Image
              source={card.source}
              resizeMode="contain"
              style={{
                width: card.width,
                height: card.height,
              }}
            />

            <View
              style={[
                layoutStyles.cover,
                {
                  marginLeft: card.textGap,
                },
              ]}>
              <Typography
                label={card.title}
                color={FWDColors.greenDarker}
                variant="l2-m"
              />

              {card.subtitle && (
                <Typography
                  label={card.subtitle}
                  color={FWDColors.grey4}
                  variant="l3-b"
                  style={{
                    marginTop: spacer(2),
                  }}
                />
              )}
            </View>
          </View>
        ))}
      </View>

      <View
        style={{
          paddingHorizontal: spacer(16),
        }}>
        <Button label="Got it" onPress={onClose} />
      </View>
    </View>
  );
};
