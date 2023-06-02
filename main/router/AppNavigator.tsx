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
  AddConcertSongs,
  AddPublicConcertSongs,
  AuthScreen,
  BandScreen,
  BandsScreen,
  ConcertScreen,
  MainScreen,
  Middleware,
  ProfileScreen,
  ReorderConcert,
  SongScreen,
  SongsScreen
} from '../../presentation/screens'

// Auth navigator screens
const AuthNavigator = () => (
  <AuthStack.Navigator
    initialRouteName="Login"
    screenOptions={() => ({
      gestureEnabled: false,
      animation: 'slide_from_left',
      header: () => null
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
    <MainStack.Screen name="Band" component={BandScreen} />
    <MainStack.Screen name="Bands" component={BandsScreen} />
    <MainStack.Screen name="Concert" component={ConcertScreen} />
    <MainStack.Screen name="AddConcertSongs" component={AddConcertSongs} />
    <MainStack.Screen name="AddPublicConcertSongs" component={AddPublicConcertSongs} />
    <MainStack.Screen name="ReorderConcert" component={ReorderConcert} />
    <MainStack.Screen name="Home" component={MainScreen} />
    <MainStack.Screen name="Middleware" component={Middleware} />
    <MainStack.Screen name="Profile" component={ProfileScreen} />
    <MainStack.Screen name="Song" component={SongScreen} />
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