import React, {useEffect, useState} from 'react';
import SplashScreen from 'react-native-lottie-splash-screen';

import {TimeframeProvider} from '@/hooks/useTimeframe';
import {
  useGetAppSetting,
  useGetProfile,
  useGetWorkTypes,
} from '@/services/query';
import {useStores} from '@/stores';
import {ToastMessageProvider} from '@/toast/useToastMessage';
import {delay} from '@/utils';
import {WorkDateProvider} from '@/hooks/useWorkDate';
import {TransferParkingProvider} from './hooks/useTransferParking';
import {ParkingDateProvider} from '@/hooks/useParkingDate';

const GlobalConfig: React.FC = ({children}) => {
  const {appSettingStore, authStore, workTypeStore} = useStores();
  const {data: workTypes} = useGetWorkTypes();
  const {refetch: getUserProfile} = useGetProfile();
  const {data: appSetting} = useGetAppSetting();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (workTypes) {
      workTypeStore.setWorkTypes(workTypes.workTypeModelList || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workTypes]);

  const hideSplash = async () => {
    await delay(1500);
    setLoaded(true);
    SplashScreen.hide();
  };

  const getCurrentUserProfile = async () => {
    try {
      const {data: userProfile} = await getUserProfile();
      authStore.setUser(userProfile || null);
    } catch (error) {
      authStore.logout();
      // TODO: Handle error
    }

    hideSplash();
  };

  useEffect(() => {
    if (authStore.authenticated) {
      getCurrentUserProfile();
    } else {
      hideSplash();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStore.authenticated]);

  useEffect(() => {
    if (appSetting) {
      appSettingStore.setAppSetting(appSetting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appSetting]);

  return (
    <>
      <ToastMessageProvider>
        <TransferParkingProvider>
          <WorkDateProvider>
            <ParkingDateProvider>
              <TimeframeProvider>{loaded && children}</TimeframeProvider>
            </ParkingDateProvider>
          </WorkDateProvider>
        </TransferParkingProvider>
      </ToastMessageProvider>
    </>
  );
};

export default GlobalConfig;
