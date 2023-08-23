import React, {useCallback, useState} from 'react';
import {
  Image,
  FlatList,
  View,
  Platform,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {launchCamera} from 'react-native-image-picker';
import CameraRoll from '@react-native-community/cameraroll';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import LottieView from 'lottie-react-native';
import QrImageReader from 'react-native-qr-image-reader';

import {Button, Left, FWDColors, Typography, Cam} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {NavigationHeader} from '@/views';
import {NavigationKey} from '@/navigations';
import {WSQRErrorMsgStatus} from '@/types';

import {useQRCheckInOut} from '@/services/query';
import {PostQRRequest} from '@/services/api/api.service';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const hasAndroidPermission = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
};

const UploadQRScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {mutateAsync} = useQRCheckInOut();

  const [showLoading, setShowLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<
    CameraRoll.PhotoIdentifier[]
  >([]);
  const [, setAlbumList] = useState<CameraRoll.Album[]>([]);

  const onUseCamera = async () => {
    const {assets} = await launchCamera({mediaType: 'photo'});

    try {
      const uri = assets && assets[0].uri;

      if (uri) {
        await CameraRoll.save(uri);
        getImages();

        const {result} = await QrImageReader.decode({path: uri});

        if (result) {
          validateQR(result);
        } else {
          notWorking();
        }
      }
    } catch (error) {
      console.log(error);
      notWorking();
    }
  };

  const getQRData = async (img: CameraRoll.PhotoIdentifier) => {
    setShowLoading(true);

    const {uri, width, height} = img.node.image;

    try {
      /**
       * this is an extra step for reading the QR image because
       * the CameraRoll returns a `uri` that is will cause an error
       * when using the RNQRGenerator.detect
       *
       * we will create a temporary file using RNFS then get the base64
       * then use RNQRGenerator.detect to detect the QR image data
       *
       * source - https://stackoverflow.com/a/59032377
       */
      if (Platform.OS === 'ios') {
        if (uri.startsWith('ph://')) {
          const imagePATH = uri.substring(5, 41);
          let photoPATH = `assets-library://asset/asset.JPG?id=${imagePATH}&ext=JPG`;

          const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()
            .toString(36)
            .substring(7)}.jpg`;

          // create a temporary copy of the file
          const fileCopy = await RNFS.copyAssetsFileIOS(
            photoPATH,
            dest,
            width,
            height,
            1.0,
            1.0,
            'contain',
          );

          const {result} = await QrImageReader.decode({path: fileCopy});

          if (result) {
            validateQR(result);
          } else {
            notWorking();
          }
        }
      } else if (Platform.OS === 'android') {
        const {result} = await QrImageReader.decode({path: uri});

        if (result) {
          validateQR(result);
        } else {
          notWorking();
        }
      }
    } catch (error) {
      console.log('error', error);
      notWorking();
    }
  };

  const validateQR = async (data: string) => {
    try {
      const qrData = data.replace("http://'", '').replace("'", '');
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

  const getImages = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    const {edges} = await CameraRoll.getPhotos({
      first: 99,
      assetType: 'Photos',
    });

    // encountered timing issue
    setTimeout(() => {
      setGalleryImages(edges);
    }, 100);
  };

  const getAlbumList = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    const data = await CameraRoll.getAlbums({assetType: 'Photos'});

    // encountered timing issue
    setTimeout(() => {
      setAlbumList(data);
    }, 100);
  };

  useFocusEffect(
    useCallback(() => {
      getImages();
      getAlbumList();
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
      {showLoading ? (
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
              titleStyles={[layoutStyles.startCenter, {left: spacer(32)}]}
              title={
                <View style={{marginLeft: spacer(12)}}>
                  <Typography
                    label="Gallery"
                    variant="h2"
                    color={FWDColors.white}
                  />
                </View>
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
              rightAction={
                <Button
                  iconOnly
                  icon={<Cam />}
                  size="small"
                  color="light"
                  onPress={onUseCamera}
                />
              }
            />

            <FlatList
              data={galleryImages}
              renderItem={({item}) => (
                <View
                  style={[
                    layoutStyles.cover,
                    {
                      margin: spacer(2),
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      getQRData(item);
                    }}>
                    <Image
                      style={[
                        layoutStyles.centerCenter,
                        {
                          height: spacer(120),
                        },
                      ]}
                      source={{uri: item.node.image.uri}}
                    />
                  </TouchableOpacity>
                </View>
              )}
              numColumns={3}
              keyExtractor={item => item.node.timestamp.toString()}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default UploadQRScreen;
