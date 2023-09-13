// Dependencies
import styled from 'styled-components'
import React, { useEffect }  from 'react'
import { useQuery } from '@tanstack/react-query'
import { IBand } from '../../../domain'
import { useBandStore } from '../../../main/store'
import { useRefreshOnFocus } from '../../hooks'

// Main API
import api from '../../../infra/api'

// Components
import { Space } from '../../components'
import { BandFeature, BandHeaderContainer } from './elements'
import { Spinner, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'
import { BaseContent } from '../../layouts'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

const BandFeatureContainer = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

// Page Main component
const BandScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item, itemId } = route.params

  // Hooks
  const theme = useTheme()
  const { band, setBand } = useBandStore()

  // Http requests
  const {
    data: updatedItem,
    isLoading: isFetching,
    refetch: refetchItem
  } = useQuery(
    [`get-band-${itemId}`],
    () => api.bands.getBand(itemId)
  )

  const {
    data: bandConcerts,
    isLoading: isFetchingConcerts,
    refetch: refetchConcerts
  } = useQuery(
    [`get-band-concerts-${itemId}`],
    () => api.concerts.getConcerts(itemId, { limit: 1, offset: 0 })
  )

  const {
    data: bandSongs,
    isLoading: isFetchingSongs,
    refetch: refetchSongs
  } = useQuery(
    [`get-band-songs-${itemId}`],
    () => api.songs.getBandSongs(itemId, { limit: 1, offset: 0 })
  )

  const {
    data: bandCategories,
    isLoading: isFetchingCategories,
    refetch: refetchCategories
  } = useQuery(
    [`get-band-categories-${itemId}`],
    () => api.songs.getBandSongCategories(itemId, { limit: 1, offset: 0 })
  )

  // Refetch on focus
  useRefreshOnFocus(refetchItem)
  useRefreshOnFocus(refetchConcerts)
  useRefreshOnFocus(refetchSongs)
  useRefreshOnFocus(refetchCategories)

  // Effects
  useEffect(() => {
    setBand(item ?? null)
  }, [])

  useEffect(() => {
    if (updatedItem && updatedItem.data) {
      const { data } = updatedItem.data
      if (data) setBand(data as IBand)
    }
  }, [updatedItem])

  // Numbers
  const categoryAmount = bandCategories?.data?.data?.total || 0
  const concertAmount = bandConcerts?.data?.data?.total || 0
  const songAmount = bandSongs?.data?.data?.total || 0

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      {
        band ? (
          <>
            <BandHeaderContainer
              band={band}
              onDeletePress={() => {}}
              onEditPress={() => {}}
            />
            <Space my={2} />
            <BandFeatureContainer>
              <BandFeature
                isLoading={isFetchingSongs}
                amount={songAmount}
                title="Músicas publicadas"
                onPress={() => {}}
              />
              <BandFeature
                isLoading={isFetchingCategories}
                amount={categoryAmount}
                title="Categorias registradas"
                onPress={() => {}}
              />
              <BandFeature
                isLoading={isFetchingConcerts}
                amount={concertAmount}
                title="Apresentações realizadas"
                onPress={() => {}}
              />
            </BandFeatureContainer>
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