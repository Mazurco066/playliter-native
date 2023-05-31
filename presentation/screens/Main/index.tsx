// Dependencies
import React from 'react'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuthStore } from '../../../main/store'
import { MainStackParamList } from '../../../main/router'

// Types
import { IBand, IConcert } from '../../../domain'

// Main API
import api from '../../../infra/api'

// Components
import { Spinner, Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { BaseContent } from '../../layouts'
import { BandListItem, ConcertListItem } from './elements'
import { Space } from '../../components'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Main page
const MainScreen = (): React.ReactElement => {
  // Hooks
  const { account } = useAuthStore()
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()

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
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    data={futureConcerts?.data?.data || []}
                    renderItem={({ item }: ListRenderItemInfo<IConcert>) => (
                      <ConcertListItem
                        onPress={() => navigate('Concert', { item, itemId: item.id })}
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
                <FlatList
                  ItemSeparatorComponent={() => <Space my={1} />}
                  ListHeaderComponent={() => <Space my={2} />}
                  ListFooterComponent={() => <Space my={2} />}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}
                  data={bands?.data?.data || []}
                  renderItem={({ item }: ListRenderItemInfo<IBand>) => (
                    <BandListItem
                      onPress={() => navigate('Band', { item, itemId: item.id })}
                      item={item}
                    />
                  )}
                />
              </>
            ) : (
              <>
                <Space my={1} />
                <Text category="s1">
                  Você não participa de nenhuma banda no momento.
                </Text>
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