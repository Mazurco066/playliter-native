// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useAuthStore } from '../../../main/store'

// Components
import { Button, Layout, Text } from '@ui-kitten/components'

// Styled components
const Wrapper = styled(Layout)`
  flex: 1;
  justify-content: center;
  align-items: center;
  ${color}
`

// Page Main JSX
const MainScreen = ({ navigation }) => {
  // Hooks
  const { logoff, account } = useAuthStore()

  // JSX
  return (
    <Wrapper>
      <Text category='h5'>
        Bem vindo {account.name}!
      </Text>
      <Button onPress={() => {
        logoff()
        navigation.replace('Auth')
      }}>
        Logoff
      </Button>
    </Wrapper>
  )
}

// Exporting page
export default MainScreen