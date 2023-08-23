import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  Text,
  GestureResponderEvent,
  Linking,
  Animated,
  Easing,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LottieView from 'lottie-react-native';
import VersionInfo from 'react-native-version-info';

import {delay, layoutStyles, spacer} from '@/utils';
import {
  FocusAwareStatusBar,
  LoginTips,
  SecurityTipsBottomSheet,
  LoginGenericErrorNote,
  LoginAccountDisabledErrorNote,
  LoginAccountDoesNotExistErrorNote,
  LoginAttemptsErrorNote,
} from '@/views';
import {
  Button,
  DynamicBottomSheet,
  FWDColors,
  InputField,
  PasswordShow,
  ShadowView,
  Typography,
} from '@/components';
import {LogoOrangeText} from '@/components/logotypes';
import {useLogin} from '@/services/query';
import {useStores} from '@/stores';
import {useAnimatedValue} from '@/utils/animations';
import {EmployeeUserModel} from '@/services/api/api.service';
import {useOneSignal} from '@/hooks/useOneSignal';

const {height: screenHeight} = Dimensions.get('screen');
const minHeight = 685;

const forgotPasswordLink = 'https://apps.fwd.com.ph/PasswordReset/';
const serviceDeskNumber = '09178165417';

interface LoginBody {
  username: string;
  password: string;
}

const loginSchema: yup.SchemaOf<LoginBody> = yup.object().shape({
  username: yup
    .string()
    .max(10, 'Can not be more than 10 characters')
    .required('Please enter your username'),
  password: yup.string().required('Please enter your password'),
});

const LoginVersion = () => {
  const {bottom: safeBottomArea} = useSafeAreaInsets();
  return (
    <View
      style={[
        layoutStyles.row,
        layoutStyles.centerStart,
        {
          paddingBottom: (safeBottomArea || 6) + spacer(24),
        },
      ]}>
      <Typography
        label={`v${VersionInfo.appVersion} (${VersionInfo.buildVersion})`}
        color={FWDColors.grey3}
        variant="l3-b"
      />
    </View>
  );
};

interface LoginBottomViewProps {
  onTipsPress?: (event: GestureResponderEvent) => void;
  onHelpPress?: (event: GestureResponderEvent) => void;
}
const LoginBottomView = (props: LoginBottomViewProps) => {
  return (
    <View>
      <LoginTips onTipsPress={props.onTipsPress} />

      <View
        style={[
          layoutStyles.row,
          layoutStyles.centerCenter,
          {
            marginTop: spacer(24),
          },
        ]}>
        <Text style={layoutStyles.textCenter}>
          <Typography
            align="center"
            label="If you have problems with your Single Sign-On, please contact "
          />
          <Typography
            onPress={props.onHelpPress}
            align="center"
            label="Service Desk"
            color={FWDColors.orange}
          />
        </Text>
      </View>
    </View>
  );
};

