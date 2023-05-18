// Dependencies
import React, { useState } from 'react'
import styled from 'styled-components'
import { useInfiniteQuery } from '@tanstack/react-query'

// Types
import { ISong } from '../../../domain'

// Main API
import api from '../../../infra/api'

// Components
import { Icon, Input, Spinner, Text, useTheme } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, TouchableWithoutFeedback, View } from 'react-native'
import { BaseContent } from '../../layouts'
import { SongListItem } from './elements'
import { Space } from '../../components'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Paging default values
const PAGE_SIZE = 30

// Main component
const SongsScreen = ({ navigation }) => {
  // Hooks
  const theme = useTheme()
  const [ filterSearch, setFilterSearch ] = useState<string>('')
  const {
    status,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery(
    ['public_songs'],
    async ({ pageParam = 0 }) => {
      const response = await api.songs.getPublicSongs(
        {
          limit: PAGE_SIZE,
          offset: pageParam
        },
        filterSearch
      )
      return response.data
    }, {
      getNextPageParam: (lastPage) => {
        if (lastPage.data.data.length < PAGE_SIZE) return undefined
        return lastPage.data.offset + PAGE_SIZE
      }
    }
  )

  // Auxiliar Render functions
  const renderSearchButton = (props: any): React.ReactElement => (
    <TouchableWithoutFeedback onPress={() => {
      if (!isFetchingNextPage && status !== 'loading') {
        refetch()
      }
    }}>
      <Icon
        {...props}
        name={
          (status === 'loading' || isFetchingNextPage)
            ? 'slash-outline'
            : 'search-outline'
        }
      />
    </TouchableWithoutFeedback>
  )

  //TSX
  return (
    <BaseContent
      onEndReached={async () => {
        if (!isFetchingNextPage && hasNextPage) {
          fetchNextPage()
        }
      }}
    >
      <Text category="h5">
        Repertório público
      </Text>
      <Space my={1} />
      <Text category="s1">
        Pequise por músicas pulbicadas no app:
      </Text>
      <Space my={1} />
      <Input 
        placeholder="Pesquisar..."
        keyboardType="default"
        accessoryRight={renderSearchButton}
        value={filterSearch}
        onChangeText={nextValue => setFilterSearch(nextValue)}
        disabled={(status === 'loading' || isFetchingNextPage)}
        style={{
          backgroundColor: theme['color-basic-700'],
          borderRadius: 8
        }}
      />
      <Space my={2} />
      {
        status === 'loading' ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : status === 'error' ? (
          <Text category="s1">
            Ocorreu um erro ao carregar as músicas públicas. Tente novamente mais tarde.
          </Text>
        ) : (
          <>
          {
            data?.pages.reduce((ac, cv) => ac.concat(cv.data?.data), []).length > 0 ? (
              <>
                <FlatList
                  ItemSeparatorComponent={() => <Space my={1} />}
                  ListHeaderComponent={() => <Space my={2} />}
                  ListFooterComponent={() => <Space my={2} />}
                  keyExtractor={(_, idx) => idx.toString()}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}
                  windowSize={5}
                  data={data?.pages.reduce((ac, cv) => ac.concat(cv.data?.data), [])}
                  initialNumToRender={PAGE_SIZE}
                  renderItem={({ item }: ListRenderItemInfo<ISong>) => (
                    <SongListItem
                      onPress={() => {
                        console.log('on public song press: ' + item.id)
                      }}
                      item={item}
                    />
                  )}
                />
                {
                  isFetchingNextPage && hasNextPage ? (
                    <LoadingContainer>
                      <Spinner size="large" />
                    </LoadingContainer>
                  ) : null
                }
              </>
            ) : (
              <Text
                category='s1'
              >
                Não há músicas registradas para o filtro atual
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
export default SongsScreen