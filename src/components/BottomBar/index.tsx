import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Settings from '../../screens/Settings';
import HomePage from '../../screens/HomeScreen';

const Tab = createBottomTabNavigator();

const BottomBar = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        height: 60,
        paddingBottom: 0,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomePage}
      options={{
        tabBarIcon: ({ focused, size, color }) => (
          <Ionicons
            name={focused ? 'ios-information-circle' : 'ios-information-circle-outline'}
            size={size}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={Settings}
      options={{
        tabBarIcon: ({ focused, size, color }) => (
          <Ionicons name={focused ? 'ios-list' : 'ios-list-outline'} size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default BottomBar;
