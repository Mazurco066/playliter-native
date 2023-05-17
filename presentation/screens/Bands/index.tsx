// Dependencies
import React from 'react'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'

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

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Page Main JSX
const BandsScreen = ({ navigation }) => {
  // HTTP Requests
  const {
    data: bands,
    isLoading: isBandsLoading
  } = useQuery(
    ['bands'],
    () => api.bands.getBands()
  )

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
                    keyExtractor={(_, idx) => idx.toString()}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    data={bands?.data?.data || []}
                    renderItem={({ item }: ListRenderItemInfo<IBand>) => (
                      <BandListItem
                        onPress={() => {
                          console.log('on specific band press: ' + item.id)
                        }}
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