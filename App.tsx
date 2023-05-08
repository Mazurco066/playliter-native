// Dependencies
import { StatusBar } from 'expo-status-bar'

// Routing
import { AppNavigator } from './main'
import { navigationRef } from './main/services/navigationService'
import { NavigationContainer } from '@react-navigation/native'

// Safe Area
import { SafeAreaView } from 'react-native-safe-area-context'

// Design package
import * as eva from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { default as theme } from './theme.json'

// Global app wrapper
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <IconRegistry icons={EvaIconsPack} />
      <StatusBar style="dark" />
        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
          <NavigationContainer ref={navigationRef}>
            <AppNavigator />
          </NavigationContainer>
        </ApplicationProvider>
    </SafeAreaView>
  )
}
