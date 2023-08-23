import React, {useCallback, useRef, useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {EdgeInsets} from 'react-native-safe-area-context';
import {DrawerActions, useNavigation} from '@react-navigation/core';
import {useModal} from 'react-native-modalfy';
import {ScrollView} from 'react-native-gesture-handler';
import {observer} from 'mobx-react';
import {useQueryClient} from 'react-query';
import BottomSheet from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import VersionInfo from 'react-native-version-info';

import {delay, layoutStyles, spacer} from '@/utils';
import {
  Avatar,
  Button,
  DynamicBottomSheet,
  FWDColors,
  Typography,
} from '@/components';
import {FocusAwareStatusBar, SwitchAccountBottomSheet} from '@/views';
import {
  Advisor2,
  AngleDownThin,
  Id,
  Left,
  Logout,
  Team,
} from '@/components/icons';
import {useStores} from '@/stores';
import {ModalStackParamsList} from '@/modals';
import {useTransferParking} from '@/hooks/useTransferParking';
import {useOneSignal} from '@/hooks/useOneSignal';
import {useLogout} from '@/services/query';

interface SideMenuScreenProps {
  insets: EdgeInsets;
}

const SideMenuScreen = (props: SideMenuScreenProps) => {
  const navigation = useNavigation();
  const {authStore} = useStores();
  const {removeExternalUserId} = useOneSignal();
  const {openModal, closeModal} = useModal<ModalStackParamsList>();
  const queryClient = useQueryClient();
  const [isSwitching, setIsSwitching] = useState(false);
  const transitionRef = useRef(null);
  const sheetRef = useRef<BottomSheet>(null);

  const {clearTransferParking} = useTransferParking();
  const {mutateAsync: logoutUser} = useLogout();

  const onClose = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const onLogout = () => {
    openModal('LogoutModal', {
      onYesPress: logout,
    });
  };

  const onSwitchAccountPress = useCallback(() => {
    sheetRef.current?.expand();
  }, []);

  const logout = async () => {
    closeModal('LogoutModal');

    try {
      await logoutUser();
      removeExternalUserId();
      authStore.setToken(null);
      await delay(1200);
      queryClient.clear();
      authStore.logout();
      clearTransferParking();
    } catch (error) {}
  };

  useEffect(() => {
    if (!isSwitching) {
      sheetRef.current?.close();
    }
  }, [isSwitching]);

  return (
    <View
      style={[
        layoutStyles.cover,
        {
          paddingBottom: spacer(props.insets.bottom),
        },
      ]}>
      <FocusAwareStatusBar />

      <View
        style={[
          layoutStyles.cover,
          {
            paddingTop: spacer(props.insets.top + 16),
            paddingHorizontal: spacer(16),
            backgroundColor: FWDColors.orange,
            borderBottomLeftRadius: spacer(32),
          },
        ]}>
        <View style={[layoutStyles.row, layoutStyles.endCenter]}>
          <Button
            iconOnly
            color="light"
            size="small"
            icon={<Left width={24} height={24} />}
            onPress={onClose}
          />
        </View>

        <ScrollView style={layoutStyles.cover}>
          <View
            style={{
              paddingHorizontal: spacer(16),
            }}>
            <View
              style={{
                marginTop: spacer(24),
              }}>
              <Avatar
                size={106}
                imageUrl={authStore.user?.employeeImage}
                gender={authStore.user?.employeeGender}
              />
            </View>

            <View
              style={[
                layoutStyles.row,
                layoutStyles.startCenter,
                {
                  marginTop: spacer(24),
                },
              ]}>
              <View style={layoutStyles.cover}>
                <Typography
                  label={`${authStore.user?.employeeFullName}`}
                  color={FWDColors.white}
                  variant="h4"
                  style={layoutStyles.cover}
                />
              </View>
              {authStore.isExecutive ? (
                <Button
                  iconOnly
                  color="light"
                  size="small"
                  icon={
                    <AngleDownThin
                      width={16}
                      height={16}
                      color={FWDColors.white}
                    />
                  }
                  onPress={onSwitchAccountPress}
                  style={{
                    marginLeft: spacer(16),
                  }}
                />
              ) : null}
            </View>

            <View
              style={{
                marginTop: spacer(24),
              }}>
              <View>
                <Typography
                  label="Position"
                  variant="l3-b"
                  color={FWDColors.white}
                />
                <View
                  style={[
                    layoutStyles.row,
                    layoutStyles.startCenter,
                    {
                      marginTop: spacer(8),
                    },
                  ]}>
                  <View
                    style={[
                      layoutStyles.centerCenter,
                      {
                        width: spacer(24),
                        height: spacer(24),
                        borderRadius: spacer(24),
                        backgroundColor: FWDColors.white,
                        marginRight: spacer(8),
                      },
                    ]}>
                    <Advisor2 color={FWDColors.orange} width={18} height={18} />
                  </View>

                  <Typography
                    label={authStore.user?.employeePositionTitle || ''}
                    variant="h2"
                    color={FWDColors.white}
                    style={layoutStyles.cover}
                  />
                </View>
              </View>

              <View
                style={{
                  marginTop: spacer(16),
                }}>
                <Typography
                  label="Team"
                  variant="l3-b"
                  color={FWDColors.white}
                />
                <View
                  style={[
                    layoutStyles.row,
                    layoutStyles.startCenter,
                    {
                      marginTop: spacer(8),
                    },
                  ]}>
                  <View
                    style={[
                      layoutStyles.centerCenter,
                      {
                        width: spacer(24),
                        height: spacer(24),
                        borderRadius: spacer(24),
                        backgroundColor: FWDColors.white,
                        marginRight: spacer(8),
                      },
                    ]}>
                    <Team color={FWDColors.orange} width={18} height={18} />
                  </View>

                  <Typography
                    label={authStore.user?.departmentName || ''}
                    variant="h2"
                    color={FWDColors.white}
                  />
                </View>
              </View>

              <View
                style={{
                  marginTop: spacer(16),
                }}>
                <Typography
                  label="Employee ID"
                  variant="l3-b"
                  color={FWDColors.white}
                />
                <View
                  style={[
                    layoutStyles.row,
                    layoutStyles.startCenter,
                    {
                      marginTop: spacer(8),
                    },
                  ]}>
                  <View
                    style={[
                      layoutStyles.centerCenter,
                      {
                        width: spacer(24),
                        height: spacer(24),
                        borderRadius: spacer(24),
                        backgroundColor: FWDColors.white,
                        marginRight: spacer(8),
                      },
                    ]}>
                    <Id color={FWDColors.orange} width={18} height={18} />
                  </View>

                  <Typography
                    label={authStore.user?.employeeKeyId || ''}
                    variant="h2"
                    color={FWDColors.white}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <View
        style={[
          layoutStyles.row,
          layoutStyles.startCenter,
          {
            padding: spacer(24),
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={[
            layoutStyles.row,
            layoutStyles.startCenter,
            layoutStyles.cover,
          ]}
          onPress={onLogout}>
          <Button
            iconOnly
            color="primary"
            size="small"
            icon={<Logout width={24} height={24} />}
            style={{
              marginRight: spacer(16),
            }}
            onPress={onLogout}
          />
          <Typography label="Logout" variant="b3-m" />
        </TouchableOpacity>

        <Typography
          label={`v${VersionInfo.appVersion} (${VersionInfo.buildVersion})`}
          color={FWDColors.grey3}
          variant="l3-b"
        />
      </View>

      {authStore.isExecutive && (
        <DynamicBottomSheet ref={sheetRef}>
          <SwitchAccountBottomSheet
            onLoadingState={switchingState => setIsSwitching(switchingState)}
          />
        </DynamicBottomSheet>
      )}

      {isSwitching && (
        <View
          style={[
            layoutStyles.cover,
            layoutStyles.centerCenter,
            layoutStyles.absolute,
            {
              top: spacer(0),
              left: spacer(0),
              right: spacer(0),
              bottom: spacer(0),
              backgroundColor: FWDColors.orange,
            },
          ]}>
          <LottieView
            ref={transitionRef}
            source={require('@/assets/animations/screen-loader.json')}
            autoPlay={true}
            loop={true}
            style={{
              height: spacer(640),
            }}
          />
        </View>
      )}
    </View>
  );
};

export default observer(SideMenuScreen);
