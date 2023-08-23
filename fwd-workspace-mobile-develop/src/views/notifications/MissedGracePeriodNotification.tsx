import React, {useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import {useModal} from 'react-native-modalfy';

import {QuestionmarkCircle, FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {Strike1, Strike2, Strike3} from '@/components/pictograms';
import {ModalStackParamsList} from '@/modals';

interface MissedGracePeriodNotificationProps {
  penaltyStrike: number;
  type: 'workstation' | 'parking';
  penalizedUntil?: Date;
}

const MissedGracePeriodNotification = ({
  penaltyStrike,
  type,
  penalizedUntil,
}: MissedGracePeriodNotificationProps) => {
  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const onQuestionMarkPress = () => {
    openModal('MissedGracePeriodModal', {
      type,
      penaltyStrike,
      reservationStatus: 1,
      onBookAnotherParkingSlot: () => {
        closeModal('MissedGracePeriodModal');
      },
      onContactPeopleAndCulture: () => {
        closeModal('MissedGracePeriodModal');
      },
      penalizedUntil,
    });
  };

  const penaltyLabel = useMemo(() => {
    const penaltyType =
      type === 'workstation' ? 'booking a workstation' : 'reserving parking';

    if (penaltyStrike === 1) {
      return `You missed check-in within the grace period! If you miss 2 more check-in confirmations, you'll be blocked from ${penaltyType} for 2 weeks.`;
    } else if (penaltyStrike === 2) {
      return `You missed check-in within the grace period again! If you miss one more check-in confirmation, you'll be blocked from ${penaltyType} for 2 weeks.`;
    } else if (penaltyStrike >= 3) {
      return `You missed check-in within the grace period again! You're now blocked from ${penaltyType} for 2 weeks.`;
    } else {
      return '';
    }
  }, [penaltyStrike, type]);

  return (
    <View
      style={[
        layoutStyles.row,
        {
          backgroundColor: FWDColors.orange20,
          marginTop: spacer(24),
          paddingVertical: spacer(16),
          paddingHorizontal: spacer(12),
          borderTopLeftRadius: spacer(8),
          borderTopRightRadius: spacer(8),
          borderBottomLeftRadius: spacer(8),
        },
      ]}>
      <View
        style={[
          layoutStyles.row,
          {
            borderBottomColor: FWDColors.lightblue,
            borderBottomWidth: spacer(1),
          },
        ]}>
        {penaltyStrike === 1 ? (
          <Strike1 width={32} height={32} />
        ) : penaltyStrike === 2 ? (
          <Strike2 width={32} height={32} />
        ) : (
          <Strike3 width={32} height={32} />
        )}
      </View>
      <View style={[layoutStyles.cover, {marginLeft: spacer(12)}]}>
        <View style={[layoutStyles.row, layoutStyles.betweenCenter]}>
          <Typography
            label={
              penaltyStrike === 1
                ? 'Uh-oh! This is your first warning.'
                : penaltyStrike === 2
                ? 'Uh-oh! This is your second warning.'
                : 'Oops!'
            }
            variant="h1"
            color={FWDColors.greenDarker}
          />
          <TouchableOpacity onPress={onQuestionMarkPress}>
            <QuestionmarkCircle
              width={24}
              height={24}
              color={FWDColors.orange}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: spacer(8)}}>
          <Typography
            label={penaltyLabel}
            variant="l3-b"
            color={FWDColors.greenDarker}
          />
          <Text style={{marginTop: spacer(16)}}>
            <Typography
              label={'If you have questions or clarifications, contact '}
              variant="l3-b"
              color={FWDColors.greenDarker}
            />
            <Text style={[layoutStyles.row, layoutStyles.cover]}>
              <TouchableWithoutFeedback>
                <Typography
                  label="People "
                  variant="l3-m"
                  color={FWDColors.orange}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <Typography
                  label="and "
                  variant="l3-m"
                  color={FWDColors.orange}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <Typography
                  label="Culture"
                  variant="l3-m"
                  color={FWDColors.orange}
                />
              </TouchableWithoutFeedback>
              <Typography
                label={'.'}
                variant="l3-b"
                color={FWDColors.greenDarker}
              />
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MissedGracePeriodNotification;
