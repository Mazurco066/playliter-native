// Dependencies
import React from 'react'
import { useQuery } from '@tanstack/react-query'

// Main API
import api from '../../../infra/api'

// Components
import { Text } from '@ui-kitten/components'
import { BaseContent } from '../../layouts'

// Styled components

// Main page
const MainScreen = ({ navigation }) => {
  // Hooks

  // HTTP Requests
  const {
    data: futureConcerts,
    isLoading: isFutureConcertsLoading
  } = useQuery(
    ['shows_home'],
    () => api.concerts.getPendingConcerts()
  )
  const {
    data: bands,
    isLoading: isBandsLoading
  } = useQuery(
    ['bands_home'],
    () => api.bands.getBands({
      limit: 3,
      offset: 0
    })
  )

  // TSX
  return (
    <BaseContent>
      <Text>Main content</Text>
    </BaseContent>
  )
}

// Exporting page
export default MainScreen