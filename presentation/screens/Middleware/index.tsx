// Dependencies
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Components
import { Layout, Spinner } from '@ui-kitten/components'

// Store
import { useAuthStore } from '../../../main/store'

// Styled components
const Wrapper = styled(Layout)`
  flex: 1;
  justify-content: center;
  align-items: center;
  ${color}
`

// Middleware page
const Middleware = ({ navigation }) => {
  // Hooks
  const { getUserData, getToken } = useAuthStore()

  // Effects
  useEffect(() => {
    const authData = getUserData()
    const token = getToken()
    console.log('[MIDDLEWARE HERE]', authData, token)
    if (authData && token) {
      navigation.replace('Home')
    } else {
      navigation.replace('Auth')
    }
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
