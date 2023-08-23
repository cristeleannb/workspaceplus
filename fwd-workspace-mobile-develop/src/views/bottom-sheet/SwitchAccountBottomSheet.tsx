import React, {useMemo} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import {useQueryClient} from 'react-query';

import {delay, layoutStyles, spacer} from '@/utils';
import {
  Avatar,
  FWDColors,
  RadioSelected,
  RadioUnselected,
  Typography,
} from '@/components';
import {useStores} from '@/stores';
import {useGetExecutiveList, useSwitchAccount} from '@/services/query';
import {EmployeeUserModel} from '@/services/api/api.service';
import {NavigationKey} from '@/navigations';

interface SwitchAccountBottomSheetProps {
  onLoadingState?: (loadingState: boolean) => void;
}

export const SwitchAccountBottomSheet = observer(
  (props: SwitchAccountBottomSheetProps) => {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const {authStore} = useStores();

    const {data, refetch: getExecutiveList} = useGetExecutiveList({
      employeeKeyId: authStore.executiveID || '',
    });

    const executiveList = useMemo(() => {
      return data?.executiveList || [];
    }, [data]);

    const reportingManager = useMemo(() => {
      return executiveList
        .filter(manager => manager.isManager === 1)
        .sort((a, b) => {
          let convertA = a.executiveName?.toUpperCase() || '';
          let convertB = b.executiveName?.toUpperCase() || '';

          if (convertA < convertB) {
            return -1;
          } else if (convertA > convertB) {
            return 1;
          } else {
            return 0;
          }
        });
    }, [executiveList]);

    const others = useMemo(() => {
      return executiveList
        .filter(manager => manager.isManager === 0)
        .sort((a, b) => {
          let convertA = a.executiveName?.toUpperCase() || '';
          let convertB = b.executiveName?.toUpperCase() || '';

          if (convertA < convertB) {
            return -1;
          } else if (convertA > convertB) {
            return 1;
          } else {
            return 0;
          }
        });
    }, [executiveList]);

    const {mutateAsync: switchAccount} = useSwitchAccount();

    const onSwitchAccount = async (executiveEmployeeKeyId: string) => {
      if (executiveEmployeeKeyId) {
        try {
          props.onLoadingState?.(true);

          queryClient.clear();

          const accountData: EmployeeUserModel = await switchAccount({
            employeeKeyId: executiveEmployeeKeyId,
          });

          if (accountData) {
            authStore.setUser(accountData);

            if (accountData.token) {
              authStore.setToken(accountData.token);
              getExecutiveList();

              navigation.navigate(NavigationKey.DRAWER_MAIN, {
                screen: NavigationKey.STACK_LANDING,
                params: {
                  screen: NavigationKey.SCREEN_LANDING,
                  params: {
                    switchSuccess: true,
                  },
                },
              });

              await delay(350);
              props.onLoadingState?.(false);
            }
          } else {
            return false;
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    };

    return (
      <View>
        <View style={[layoutStyles.fullHeight]}>
          <View style={[layoutStyles.row, layoutStyles.centerCenter]}>
            <Typography
              style={{marginLeft: spacer(4)}}
              label="Switch Account"
              variant="h2"
              color={FWDColors.greenDark}
              align="center"
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              onSwitchAccount(data?.eaEmployeeKeyId || '');
            }}
            disabled={authStore.user?.employeeKeyId === data?.eaEmployeeKeyId}
            style={[
              layoutStyles.row,
              layoutStyles.cover,
              layoutStyles.startCenter,
              {paddingVertical: spacer(24)},
            ]}>
            <View
              style={[
                layoutStyles.row,
                layoutStyles.cover,
                layoutStyles.startCenter,
              ]}>
              {/* TODO: update the avatar component to be supplied with imageUrl and gender */}
              <Avatar
                size={32}
                imageUrl={data?.employeeImage}
                gender={data?.employeeGender}
              />
              <Text
                numberOfLines={1}
                style={[
                  layoutStyles.row,
                  layoutStyles.cover,
                  {marginLeft: spacer(8)},
                ]}>
                <Typography
                  label={data?.executiveAssistantName || ''}
                  variant="h3"
                  color={FWDColors.greenDarker}
                  style={layoutStyles.cover}
                />
              </Text>
            </View>
            {authStore.user?.employeeKeyId === data?.eaEmployeeKeyId ? (
              <RadioSelected width={20} height={20} color={FWDColors.orange} />
            ) : (
              <RadioUnselected
                width={20}
                height={20}
                color={FWDColors.orange}
              />
            )}
          </TouchableOpacity>

          <View
            style={{
              borderColor: FWDColors.transparent,
              borderTopColor: FWDColors.grey1,
              borderWidth: spacer(1),
              paddingTop: spacer(24),
            }}>
            <ScrollView style={{marginRight: spacer(1)}}>
              <TouchableOpacity
                key={reportingManager[0]?.executiveEmployeeKeyId}
                onPress={() =>
                  onSwitchAccount(
                    reportingManager[0]?.executiveEmployeeKeyId || '',
                  )
                }
                disabled={
                  authStore.user?.employeeKeyId ===
                  reportingManager[0]?.executiveEmployeeKeyId
                }
                style={[
                  layoutStyles.row,
                  layoutStyles.startCenter,
                  {
                    marginBottom: spacer(24),
                  },
                ]}>
                <View
                  style={[
                    layoutStyles.row,
                    layoutStyles.cover,
                    layoutStyles.startCenter,
                  ]}>
                  {/* TODO: update the avatar component to be supplied with imageUrl and gender */}
                  <Avatar
                    size={32}
                    imageUrl={reportingManager[0]?.employeeImage}
                    gender={reportingManager[0]?.employeeGender}
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      layoutStyles.row,
                      layoutStyles.cover,
                      {marginLeft: spacer(8)},
                    ]}>
                    <Typography
                      label={reportingManager[0]?.executiveName || ''}
                      variant="h3"
                      color={FWDColors.greenDarker}
                      style={layoutStyles.cover}
                    />
                  </Text>
                </View>

                {authStore.user?.employeeKeyId ===
                reportingManager[0]?.executiveEmployeeKeyId ? (
                  <RadioSelected
                    width={20}
                    height={20}
                    color={FWDColors.orange}
                    style={{marginLeft: spacer(16)}}
                  />
                ) : (
                  <RadioUnselected
                    width={20}
                    height={20}
                    color={FWDColors.orange}
                    style={{marginLeft: spacer(16)}}
                  />
                )}
              </TouchableOpacity>

              {others.map(account => (
                <TouchableOpacity
                  key={account?.executiveEmployeeKeyId}
                  onPress={() =>
                    onSwitchAccount(account?.executiveEmployeeKeyId || '')
                  }
                  disabled={
                    authStore.user?.employeeKeyId ===
                    account?.executiveEmployeeKeyId
                  }
                  style={[
                    layoutStyles.row,
                    layoutStyles.startCenter,
                    {
                      marginBottom: others.length > 1 ? spacer(24) : spacer(0),
                    },
                  ]}>
                  <View
                    style={[
                      layoutStyles.row,
                      layoutStyles.cover,
                      layoutStyles.startCenter,
                    ]}>
                    {/* TODO: update the avatar component to be supplied with imageUrl and gender */}
                    <Avatar
                      size={32}
                      imageUrl={account.employeeImage}
                      gender={account.employeeGender}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        layoutStyles.row,
                        layoutStyles.cover,
                        {marginLeft: spacer(8)},
                      ]}>
                      <Typography
                        label={account?.executiveName || ''}
                        variant="h3"
                        color={FWDColors.greenDarker}
                        style={layoutStyles.cover}
                      />
                    </Text>
                  </View>

                  {authStore.user?.employeeKeyId ===
                  account.executiveEmployeeKeyId ? (
                    <RadioSelected
                      width={20}
                      height={20}
                      color={FWDColors.orange}
                      style={{marginLeft: spacer(16)}}
                    />
                  ) : (
                    <RadioUnselected
                      width={20}
                      height={20}
                      color={FWDColors.orange}
                      style={{marginLeft: spacer(16)}}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  },
);
