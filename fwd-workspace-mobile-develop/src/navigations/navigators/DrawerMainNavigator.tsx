import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigatorScreenParams} from '@react-navigation/native';

import {NavigationKey} from '../config';
import {SideMenuScreen} from '@/screens';

import {
  StackLandingNavigator,
  StackLandingParamList,
} from './StackLandingNavigator';

export type DrawerMainParamList = {
  [NavigationKey.STACK_LANDING]: NavigatorScreenParams<StackLandingParamList>;
};

const {Navigator, Screen} = createDrawerNavigator();

export const DrawerMainNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Navigator
      drawerContent={() => <SideMenuScreen insets={insets} />}
      screenOptions={{
        drawerStyle: {
          width: '100%',
        },
        headerShown: false,
      }}>
      <Screen
        name={NavigationKey.STACK_LANDING}
        component={StackLandingNavigator}
      />
    </Navigator>
  );
};
