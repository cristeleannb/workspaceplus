import React, {useEffect, useState} from 'react';
import {Dimensions, View, TouchableOpacity} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import LottieView from 'lottie-react-native';
import {CameraScreen} from 'react-native-camera-kit';
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
import {layoutStyles, spacer} from '@/utils';
import {NavigationHeader} from '@/views';
import {NavigationKey} from '@/navigations';
import {ModalStackParamsList} from '@/modals';
import {WSQRErrorMsgStatus} from '@/types';

import {useQRCheckInOut, useGetQRCheckInStatus} from '@/services/query';
import {PostQRRequest, CheckStatus} from '@/services/api/api.service';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const QRScanScreenIOS = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {openModal, closeModal} = useModal<ModalStackParamsList>();

  const [hasPermission, setHasPermission] = useState(false);

  const {mutateAsync} = useQRCheckInOut();
  const {data, isFetching} = useGetQRCheckInStatus();

  const [showLoading, setShowLoading] = useState(false);
  const [torch, setTorch] = useState<'on' | 'off' | undefined>('off');

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

  const onPressGallery = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_QR_UPLOAD,
      },
    });
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
      const cameraPermissionResult = await check(PERMISSIONS.IOS.CAMERA);
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
        PERMISSIONS.IOS.CAMERA,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  onPress={navigation.goBack}
                />
              }
            />

            <View style={[layoutStyles.cover]}>
              {hasPermission && (
                <CameraScreen
                  focusMode="off"
                  zoomMode="off"
                  scanBarcode={true}
                  onReadCode={(event: any) => {
                    if (event?.nativeEvent?.codeStringValue && !showLoading) {
                      setShowLoading(true);
                      checkStatus(event.nativeEvent.codeStringValue);
                    }
                  }}
                  showFrame={true}
                  laserColor={FWDColors.white}
                  frameColor={FWDColors.orange}
                  cameraRatioOverlay={undefined}
                  captureButtonImage={undefined}
                  cameraFlipImage={undefined}
                  hideControls={true}
                  torchOnImage={undefined}
                  torchOffImage={undefined}
                  onBottomButtonPressed={() => {}}
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

export default QRScanScreenIOS;
