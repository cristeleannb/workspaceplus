import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {NavigatorScreenParams} from '@react-navigation/native';
import {observer} from 'mobx-react';

import {NavigationKey} from '../config';

import {useStores} from '@/stores';

import {DrawerMainParamList, DrawerMainNavigator} from './DrawerMainNavigator';
import {StackAuthParamList, StackAuthNavigator} from './StackAuthNavigator';

export type StackRootParamList = {
  [NavigationKey.DRAWER_MAIN]: NavigatorScreenParams<DrawerMainParamList>;
  [NavigationKey.STACK_AUTH]: NavigatorScreenParams<StackAuthParamList>;
};

const {Navigator, Screen} = createStackNavigator<StackRootParamList>();

export const RootNavigator = observer(() => {
  const {authStore} = useStores();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
      }}>
      {authStore.authenticated ? (
        <Screen
          name={NavigationKey.DRAWER_MAIN}
          component={DrawerMainNavigator}
        />
      ) : (
        <Screen
          name={NavigationKey.STACK_AUTH}
          component={StackAuthNavigator}
        />
      )}
    </Navigator>
  );
});
