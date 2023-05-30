// Dependencies
import React, { useState, useEffect }  from 'react'
import { useQuery } from '@tanstack/react-query'
import { ISong } from '../../../domain'

// Main API
import api from '../../../infra/api'

// Components
import { Text } from '@ui-kitten/components'
import { BaseContent } from '../../layouts'

// Styled components

// Page Main component
const SongScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item } = route.params

  // Hooks
  const [ song, setSong ] = useState<ISong>(item)

  // Http requests
  const {
    data: updatedItem,
    refetch: refetchItem
  } = useQuery(
    [`get-song-${song.id}`],
    () => api.songs.getSong(song.id)
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
    <BaseContent
      hideCardsNavigation
    >
      <Text>Song - {song.title}</Text>
    </BaseContent>
  )
} 

// Exporting page
export default SongScreen