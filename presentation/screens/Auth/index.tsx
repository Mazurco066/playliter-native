// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Components
import { Layout, Text } from '@ui-kitten/components'

// Styled components
const Wrapper = styled(Layout)`
  flex: 1;
  justify-content: center;
  align-items: center;
  ${color}
`

// Page Main JSX
const AuthScreen = ({ navigation }) => (
  <Wrapper>
    <Text category='h1'>Auth</Text>
  </Wrapper>
)

// Exporting page
export default AuthScreen