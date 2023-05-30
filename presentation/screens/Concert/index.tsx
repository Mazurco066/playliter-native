// Dependencies
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { IConcert } from '../../../domain'

// Main API
import api from '../../../infra/api'

// Components
import { Text } from '@ui-kitten/components'
import { View } from 'react-native'
import { BaseContent } from '../../layouts'
import { ConcertHeaderContainer } from './elements'

// Styled components

// Page Main component
const ConcertScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item } = route.params

  // Hooks
  const [ concert, setConcert ] = useState<IConcert>(item)

  // Http requests
  const {
    data: updatedItem,
    refetch: refetchItem
  } = useQuery(
    [`get-concert-${concert.id}`],
    () => api.concerts.getConcert(concert.id)
  )

  // Effects
  useEffect(() => {
    if (updatedItem && updatedItem.data) {
      const { data } = updatedItem.data
      if (data) setConcert(data as IConcert)
    }
  }, [updatedItem])

  // TSX
  return (
    <BaseContent
      hideCardsNavigation
    >
      <ConcertHeaderContainer
        concert={concert}
      />
    </BaseContent>
  )
} 

// Exporting page
export default ConcertScreen