// Dependencies
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Components
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components'

// Navigators
const BottomStack = createBottomTabNavigator()

// Screens
import {
  BandsScreen,
  MainScreen
} from '../../presentation/screens'

// Bottom tabs bar
const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title='Home'/>
    <BottomNavigationTab title='Bands'/>
  </BottomNavigation>
)

// Bottom navigation component
export default () => {
  return (
    <BottomStack.Navigator initialRouteName="Home" tabBar={props => <BottomTabBar {...props} />}>
      <BottomStack.Screen name='Home' component={MainScreen}/>
      <BottomStack.Screen name='Bands' component={BandsScreen}/>
    </BottomStack.Navigator>
  )
}