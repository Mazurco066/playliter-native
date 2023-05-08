// Dependencies
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Stack navigators
const AuthStack = createNativeStackNavigator()
const MainStack = createNativeStackNavigator()
const RootStack = createNativeStackNavigator()

// Screens
import { TopNavigation } from '../../presentation/components'
import {
  AuthScreen,
  BandsScreen,
  MainScreen,
  Middleware
} from '../../presentation/screens'

// Auth navigator screens
const AuthNavigator = () => (
  <AuthStack.Navigator
    initialRouteName="Login"
    screenOptions={({ navigation }) => ({ gestureEnabled: false })}
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
      )
    })}
  >
    <MainStack.Screen name="Bands" component={BandsScreen} />
    <MainStack.Screen name="Home" component={MainScreen} />
    <MainStack.Screen name="Middleware" component={Middleware} />
  </MainStack.Navigator>
)

// Default router
export default () => {
  return (
    <RootStack.Navigator
      screenOptions={{ header: () => null }}
      initialRouteName="Main"
    >
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="Main" component={MainNavigator} />
    </RootStack.Navigator>
  )
}