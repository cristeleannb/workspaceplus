import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useDebouncedValue} from 'rooks';

import {EmployeeSearchResultList, NavigationHeader} from '@/views';
import {
  AngleDownInput,
  Button,
  Close,
  FWDColors,
  InputField,
  Typography,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {useTransferParking} from '@/hooks/useTransferParking';

interface SearchBody {
  searchField?: string;
}

const searchSchema: yup.SchemaOf<SearchBody> = yup.object().shape({
  searchField: yup.string(),
});

const TransferParkingEmployeeListScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {
    control,
    watch,
    formState: {errors},
  } = useForm({
    mode: 'all',
    resolver: yupResolver(searchSchema),
  });

  const searchField = watch('searchField');
  const [debouncedSearchField] = useDebouncedValue(searchField, 600);

  const {
    employeeList,
    selectEmployeeForTransfer,
    setSearchKey,
    isFetchingData,
  } = useTransferParking();

  const goBack = () => {
    navigation.goBack();
  };

  const onEmployeeSelect = (id: string) => {
    selectEmployeeForTransfer(id);
    goBack();
  };

  useEffect(() => {
    setSearchKey(debouncedSearchField);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchField]);

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
              <Typography
                align="center"
                label="Transfer to"
                variant="l1-b"
                color={FWDColors.white}
              />
            }
            leftAction={
              <Button
                iconOnly
                icon={<Close />}
                size="small"
                color="light"
                onPress={goBack}
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
          <View>
            <Controller
              control={control}
              name="searchField"
              render={({field: {onBlur, onChange, value}}) => (
                <InputField
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  label="Transfer to"
                  error={errors.searchField?.message}
                  placeholder="Search"
                  rightIcon={
                    <AngleDownInput
                      width={24}
                      height={24}
                      color={FWDColors.greenDarker}
                    />
                  }
                />
              )}
            />

            {isFetchingData && (
              <View
                style={{
                  marginTop: spacer(24),
                }}>
                <ActivityIndicator size={24} color={FWDColors.orange} />
              </View>
            )}

            {employeeList.length > 0 && (
              <EmployeeSearchResultList
                searchResults={employeeList}
                onPress={onEmployeeSelect}
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TransferParkingEmployeeListScreen;
