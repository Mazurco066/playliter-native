// Dependencies
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Stack navigators
const AuthStack = createNativeStackNavigator()
const MainStack = createNativeStackNavigator()
const RootStack = createNativeStackNavigator()

// Screens
import {
  AuthTopNavigation,
  TopNavigation
} from '../../presentation/layouts'
import {
  AboutScreen,
  AddPublicConcertSongs,
  AddConcertSongs,
  AuthScreen,
  BandCategories,
  BandConcerts,
  BandScreen,
  BandsScreen,
  BandSongs,
  CloneConcertScreen,
  CloneSongScreen,
  ConcertNotes,
  ConcertScreen,
  EditSongScreen,
  ForgotPasswordScreen,
  InviteIntegrants,
  InsertCodeScreen,
  MainScreen,
  Middleware,
  ProfileScreen,
  PublicSongScreen,
  PublicSongsScreen,
  ReorderConcert,
  RespondInviteScreen,
  SaveCategory,
  SaveConcert,
  SaveBandScreen,
  SaveNote,
  SaveProfileScreen,
  SignUpScreen,
  SongScreen,
  SongListScreen,
  SongsScreen
} from '../../presentation/screens'

// Auth navigator screens
const AuthNavigator = () => (
  <AuthStack.Navigator
    initialRouteName="PublicSongs"
    screenOptions={() => ({
      gestureEnabled: false,
      animation: 'slide_from_left',
      header: () => null
    })}
  >
    <AuthStack.Screen
      name="PublicSongs"
      component={PublicSongsScreen}
      options={{
        animation: 'slide_from_right',
        header: ({ navigation }) => (
          <AuthTopNavigation
            navigation={navigation}
          />
        )
      }}
    />
    <AuthStack.Screen
      name="PublicSong"
      component={PublicSongScreen}
      options={{
        animation: 'slide_from_right',
        header: ({ navigation }) => (
          <AuthTopNavigation
            navigation={navigation}
          />
        )
      }}
    />
    <AuthStack.Screen
      name="Login"
      component={AuthScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <AuthStack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <AuthStack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{ animation: 'slide_from_right' }}
    />
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
      name="SaveBand"
      component={SaveBandScreen}
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
    <MainStack.Screen
      name="InviteIntegrants"
      component={InviteIntegrants}
      options={{ animation: 'slide_from_right' }}
    />
    {/* Concert screen and subscreens */}
    <MainStack.Screen
      name="Concert"
      component={ConcertScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="CloneConcert"
      component={CloneConcertScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="SongList"
      component={SongListScreen}
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
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="CloneSong"
      component={CloneSongScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="SaveSong"
      component={EditSongScreen}
      options={{ animation: 'slide_from_right' }}
    />
    {/* Profile screen and subscreens */}
    <MainStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="SaveProfile"
      component={SaveProfileScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="RespondInvite"
      component={RespondInviteScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="InsertCode"
      component={InsertCodeScreen}
      options={{ animation: 'slide_from_right' }}
    />
    {/* Standalone screens */}
    <MainStack.Screen
      name="Bands"
      component={BandsScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="Home"
      component={MainScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="Middleware"
      component={Middleware}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="About"
      component={AboutScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <MainStack.Screen
      name="Songs"
      component={SongsScreen}
      options={{ animation: 'slide_from_right' }}
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