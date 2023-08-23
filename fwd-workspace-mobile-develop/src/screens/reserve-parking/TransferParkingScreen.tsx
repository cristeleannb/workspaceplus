import React, {useCallback, useEffect, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';

import {
  Button,
  Close,
  FWDColors,
  Typography,
  Parking,
  AngleDownInput,
  Calendar,
  Advisor2,
  Avatar,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {NavigationHeader} from '@/views';
import {NavigationKey} from '@/navigations';
import {useTransferParking} from '@/hooks/useTransferParking';
import {useTransferParkingSlotToEmployee} from '@/services/query';

const TransferParkingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {
    selectedSlot,
    selectedEmployee,
    formattedSelectedDates,
    selectedDatesForRequest,
    clearTransferParking,
  } = useTransferParking();

  const {mutateAsync: transferParkingSlot, isLoading: transferParkingLoading} =
    useTransferParkingSlotToEmployee();

  const onEmployeeSelection = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_TRANSFER_PARKING_EMPLOYEE_SELECTION,
      },
    });
  };

  const onDateSelection = useCallback(() => {
    if (selectedEmployee) {
      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_TRANSFER_PARKING_DATE_SELECTION,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployee]);

  const onTransferParking = async () => {
    try {
      await transferParkingSlot(selectedDatesForRequest);
      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_TRANSFER_PARKING_SUCCESS,
        },
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    return () => {
      clearTransferParking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canTransferParking = useMemo(() => {
    return !!selectedEmployee && !!formattedSelectedDates;
  }, [selectedEmployee, formattedSelectedDates]);

  const selectedEmployeeView = useMemo(() => {
    if (selectedEmployee) {
      return (
        <View
          style={{
            borderColor: FWDColors.grey4,
            borderWidth: spacer(1),
            borderRadius: spacer(4),
          }}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onEmployeeSelection}
            style={{
              paddingTop: spacer(4),
              paddingBottom: spacer(8),
              paddingHorizontal: spacer(12),
            }}>
            <View>
              <Typography
                label={'Transfer to'}
                variant="l3-m"
                color={FWDColors.grey4}
              />
            </View>
            <View style={[layoutStyles.row, layoutStyles.betweenCenter]}>
              <View
                style={[
                  layoutStyles.row,
                  layoutStyles.cover,
                  layoutStyles.startCenter,
                ]}>
                <Avatar
                  size={24}
                  gender={selectedEmployee?.employeeGender}
                  imageUrl={selectedEmployee?.employeeImage}
                />
                <View
                  style={{
                    marginLeft: spacer(8),
                  }}>
                  <Typography
                    label={selectedEmployee?.employeeName || ''}
                    variant="h1"
                    color={FWDColors.greenDarker}
                  />
                </View>
              </View>

              <AngleDownInput
                width={24}
                height={24}
                color={FWDColors.greenDarker}
              />
            </View>
            <View
              style={[
                layoutStyles.row,
                layoutStyles.startCenter,
                {
                  marginTop: spacer(4),
                },
              ]}>
              <Advisor2
                width={24}
                height={24}
                color={FWDColors.orange}
                style={{
                  marginRight: spacer(8),
                }}
              />
              <Typography
                label={selectedEmployee?.departmentName || ''}
                color={FWDColors.grey4}
                variant="l2-b"
                style={[layoutStyles.cover]}
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            borderColor: FWDColors.grey1,
            borderWidth: spacer(1),
            borderRadius: spacer(4),
          }}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onEmployeeSelection}
            style={{
              paddingVertical: spacer(4),
              paddingHorizontal: spacer(12),
            }}>
            <View style={[layoutStyles.row, layoutStyles.betweenCenter]}>
              <View>
                <View>
                  <Typography
                    label={'Transfer to'}
                    variant="l3-m"
                    color={FWDColors.grey4}
                  />
                </View>

                <View
                  style={{
                    marginTop: spacer(2),
                  }}>
                  <Typography
                    label="Search"
                    variant="l2-b"
                    color={FWDColors.grey4}
                  />
                </View>
              </View>

              <AngleDownInput
                width={24}
                height={24}
                color={FWDColors.greenDarker}
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployee]);

  const selectedDatesView = useMemo(() => {
    if (formattedSelectedDates) {
      return (
        <View
          style={{
            borderColor: FWDColors.grey4,
            borderWidth: spacer(1),
            borderRadius: spacer(4),
          }}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onDateSelection}
            style={{
              paddingVertical: spacer(4),
              paddingHorizontal: spacer(12),
            }}>
            <View style={[layoutStyles.row, layoutStyles.betweenCenter]}>
              <View>
                <View>
                  <Typography
                    label={'Select Dates'}
                    variant="l3-m"
                    color={FWDColors.grey4}
                  />
                </View>

                <View
                  style={{
                    marginTop: spacer(2),
                  }}>
                  <Typography
                    label={formattedSelectedDates}
                    variant="l2-b"
                    color={FWDColors.greenDarker}
                  />
                </View>
              </View>

              <Calendar width={20} height={20} color={FWDColors.greenDarker} />
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            borderColor: FWDColors.grey1,
            borderWidth: spacer(1),
            borderRadius: spacer(4),
          }}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onDateSelection}
            style={{
              paddingVertical: spacer(4),
              paddingHorizontal: spacer(12),
            }}>
            <View style={[layoutStyles.row, layoutStyles.betweenCenter]}>
              <View>
                <View>
                  <Typography
                    label={'Select Dates'}
                    variant="l3-m"
                    color={FWDColors.grey4}
                  />
                </View>

                <View
                  style={{
                    marginTop: spacer(2),
                  }}>
                  <Typography
                    label="Select"
                    variant="l2-b"
                    color={FWDColors.grey4}
                  />
                </View>
              </View>

              <Calendar width={20} height={20} color={FWDColors.greenDarker} />
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }, [formattedSelectedDates, onDateSelection]);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        layoutStyles.cover,
        {
          backgroundColor: FWDColors.orange,
        },
      ]}>
      <View
        style={[
          layoutStyles.cover,
          {
            backgroundColor: FWDColors.white,
            paddingBottom: spacer(insets.bottom),
          },
        ]}>
        <View>
          <NavigationHeader
            flat
            height={72}
            title={
              <View style={{marginLeft: spacer(12)}}>
                <Typography
                  label="Transfer Parking"
                  variant="l3-b"
                  color={FWDColors.white}
                />

                <View style={[layoutStyles.row, layoutStyles.startCenter]}>
                  <View
                    style={[
                      layoutStyles.centerCenter,
                      {
                        marginRight: spacer(4),
                        padding: spacer(2),
                      },
                    ]}>
                    <Parking height={18} width={18} color={FWDColors.white} />
                  </View>

                  <Typography
                    label={`Basement ${selectedSlot?.floor || 0}, ${
                      selectedSlot?.slot || ''
                    }`}
                    variant="h2"
                    color={FWDColors.white}
                  />
                </View>
              </View>
            }
            titleStyles={[layoutStyles.startCenter, {left: spacer(32)}]}
            leftAction={
              <Button
                iconOnly
                icon={<Close />}
                size="small"
                color="light"
                onPress={navigation.goBack}
              />
            }
          />
        </View>

        <View
          style={[
            layoutStyles.cover,
            {
              paddingVertical: spacer(24),
              paddingHorizontal: spacer(20),
            },
          ]}>
          <View>{selectedEmployeeView}</View>
          <View style={{marginTop: spacer(24)}}>{selectedDatesView}</View>
        </View>

        <View
          style={[
            {
              borderTopLeftRadius: spacer(16),
              borderTopRightRadius: spacer(16),
              backgroundColor: FWDColors.white,
              zIndex: spacer(7),
            },
          ]}>
          <View
            style={[
              layoutStyles.row,
              layoutStyles.startCenter,
              {
                paddingVertical: spacer(24),
                paddingHorizontal: spacer(20),
                borderTopWidth: spacer(1),
                borderTopColor: FWDColors.grey1,
              },
            ]}>
            <Button
              label="Transfer Parking"
              disabled={!canTransferParking}
              onPress={onTransferParking}
              loading={transferParkingLoading}
              style={layoutStyles.cover}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TransferParkingScreen;
