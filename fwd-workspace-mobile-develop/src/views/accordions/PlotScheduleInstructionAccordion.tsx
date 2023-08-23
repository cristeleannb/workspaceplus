import React, {useState, memo, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {AngleDownThin} from '@/components/icons';
import {Calendar} from '@/components/pictograms';
import {FWDColors, ShadowView, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {useTimeframe} from '@/hooks/useTimeframe';
import {useGetPlanSchedule} from '@/services/query';

interface PlotScheduleInstructionAccordionProps {
  remoteCredits?: number;
  officeCredits?: number;
  onPress?: () => void;
}

export const PlotScheduleInstructionAccordion = memo(
  ({
    remoteCredits,
    officeCredits,
    onPress,
  }: PlotScheduleInstructionAccordionProps) => {
    const {planScheduleDeadline, planSchedulePeriod} = useTimeframe();
    const {data: planSchedule} = useGetPlanSchedule(planSchedulePeriod);

    const [isVisible, setIsVisible] = useState(
      planSchedule?.recordStatus === 3 ? false : true,
    );
    const angleDownRotateZ = useSharedValue(isVisible ? 180 : 0);

    const angleDownTransitionStyle = useAnimatedStyle(() => ({
      transform: [{rotateZ: `${angleDownRotateZ.value}deg`}],
    }));

    useEffect(() => {
      const degree = isVisible ? 180 : 0;
      angleDownRotateZ.value = withTiming(degree);
    }, [isVisible, angleDownRotateZ]);

    return (
      <ShadowView
        level={6}
        style={[
          layoutStyles.fullWidth,
          {
            borderRadius: spacer(8),
            paddingHorizontal: spacer(16),
            paddingVertical: spacer(20),
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            setIsVisible(!isVisible);
            onPress?.();
          }}
          style={[layoutStyles.row, layoutStyles.fullWidth]}>
          <View
            style={[
              layoutStyles.row,
              layoutStyles.cover,
              {
                marginRight: spacer(12),
              },
            ]}>
            <Calendar height={24} width={24} />
            <Typography
              variant="h1"
              color={FWDColors.greenDarker}
              label={`Plot your work schedule for next month until ${planScheduleDeadline}`}
              style={[
                layoutStyles.cover,
                {
                  marginLeft: spacer(12),
                },
              ]}
            />
          </View>
          <View>
            <Animated.View style={angleDownTransitionStyle}>
              <AngleDownThin
                height={24}
                width={24}
                color={FWDColors.greenDarker}
              />
            </Animated.View>
          </View>
        </TouchableOpacity>

        <View>
          {isVisible ? (
            <View
              style={{
                marginTop: spacer(20),
                marginLeft: spacer(2),
              }}>
              <FlatList
                data={[
                  <Text key={1} style={styles.item}>
                    <Typography
                      label="•   Maximum of "
                      variant="l3-m"
                      color={FWDColors.grey4}
                    />
                    <Typography
                      label={`${remoteCredits} WFA/WFB `}
                      variant="l3-bold"
                      color={FWDColors.grey4}
                    />
                    <Typography
                      label="combined"
                      variant="l3-m"
                      color={FWDColors.grey4}
                    />
                  </Text>,
                  <Text key={2} style={styles.item}>
                    <Typography
                      label="•   Minimum of "
                      variant="l3-m"
                      color={FWDColors.grey4}
                    />
                    <Typography
                      label={`${officeCredits} WFO `}
                      variant="l3-bold"
                      color={FWDColors.grey4}
                    />
                    <Typography
                      label="is required"
                      variant="l3-m"
                      color={FWDColors.grey4}
                    />
                  </Text>,
                ]}
                renderItem={({item}) => item}
              />
            </View>
          ) : null}
        </View>
      </ShadowView>
    );
  },
);

const styles = StyleSheet.create({
  item: {
    marginVertical: spacer(2),
    marginLeft: spacer(16),
  },
  rotateUp: {
    transform: [{rotateZ: '-180deg'}],
  },
});
