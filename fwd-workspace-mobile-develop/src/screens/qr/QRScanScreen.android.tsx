import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, View, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import LottieView from 'lottie-react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {BarcodeFormat, scanBarcodes, Barcode} from 'vision-camera-code-scanner';
import {runOnJS} from 'react-native-reanimated';
import {useModal} from 'react-native-modalfy';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import {
  Button,
  Left,
  FWDColors,
  Typography,
  Flash,
  ProofOfId,
} from '@/components';
import {delay, layoutStyles, spacer} from '@/utils';
import {NavigationHeader} from '@/views';
import {NavigationKey} from '@/navigations';
import {ModalStackParamsList} from '@/modals';
import {WSQRErrorMsgStatus} from '@/types';

import {useQRCheckInOut, useGetQRCheckInStatus} from '@/services/query';
import {PostQRRequest, CheckStatus} from '@/services/api/api.service';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const QRScanScreenAndroid = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const [hasPermission, setHasPermission] = useState(false);
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const devices = useCameraDevices();
  const device = devices.back;

  const [isActive, setIsActive] = useState(false);

  const {mutateAsync} = useQRCheckInOut();
  const {data, isFetching} = useGetQRCheckInStatus();

  const [showLoading, setShowLoading] = useState(false);
  const [torch, setTorch] = useState<'on' | 'off' | undefined>('off');

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE]);
    runOnJS(setBarcodes)(detectedBarcodes);
  }, []);

  const checkStatus = (dataString: string) => {
    try {
      const qrData = dataString.replace("http://'", '').replace("'", '');
      const qrDataParsed = JSON.parse(qrData);

      // show confirmation modal on `checked-in` status
      if (
        qrDataParsed.qrType === 'workstation' &&
        data?.workstationCheckStatus === CheckStatus.CheckedIn
      ) {
        openModal('CheckOutModal', {
          onYesPress: () => {
            closeModal();
            onReadQR(dataString);
          },
          onNoPress: () => {
            closeModal();
            setShowLoading(false);
          },
        });
      } else if (
        qrDataParsed.qrType === 'parking' &&
        data?.parkingCheckStatus === CheckStatus.CheckedIn
      ) {
        openModal('CheckOutModal', {
          onYesPress: () => {
            closeModal();
            onReadQR(dataString);
          },
          onNoPress: () => {
            closeModal();
            setShowLoading(false);
          },
        });
      } else {
        onReadQR(dataString);
      }
    } catch (_) {
      notWorking();
    }
  };

  const onReadQR = async (dataString: string) => {
    try {
      const qrData = dataString.replace("http://'", '').replace("'", '');

      const body: PostQRRequest = JSON.parse(qrData);
      const qrResponse = await mutateAsync(body);

      await reset();

      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_CHECK_IN_OUT_CONFIRM,
          params: {
            qrResponse,
          },
        },
      });
    } catch (error: any) {
      await reset();

      console.log('error', error?.status, error?.data);
      if (error?.status === 409) {
        switch (error?.data) {
          case WSQRErrorMsgStatus['no-reservation']:
            wrongSeat();
            break;

          case WSQRErrorMsgStatus['missed-time']:
            missedTime();
            break;

          case WSQRErrorMsgStatus['wrong-seat']:
            wrongSeat();
            break;

          case WSQRErrorMsgStatus['wrong-slot']:
            wrongSlot();
            break;

          default:
            notWorking();
            break;
        }
      } else {
        notWorking();
      }
    }
  };

  const wrongSeat = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_LANDING,
        params: {
          wsQRStatus: 'wrong-seat',
        },
      },
    });
  };

  const wrongSlot = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_LANDING,
        params: {
          wsQRStatus: 'wrong-slot',
        },
      },
    });
  };

  const notWorking = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_LANDING,
        params: {
          wsQRStatus: 'not-working',
        },
      },
    });
  };

  const missedTime = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_LANDING,
        params: {
          wsQRStatus: 'missed-time',
        },
      },
    });
  };

  const onPressGallery = async () => {
    await reset();

    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_QR_UPLOAD,
      },
    });
  };

  const goBack = async () => {
    await reset();
    navigation.goBack();
  };

  const reset = async () => {
    setTorch('off');
    setIsActive(false);
    await delay(150);
  };

  const onPressTorch = () => {
    switch (torch) {
      case 'off':
        setTorch('on');
        break;

      case 'on':
        setTorch('off');
        break;

      default:
        break;
    }
  };

  const checkCameraPermission = async () => {
    try {
      const cameraPermissionResult = await check(PERMISSIONS.ANDROID.CAMERA);
      switch (cameraPermissionResult) {
        case RESULTS.UNAVAILABLE:
          navigation.goBack();
          break;
        case RESULTS.DENIED:
          requestCameraPermission();
          break;
        case RESULTS.LIMITED:
          setHasPermission(true);
          break;
        case RESULTS.GRANTED:
          setHasPermission(true);
          break;
        case RESULTS.BLOCKED:
          openModal('NoCameraPermissionModal');
          navigation.goBack();
          break;
      }
    } catch (error) {
      navigation.goBack();
    }
  };

  const requestCameraPermission = async () => {
    try {
      const requestCameraPermissionResult = await request(
        PERMISSIONS.ANDROID.CAMERA,
      );
      switch (requestCameraPermissionResult) {
        case RESULTS.DENIED:
          openModal('NoCameraPermissionModal');
          navigation.goBack();
          break;
        case RESULTS.LIMITED:
          openModal('NoCameraPermissionModal');
          navigation.goBack();
          break;
        case RESULTS.GRANTED:
          setHasPermission(true);
          break;
        case RESULTS.BLOCKED:
          openModal('NoCameraPermissionModal');
          navigation.goBack();
          break;
      }
    } catch (error) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    checkCameraPermission();
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (barcodes && barcodes.length > 0) {
      const code = barcodes[0];
      if (code.displayValue && !showLoading) {
        setShowLoading(true);
        checkStatus(code.displayValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodes]);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
    }, []),
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        layoutStyles.cover,
        {
          backgroundColor: FWDColors.orange,
        },
      ]}>
      {showLoading && isFetching ? (
        <View
          style={[
            layoutStyles.centerCenter,
            {
              height: screenHeight,
              width: screenWidth,
            },
          ]}>
          <LottieView
            source={require('@/assets/animations/screen-loader.json')}
            autoPlay={true}
            loop={true}
            style={{
              height: spacer(640),
            }}
          />
        </View>
      ) : (
        <View
          style={[
            layoutStyles.cover,
            {
              backgroundColor: FWDColors.white,
              paddingBottom: spacer(insets.bottom),
            },
          ]}>
          <View style={[layoutStyles.cover]}>
            <NavigationHeader
              flat
              height={72}
              title={
                <Typography
                  label="Scan QR Code"
                  variant="h2"
                  color={FWDColors.white}
                />
              }
              leftAction={
                <Button
                  iconOnly
                  icon={<Left />}
                  size="small"
                  color="light"
                  onPress={goBack}
                />
              }
            />

            <View style={[layoutStyles.cover]}>
              {isActive && device != null && hasPermission && (
                <Camera
                  style={StyleSheet.absoluteFill}
                  device={device}
                  isActive={isActive}
                  torch={torch}
                  frameProcessor={frameProcessor}
                  frameProcessorFps={5}
                />
              )}

              <View
                style={[
                  layoutStyles.absolute,
                  layoutStyles.row,
                  layoutStyles.betweenCenter,
                  layoutStyles.fullWidth,
                  {
                    bottom: spacer(64),
                    paddingHorizontal: spacer(75),
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={onPressTorch}
                  style={{
                    padding: spacer(8),
                    borderColor: FWDColors.white,
                    borderWidth: spacer(1),
                    borderRadius: spacer(9999),
                  }}>
                  <Flash color={FWDColors.white} height={24} width={24} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={onPressGallery}
                  style={{
                    padding: spacer(8),
                    borderColor: FWDColors.white,
                    borderWidth: spacer(1),
                    borderRadius: spacer(9999),
                  }}>
                  <ProofOfId color={FWDColors.white} height={24} width={24} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default QRScanScreenAndroid;
