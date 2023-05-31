// Dependencies
import styled from 'styled-components'
import React, { useState, useEffect }  from 'react'
import { useQuery } from '@tanstack/react-query'
import { IBand } from '../../../domain'

// Main API
import api from '../../../infra/api'

// Components
import { Spinner, Text } from '@ui-kitten/components'
import { View } from 'react-native'
import { BaseContent } from '../../layouts'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Page Main component
const BandScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item, itemId } = route.params

  // Hooks
  const [ band, setBand ] = useState<IBand>(item)

  // Http requests
  const {
    data: updatedItem,
    isLoading: isFetching,
    refetch: refetchItem
  } = useQuery(
    [`get-band-${itemId}`],
    () => api.bands.getBand(itemId)
  )

  // Effects
  useEffect(() => {
    if (updatedItem && updatedItem.data) {
      const { data } = updatedItem.data
      if (data) setBand(data as IBand)
    }
  }, [updatedItem])

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      {
        band ? (
          <>
            <Text>Band - {band.title}</Text>
          </>
        ) : isFetching ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : null
      }
    </BaseContent>
  )
} 

// Exporting page
export default BandScreen