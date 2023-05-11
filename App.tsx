// Dependencies
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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

// App Toast Messages
import FlashMessage from 'react-native-flash-message'

// Create a client for tanstack client
const queryClient: QueryClient = new QueryClient()

// Global app wrapper
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }}>
        <IconRegistry icons={EvaIconsPack} />
        <StatusBar style="dark" />
          <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
            <NavigationContainer ref={navigationRef}>
              <AppNavigator />
            </NavigationContainer>
            <FlashMessage
              icon="auto"
              position="bottom"
            />
          </ApplicationProvider>
      </SafeAreaView>
    </QueryClientProvider>
  )
}
