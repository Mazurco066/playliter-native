// Dependencies
import styled from 'styled-components'
import React, { useState, useEffect }  from 'react'
import { useQuery } from '@tanstack/react-query'
import { ISong } from '../../../../../domain'
import { useRefreshOnFocus } from '../../../../hooks'

// Main API
import api from '../../../../../infra/api'

// Components
import { Spinner } from '@ui-kitten/components'
import { View } from 'react-native'
import { Songsheet } from '../../../../components'
import { BaseContent } from '../../../../layouts'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Page Main component
const PublicSongScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item, itemId } = route.params

  // Hooks
  const [ song, setSong ] = useState<ISong | null>(item ?? null)

  // Http requests
  const reqSong = useQuery(
    [`get-song-${itemId}`],
    () => api.songs.getPublicSong(itemId)
  )

  // Effects
  useEffect(() => {
    if (reqSong.data && reqSong.data.data) {
      const { data } = reqSong.data.data
      if (data) setSong(data as ISong)
    }
  }, [reqSong.data])

  // Refresh on focus
  useRefreshOnFocus(reqSong.refetch)

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      {
        song ? (
          <Songsheet
            song={song}
            showCharts
            showControlHeaders
            onToneUpdateSuccess={reqSong.refetch}
          />
        ) : reqSong.isLoading ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : null
      }
    </BaseContent>
  )
} 

// Exporting page
export default PublicSongScreen
