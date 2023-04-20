// Dependencies
import { StatusBar } from 'expo-status-bar'
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components'
import { default as theme } from './theme.json'

// Temporary component
const HomeScreen = () => (
  <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text category='h1'>HOME</Text>
  </Layout>
)

// Global app wrapper
export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <HomeScreen />
      <StatusBar style="light" />
    </ApplicationProvider>
  )
}
