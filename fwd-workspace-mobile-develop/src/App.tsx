import React from 'react';
import {LogBox} from 'react-native';
import 'react-native-gesture-handler';

import {NavigationProvider} from '@/navigations';
import {StoreProvider} from '@/stores';
import {CustomModalProvider} from '@/modals';
import {ReactQueryProvider} from '@/services/query';
import {OneSignalProvider} from '@/hooks/useOneSignal';
import GlobalConfig from './GlobalConfig';

LogBox.ignoreLogs(['Setting a timer']);

const App = () => {
  return (
    <StoreProvider>
      <OneSignalProvider>
        <ReactQueryProvider>
          <CustomModalProvider>
            <GlobalConfig>
              <NavigationProvider />
            </GlobalConfig>
          </CustomModalProvider>
        </ReactQueryProvider>
      </OneSignalProvider>
    </StoreProvider>
  );
};

export default App;
