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
  AddPublicConcertSongs,
  AddConcertSongs,
  AuthScreen,
  BandCategories,
  BandConcerts,
  BandScreen,
  BandsScreen,
  BandSongs,
  ConcertNotes,
  ConcertScreen,
  MainScreen,
  Middleware,
  ProfileScreen,
  ReorderConcert,
  SaveCategory,
  SaveConcert,
  SaveNote,
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
    {/* Band screen and subscreens */}
    <MainStack.Screen
      name="Band"
      component={BandScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="BandSongs"
      component={BandSongs}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="BandConcerts"
      component={BandConcerts}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="BandCategories"
      component={BandCategories}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="SaveCategory"
      component={SaveCategory}
      options={{ animation: 'slide_from_right' }}
    />
    {/* Concert screen and subscreens */}
    <MainStack.Screen
      name="Concert"
      component={ConcertScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="AddConcertSongs"
      component={AddConcertSongs}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="AddPublicConcertSongs"
      component={AddPublicConcertSongs}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="ConcertNotes"
      component={ConcertNotes}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="ReorderConcert"
      component={ReorderConcert}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="SaveConcert"
      component={SaveConcert}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="SaveNote"
      component={SaveNote}
      options={{ animation: 'slide_from_right' }}
    />
    {/* Song screen and subscreens */}
    <MainStack.Screen
      name="Song"
      component={SongScreen}
    />
    {/* Standalone screens */}
    <MainStack.Screen
      name="Bands"
      component={BandsScreen}
    />
    <MainStack.Screen
      name="Home"
      component={MainScreen}
    />
    <MainStack.Screen
      name="Middleware"
      component={Middleware}
    />
    <MainStack.Screen
      name="Profile"
      component={ProfileScreen}
    />
    <MainStack.Screen
      name="Songs"
      component={SongsScreen}
    />
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