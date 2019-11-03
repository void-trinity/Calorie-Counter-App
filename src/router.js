import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Feather';

import Login from './login';
import Home from './home';
import Scan from './scan';
import Volume from './volume';
import VolumeResults from './volumeresults';
import Scanresult from './scanresult';

const BottomTabNavigator = createBottomTabNavigator(
  {
    Home,
    Scan,
    Volume,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'home';
        } else if (routeName === 'Scan') {
          iconName = 'camera';
        } else if (routeName === 'Volume') {
          iconName = 'minimize';
        }
        return <Icon name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#e91e63',
      inactiveTintColor: 'gray',
      showLabel: false,
    },
  },
);

const Router = createStackNavigator(
  {
    Login,
    BottomTabNavigator,
    VolumeResults,
    Scanresult,
  },
  {
    headerMode: 'none',
    initialRouteName: 'BottomTabNavigator',
  },
);

export default createAppContainer(Router);