const LoginScreen = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const transitionRef = useRef(null);
  const animationPosition = useAnimatedValue(screenHeight);
  const animationOpacity = useAnimatedValue(0);

  const {authStore} = useStores();

  const {
    handleSubmit,
    control,
    getValues,
    formState: {isValid, errors},
  } = useForm<LoginBody>({
    mode: 'all',
    resolver: yupResolver(loginSchema),
  });

  const {setExternalUserId} = useOneSignal();

  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAccountDisabled, setIsAccountDisabled] = useState<boolean>(false);
  const [isAccountDoesNotExist, setIsAccountDoesNotExist] =
    useState<boolean>(false);
  const [isAttemptError, setIsAttemptError] = useState<boolean>(false);
  const [remainingAttempt, setRemainingAttempt] = useState<number>(3);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isLoginDataLoaded, setIsLoginDataLoaded] = useState(false);

  const {mutateAsync: login, isLoading} = useLogin();

  const onHelpPress = useCallback(() => {
    // TODO: update service desk number
    Linking.openURL(`tel:${serviceDeskNumber}`);
  }, []);

  const onTipsPress = useCallback(() => {
    sheetRef.current?.expand();
  }, []);

  const onSheetClose = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const onLogin = async () => {
    const clearErrorNote = () => {
      setLoginError(null);
      setIsAttemptError(false);
      setIsAccountDisabled(false);
      setIsAccountDoesNotExist(false);
    };

    if (isValid) {
      const {username, password} = getValues();

      try {
        clearErrorNote();

        const loginData: EmployeeUserModel = await login({
          username,
          password,
        });
        hideView();

        setIsLoginDataLoaded(true);
        await delay(1000);

        authStore.setUser(loginData);

        if (loginData.token) {
          authStore.setToken(loginData.token);

          if (!!loginData.oneSignalId && !!loginData.oneSignalHash) {
            setExternalUserId(loginData.oneSignalId, loginData.oneSignalHash);
          }
        }
      } catch (error: any) {
        clearErrorNote();

        if (error.data?.messageReturnNumber === 0) {
          setIsAccountDoesNotExist(true);
        } else if (
          error?.data?.messageReturnNumber === -2 &&
          error?.data?.wrongPasswordCounter >= 3
        ) {
          setIsAccountDisabled(true);
        } else if (
          error?.data?.messageReturnNumber === -4 &&
          error?.data?.wrongPasswordCounter > 0
        ) {
          setIsAttemptError(true);
          setRemainingAttempt(3 - error?.data?.wrongPasswordCounter);
        } else {
          if (error?.data && error.data?.message) {
            setLoginError(error.data.message);
          }
        }
      }
    }
  };

  const onForgotPasswordPress = useCallback(() => {
    Linking.openURL(forgotPasswordLink);
  }, []);

  const hideView = () => {
    animationPosition.startTiming({
      toValue: screenHeight,
      duration: 500,
      easing: Easing.ease,
    });
    animationOpacity.startTiming({
      toValue: 0,
      duration: 450,
      easing: Easing.ease,
    });
  };

  const showView = useCallback(() => {
    animationPosition.startTiming({
      toValue: 0,
      duration: 500,
      easing: Easing.ease,
    });
    animationOpacity.startTiming({
      toValue: 1,
      duration: 450,
      easing: Easing.ease,
    });
  }, [animationPosition, animationOpacity]);

  const togglePass = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  useEffect(() => {
    showView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[layoutStyles.cover]}>
      <FocusAwareStatusBar />
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
            layoutStyles.absolute,
            {
              top: spacer(144),
              left: spacer(0),
              right: spacer(0),
              bottom: spacer(0),
            },
          ]}>
          <View
            style={[
              layoutStyles.cover,
              layoutStyles.centerCenter,
              layoutStyles.absolute,
              {
                top: spacer(-144),
                left: spacer(0),
                right: spacer(0),
                bottom: spacer(0),
                backgroundColor: FWDColors.orange,
                opacity: spacer(isLoginDataLoaded ? 1 : 0),
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
          <Animated.View
            style={[
              layoutStyles.cover,
              {
                opacity: animationOpacity.value,
                transform: [
                  {
                    translateY: animationPosition.value,
                  },
                ],
              },
            ]}>
            <View
              style={[
                layoutStyles.cover,
                {
                  backgroundColor: FWDColors.white,
                  borderTopLeftRadius: spacer(24),
                },
              ]}>
              <View
                style={[
                  layoutStyles.startCenter,
                  {
                    marginTop: spacer(-60),
                  },
                ]}>
                <ShadowView
                  level={3}
                  style={[
                    layoutStyles.centerCenter,
                    {
                      width: spacer(120),
                      height: spacer(120),
                      borderRadius: spacer(120),
                    },
                  ]}>
                  <LogoOrangeText width={68} height={40} />
                </ShadowView>
              </View>
              <ScrollView
                style={[
                  layoutStyles.cover,
                  {
                    marginVertical: spacer(16),
                    paddingHorizontal: spacer(24),
                  },
                ]}>
                <View>
                  {isAttemptError && (
                    <LoginAttemptsErrorNote count={remainingAttempt} />
                  )}

                  {isAccountDisabled && <LoginAccountDisabledErrorNote />}

                  {isAccountDoesNotExist && (
                    <LoginAccountDoesNotExistErrorNote />
                  )}

                  {loginError && <LoginGenericErrorNote message={loginError} />}

                  <View
                    style={{
                      paddingVertical: spacer(16),
                    }}>
                    <View>
                      <Controller
                        control={control}
                        name="username"
                        render={({field: {onBlur, onChange, value}}) => (
                          <InputField
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            label="Username"
                            error={errors.username?.message}
                          />
                        )}
                      />
                    </View>
                    <View
                      style={{
                        marginTop: spacer(24),
                      }}>
                      <Controller
                        control={control}
                        name="password"
                        render={({field: {onBlur, onChange, value}}) => (
                          <InputField
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            label="Password"
                            secureTextEntry={isPasswordHidden}
                            rightIcon={
                              <PasswordShow
                                width={24}
                                height={24}
                                color={
                                  isPasswordHidden
                                    ? FWDColors.greenDarker
                                    : FWDColors.orange
                                }
                              />
                            }
                            onRightIconPress={togglePass}
                            error={errors.password?.message}
                          />
                        )}
                      />
                    </View>
                    <View
                      style={[
                        layoutStyles.row,
                        layoutStyles.endCenter,
                        {
                          marginTop: spacer(16),
                        },
                      ]}>
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={onForgotPasswordPress}>
                        <Typography
                          label="Forgot Password?"
                          color={FWDColors.greenDarker}
                          variant="l3-m"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: spacer(24),
                    }}>
                    <Button
                      label="Log in"
                      onPress={handleSubmit(onLogin)}
                      disabled={!isValid}
                      loading={isLoading}
                    />
                  </View>
                </View>

                {screenHeight < minHeight && (
                  <View style={[{paddingTop: spacer(40)}]}>
                    <LoginBottomView
                      onHelpPress={onHelpPress}
                      onTipsPress={onTipsPress}
                    />

                    <View
                      style={{
                        marginTop: spacer(24),
                      }}>
                      <LoginVersion />
                    </View>
                  </View>
                )}
              </ScrollView>

              {screenHeight >= minHeight && (
                <>
                  <View
                    style={{
                      paddingHorizontal: spacer(24),
                      paddingBottom: spacer(24),
                    }}>
                    <LoginBottomView
                      onHelpPress={onHelpPress}
                      onTipsPress={onTipsPress}
                    />
                  </View>

                  <LoginVersion />
                </>
              )}
            </View>
          </Animated.View>
        </View>

        <DynamicBottomSheet ref={sheetRef}>
          <SecurityTipsBottomSheet onClose={onSheetClose} />
        </DynamicBottomSheet>
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen;
