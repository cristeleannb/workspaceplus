import React, {createContext, useContext, useEffect} from 'react';
import {Platform} from 'react-native';
import {observer} from 'mobx-react';
import OneSignal from 'react-native-onesignal';

import {REACT_APP_ONESIGNAL_APP_ID} from 'react-native-dotenv';

export type TOneSignal = {
  setExternalUserId: (
    externalUserId: string,
    externalUserIdHash: string,
  ) => void;
  removeExternalUserId: () => void;
};

export const OneSignalContext = createContext<TOneSignal | null>(null);

export const OneSignalProvider: React.FC = observer(({children}) => {
  const checkIOSPrompt = async () => {
    const deviceState = await OneSignal.getDeviceState();
    if (deviceState?.isSubscribed === false) {
      OneSignal.addTrigger('prompt_ios', 'true');
    }
  };

  useEffect(() => {
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(REACT_APP_ONESIGNAL_APP_ID);

    if (Platform.OS === 'ios') {
      checkIOSPrompt();
    }
  }, []);

  const setExternalUserId = (
    externalUserId: string = '123456789',
    exteralUserIdHash: string = '',
  ) => {
    console.log('setExternalUserId called');
    // Setting External User Id with Callback Available in SDK Version 3.9.3+
    OneSignal.setExternalUserId(
      externalUserId,
      exteralUserIdHash,
      (results: any) => {
        // The results will contain push and email success statuses
        console.log('Results of setting external user id');
        console.log(results);

        // Push can be expected in almost every situation with a success status, but
        // as a pre-caution its good to verify it exists
        if (results.push && results.push.success) {
          console.log('Results of setting external user id push status:');
          console.log(results.push.success);
        }

        // Verify the email is set or check that the results have an email success status
        if (results.email && results.email.success) {
          console.log('Results of setting external user id email status:');
          console.log(results.email.success);
        }

        // Verify the number is set or check that the results have an sms success status
        if (results.sms && results.sms.success) {
          console.log('Results of setting external user id sms status:');
          console.log(results.sms.success);
        }
      },
    );
  };

  const removeExternalUserId = () => {
    OneSignal.removeExternalUserId();
  };

  return (
    <OneSignalContext.Provider
      value={{
        setExternalUserId,
        removeExternalUserId,
      }}>
      {children}
    </OneSignalContext.Provider>
  );
});

export const useOneSignal = () => {
  const _context = useContext(OneSignalContext);

  if (!_context) {
    throw new Error('You have forgotten to use OneSignalProvider.');
  }

  return _context;
};
