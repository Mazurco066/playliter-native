// Dependencies
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useInfiniteQuery } from '@tanstack/react-query'

// Types
import { ISong } from '../../../../../domain'
import { MainStackParamList } from '../../../../../main/router'

// Main API
import api from '../../../../../infra/api'

// Components
import { Button, Icon, Input, Spinner, Text, useTheme } from '@ui-kitten/components'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { View } from 'react-native'
import { BaseContent } from '../../../../layouts'
import { SongListItem } from './elements'
import { Space } from '../../../../components'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

const SearchContainer = styled(View)`
  flex-direction: column;
  border-radius: 8px;
  width: 100%;
`

const ButtonContainer = styled(View)`
  flex-direction: row;
  gap: 8px;
`

const SearchInput = styled(Input)`
  border-radius: 8px;
  margin-bottom: 8px;
`

const SearchButton = styled(Button)`
  border-radius: 8px;
`

// Paging default values
const PAGE_SIZE = 50

// Main component
const BandSongs = ({ route }): React.ReactElement => {
  // Destruct params
  const { item } = route.params

  // Hooks
  const theme = useTheme()
  const [ filterSearch, setFilterSearch ] = useState<string>('')
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()

  // Api request function
  const fetchBandSongs = async ({ pageParam = 0 }) => {
    const response = await api.songs.getBandSongs(
      item.id,
      {
        limit: PAGE_SIZE,
        offset: pageParam
      },
      filterSearch.toLowerCase()
    )
    return response.data
  }

  // Infinite scroll api request
  const {
    data,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery(
    [`band_songs_${item.id}`],
    fetchBandSongs, {
      getNextPageParam: (lastPage) => {
        if (lastPage.data.data.length < PAGE_SIZE) return undefined
        return lastPage.data.offset + PAGE_SIZE
      }
    }
  )

  // All pages data
  const allPagesData = data?.pages.flatMap((value) => value.data.data) || []

  // Auxiliar Render functions
  const renderSearchButton = useCallback((props: any): React.ReactElement => (
    <Icon
      {...props}
      name={
        isLoading || isFetchingNextPage || isRefetching
          ? 'loader-outline'
          : 'search-outline'
      }
    />
  ), [isLoading, isFetchingNextPage, isRefetching])

  const renderResetButton = useCallback((props: any): React.ReactElement => (
    <Icon
      {...props}
      name={
        isLoading || isFetchingNextPage || isRefetching
          ? 'loader-outline'
          : 'sync-outline'
      }
    />
  ), [isLoading, isFetchingNextPage, isRefetching])

  // Render list view item function
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<ISong>) => (
    <SongListItem
      item={item}
      isLoading={isFetchingNextPage || isRefetching}
      onPress={() => navigate('Song', { item, itemId: item.id })}
      onIconPress={() => navigate('Song', { item, itemId: item.id })}
    />
  ), [isFetchingNextPage, isRefetching])

  //TSX
  return (
    <BaseContent
      hideCardsNavigation
      onEndReached={() => {
        if (!isFetchingNextPage &&!isLoading && !isRefetching && hasNextPage) {
          fetchNextPage()
        }
      }}
      showFloatingButton
      onFloatingButtonPress={() => console.log('[pressed here]')}
    >
      <Text category="h5">
        Músicas publicadas
      </Text>
      <Space my={1} />
      <Text category="s1">
        Pequise por músicas publicadas nessa banda:
      </Text>
      <Space my={1} />
      <SearchContainer>
        <SearchInput 
          placeholder="Pesquisar..."
          keyboardType="default"
          size="small"
          value={filterSearch}
          onChangeText={nextValue => setFilterSearch(nextValue)}
          disabled={isLoading || isFetchingNextPage || isRefetching}
          style={{
            backgroundColor: theme['color-basic-700']
          }}
        />
        <ButtonContainer>
          <SearchButton
            status="info"
            size="small"
            accessoryLeft={renderResetButton}
            disabled={isLoading || isFetchingNextPage || isRefetching}
            onPress={() => {
              if (!isLoading && !isFetchingNextPage && !isRefetching) {
                setFilterSearch('')
                setTimeout(() => refetch(), 150)
              }
            }}
          >
            Limpar Filtros
          </SearchButton>
          <SearchButton
            status="primary"
            size="small"
            accessoryLeft={renderSearchButton}
            disabled={isLoading || isFetchingNextPage || isRefetching}
            onPress={() => {
              if (!isLoading && !isFetchingNextPage && !isRefetching) {
                refetch()
              }
            }}
          >
            Pesquisar
          </SearchButton>
        </ButtonContainer>
      </SearchContainer>
      <Space my={1} />
      <FlashList
        estimatedItemSize={80}
        scrollEnabled={false}
        data={allPagesData}
        renderItem={renderListItem}
        ListHeaderComponent={() => <Space my={2} />}
        ListFooterComponent={() => isFetchingNextPage
          ? (
            <LoadingContainer>
              <Spinner size="large" />
            </LoadingContainer>
          ) : <Space my={4} />
        }
      />
    </BaseContent>
  )
}

// Exporting page
export default BandSongs