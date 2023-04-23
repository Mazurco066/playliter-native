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
const BandsScreen = ({ navigation }) => (
  <Wrapper>
      <Text category='h1'>BANDS</Text>
      <Button onPress={() => {
        navigation.navigate('Home')
      }}>
        Navigate
      </Button>
    </Wrapper>
)

// Exporting page
export default BandsScreen