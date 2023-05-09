// Dependencies
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Stack navigators
const AuthStack = createNativeStackNavigator()
const MainStack = createNativeStackNavigator()
const RootStack = createNativeStackNavigator()

// Screens
import { TopNavigation } from '../../presentation/layouts'
import {
  AuthScreen,
  BandsScreen,
  MainScreen,
  Middleware,
  ProfileScreen,
  SongsScreen
} from '../../presentation/screens'

// Auth navigator screens
const AuthNavigator = () => (
  <AuthStack.Navigator
    initialRouteName="Login"
    screenOptions={() => ({
      gestureEnabled: false,
      animation: 'slide_from_left'
    })}
  >
    <AuthStack.Screen name="Login" component={AuthScreen} />
  </AuthStack.Navigator>
)

// Main navigator screens
const MainNavigator = () => (
  <MainStack.Navigator
    initialRouteName="Middleware"
    screenOptions={({ navigation, route }) => ({
      gestureEnabled: false,
      header: () => (
        <TopNavigation
          navigation={navigation}
        />
      ),
      animation: 'none'
    })}
  >
    <MainStack.Screen name="Bands" component={BandsScreen} />
    <MainStack.Screen name="Home" component={MainScreen} />
    <MainStack.Screen name="Middleware" component={Middleware} />
    <MainStack.Screen name="Profile" component={ProfileScreen} />
    <MainStack.Screen name="Songs" component={SongsScreen} />
  </MainStack.Navigator>
)

// Default router
export default () => {
  return (
    <RootStack.Navigator
    initialRouteName="Main"
    screenOptions={{ header: () => null }}
    >
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="Main" component={MainNavigator} />
    </RootStack.Navigator>
  )
}