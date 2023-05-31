// Dependencies
import styled from 'styled-components'
import React, { useState, useEffect }  from 'react'
import { useQuery } from '@tanstack/react-query'
import { ISong } from '../../../domain'

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
const SongScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item, itemId } = route.params

  // Hooks
  const [ song, setSong ] = useState<ISong | null>(item ?? null)

  // Http requests
  const {
    data: updatedItem,
    isLoading: isFetching,
    refetch: refetchItem
  } = useQuery(
    [`get-song-${itemId}`],
    () => api.songs.getSong(itemId)
  )

  // Effects
  useEffect(() => {
    if (updatedItem && updatedItem.data) {
      const { data } = updatedItem.data
      if (data) setSong(data as ISong)
    }
  }, [updatedItem])

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      {
        song ? (
          <>
            <Text>Song - {song.title}</Text>
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
export default SongScreen