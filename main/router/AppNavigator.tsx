// Dependencies
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Stack navigators
const MainStack = createNativeStackNavigator()
const RootStack = createNativeStackNavigator()

// Screens
import {
  BandsScreen,
  MainScreen,
  Middleware
} from '../../presentation/screens'

// Main navigator screens
const MainNavigator = () => (
  <MainStack.Navigator initialRouteName="Middleware">
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
      <RootStack.Screen name="Main" component={MainNavigator} />
    </RootStack.Navigator>
  )
}