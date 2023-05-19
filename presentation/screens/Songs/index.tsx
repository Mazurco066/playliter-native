// Dependencies
import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useInfiniteQuery } from '@tanstack/react-query'

// Types
import { ISong } from '../../../domain'

// Main API
import api from '../../../infra/api'

// Components
import { Button, Icon, Input, Spinner, Text, useTheme } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View, VirtualizedList } from 'react-native'
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
const PAGE_SIZE = 32

// Main component
const SongsScreen = ({ navigation }) => {
  // Hooks
  const theme = useTheme()
  const [ filterSearch, setFilterSearch ] = useState<string>('')

  // Api request function
  const fetchPublicSongs = async ({ pageParam = 0 }) => {
    console.log('Fetching data...', pageParam)
    const response = await api.songs.getPublicSongs(
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
    ['public_songs'],
    fetchPublicSongs, {
      getNextPageParam: (lastPage) => {
        if (lastPage.data.data.length < PAGE_SIZE) return undefined
        return lastPage.data.offset + PAGE_SIZE
      }
    }
  )

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

  const renderListItem = useCallback(({ item }: ListRenderItemInfo<ISong>) => (
    <SongListItem
      onPress={() => {
        console.log('on public song press: ' + item.id)
      }}
      item={item}
    />
  ), [])

  const getListItemLayout = useCallback((_: any[], index: number) => ({
    length: 72,
    offset: 72 * index,
    index,
  }), [])

  const renderFlatList = useMemo(() => {
    // Unifying pages data
    const allPagesData = data?.pages.flatMap((value) => value.data.data)

    // First loading component
    if (isLoading) return (
      <LoadingContainer>
        <Spinner size="large" />
      </LoadingContainer>
    )

    // No content component
    if (allPagesData?.length <= 0) return (
      <>
        <Space my={1} />
        <Text category='s1'>
          Não há músicas registradas para o filtro atual
        </Text>
      </>
    )

    // Memorized flatlist
    return (
      <FlatList
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        windowSize={5}
        data={allPagesData}
        initialNumToRender={PAGE_SIZE}
        removeClippedSubviews
        renderItem={renderListItem}
        getItemLayout={getListItemLayout}
        ItemSeparatorComponent={() => <Space my={1} />}
        ListHeaderComponent={() => <Space my={2} />}
        ListFooterComponent={() => isFetchingNextPage
          ? (
            <LoadingContainer>
              <Spinner size="large" />
            </LoadingContainer>
          ) : <Space my={2} />
        }
      />
    )
  }, [data, isFetchingNextPage, isLoading])

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
      {renderFlatList}
    </BaseContent>
  )
}

// Exporting page
export default SongsScreen