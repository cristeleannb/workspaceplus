import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {NavigationKey} from '../config';
import {LoginScreen} from '@/screens';

export type StackAuthParamList = {
  [NavigationKey.SCREEN_LOGIN]: undefined;
};

const {Navigator, Screen} = createStackNavigator<StackAuthParamList>();

export const StackAuthNavigator = () => {
  return (
    <Navigator
      initialRouteName={NavigationKey.SCREEN_LOGIN}
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name={NavigationKey.SCREEN_LOGIN} component={LoginScreen} />
    </Navigator>
  );
};
