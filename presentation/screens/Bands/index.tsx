// Dependencies
import React from 'react'
import { useQuery } from '@tanstack/react-query'

// Main API
import api from '../../../infra/api'

// Components
import { Text } from '@ui-kitten/components'
import { BaseContent } from '../../layouts'

// Styled components

// Page Main JSX
const BandsScreen = ({ navigation }) => {
  // HTTP Requests
  const {
    data: bands,
    isLoading: isBandsLoading
  } = useQuery(
    ['bands'],
    () => api.bands.getBands()
  )

  // TSX
  return (
    <BaseContent>
      <Text>Bands</Text>
    </BaseContent>
  )
}

// Exporting page
export default BandsScreen