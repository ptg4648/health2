import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 화면 컴포넌트 임포트
import Icon from './Screen/Icon';
import Home from './Screen/Home';
import Exercise from './Screen/Exercise';
import Chatbot from './Screen/Chatbot';
import Login from './Screen/Login';
import Signup from './Screen/Signup';
import Food from './Screen/Food';
import Profile from './Screen/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ navigation, route }) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'Icon' || routeName === 'Login' || routeName === 'Signup') {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = require('./assets/home.png');
          } else if (route.name === 'Exercise') {
            iconName = require('./assets/exercise.png');
          } else if (route.name === 'Chatbot') {
            iconName = require('./assets/chat.png');
          } else if (route.name === 'Voice') {
            iconName = require('./assets/food.png');
          }
          return iconName ? <Image source={iconName} style={{ width: size, height: size, tintColor: color }} /> : null;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#ffffff' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: '홈' }} />
      <Tab.Screen name="Exercise" component={Exercise} options={{ tabBarLabel: '운동기록' }} />
      <Tab.Screen name="Voice" component={Food} options={{ tabBarLabel: '식단기록' }} />
      <Tab.Screen name="Chatbot" component={Chatbot} options={{ tabBarLabel: '챗봇' }} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Icon">
      <Stack.Screen name="Icon" component={Icon} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
