// Dependencies
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../main'

// Types
import { IConcert } from '../../../domain'

// Main API
import api from '../../../infra/api'

// Components
import { Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { BaseContent } from '../../layouts'
import { ConcertListItem } from './elements'
import { Space } from '../../components'

// Styled components

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
    </BaseContent>
  )
}

// Exporting page
export default MainScreen