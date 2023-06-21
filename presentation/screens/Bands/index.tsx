// Dependencies
import React from 'react'
import styled from 'styled-components'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import { MainStackParamList } from '../../../main/router'

// Types
import { IBand } from '../../../domain'

// Main API
import api from '../../../infra/api'

// Components
import { Spinner, Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { BaseContent } from '../../layouts'
import { BandListItem } from './elements'
import { Space } from '../../components'
import { useRefreshOnFocus } from '../../hooks'


// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Page Main JSX
const BandsScreen = () => {
  // HTTP Requests
  const {
    data: bands,
    isLoading: isBandsLoading,
    refetch
  } = useQuery(
    ['bands'],
    () => api.bands.getBands()
  )

  // Refetch on focus
  useRefreshOnFocus(refetch)

  // Hooks
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()

  // TSX
  return (
    <BaseContent>
      <Text category="h5">
        Minhas bandas
      </Text>
      <Space my={1} />
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
                  <Text category="s1">
                    Lista das bandas que você faz parte.
                  </Text>
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
                <Text category="s1">
                  Você não participa de nenhuma banda no momento.
                </Text>
              )
            }
          </>
        )
      }
      
    </BaseContent>
  )
}

// Exporting page
export default BandsScreen