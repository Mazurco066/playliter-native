// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

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
  
  // JSX
  return (
    <Wrapper>
      <Text category='h1'>MAIN</Text>
      <Button onPress={() => {
        navigation.navigate('Bands')
      }}>
        Navigate
      </Button>
    </Wrapper>
  )
}

// Exporting page
export default MainScreen