// Dependencies
import React from 'react'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../main/store'

// Types
import { IConcert } from '../../../domain'

// Main API
import api from '../../../infra/api'

// Components
import { Text, Spinner } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { BaseContent } from '../../layouts'
import { ConcertListItem } from './elements'
import { Space } from '../../components'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Main page
const MainScreen = ({ navigation }): React.ReactElement => {
  // Hooks
  const { account } = useAuthStore()

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
      <Text category="h5">
        Bem vindo {account?.name}!
      </Text>
      <Space my={1} />
      {
        isFutureConcertsLoading ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : (
          <>
            {
              futureConcerts?.data?.data.length > 0 ? (
                <>
                  <Text category="s1">
                    Você tem {futureConcerts?.data?.data.length} apresentações agendadas.
                  </Text>
                  <Space my={2} />
                  <FlatList
                    horizontal
                    ItemSeparatorComponent={() => <Space mx={1} />}
                    keyExtractor={(_, idx) => idx.toString()}
                    showsHorizontalScrollIndicator={false}
                    data={futureConcerts?.data?.data || []}
                    renderItem={({ item }: ListRenderItemInfo<IConcert>) => (
                      <ConcertListItem
                        onPress={() => {
                          console.log('on concert press: ' + item.id)
                        }}
                        item={item}
                      />
                    )}
                  />
                </>
              ) : (
                <Text category="s1">
                  Você não possui apresentações futuras agendadas.
                </Text>
              )
            }
          </>
        )
      }
      <Space my={2} />
      <Text category="h5">
        Minhas bandas
      </Text>
      {
        isBandsLoading ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : (
          <>
          {
            bands?.data?.data.length > 0 ? (
              <>
              </>
            ) : (
              <>
              </>
            )
          }
          </>
        )
      }
    </BaseContent>
  )
}

// Exporting page
export default MainScreen