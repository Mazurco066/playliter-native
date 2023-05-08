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
    setTimeout(() => {
      const acc = getUserData()
      const token = getToken()
      if (acc && token) {
        navigation.replace('Home')
      } else {
        navigation.replace('Auth')
      }
    }, 1)
  }, [])

  // TSX
  return (
    <Wrapper>
      <Spinner status="control" />
    </Wrapper>
  )
}

// Exporting page
export default Middleware
