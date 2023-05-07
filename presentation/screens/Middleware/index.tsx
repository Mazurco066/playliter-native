// Dependencies
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Components
import { Layout, Spinner } from '@ui-kitten/components'

// Styled components
const Wrapper = styled(Layout)`
  flex: 1;
  justify-content: center;
  align-items: center;
  ${color}
`

// Middleware page
const Middleware = ({ navigation }) => {
  // Effects
  useEffect(() => {
    // TODO: Implement auth logic here
    navigation.replace('Home')
  })

  // TSX
  return (
    <Wrapper>
      <Spinner status="control" />
    </Wrapper>
  )
}

// Exporting page
export default Middleware
