import React from 'react';

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';

import {FWDColors} from '@/components';

import {RootNavigator, StackRootParamList} from './../navigators/RootNavigator';

interface RootParam extends StackRootParamList {}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootParam {}
  }
}

const navTheme = DefaultTheme;
navTheme.colors.background = FWDColors.white;
navTheme.dark = false;

export const NavigationProvider = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};
