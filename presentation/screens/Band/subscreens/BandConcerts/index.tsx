// Dependencies
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRefreshOnFocus } from '../../../../hooks'

// Types
import { IConcert } from '../../../../../domain'
import { MainStackParamList } from '../../../../../main/router'

// Main API
import api from '../../../../../infra/api'

// Components
import { Button, Icon, Input, Spinner, Text, useTheme } from '@ui-kitten/components'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { View } from 'react-native'
import { BaseContent } from '../../../../layouts'
import { ConcertListItem } from './elements'
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
const PAGE_SIZE = 15

// Main component
const BandConcerts = ({ route }): React.ReactElement => {
  // Destruct params
  const { item } = route.params

  // Hooks
  const theme = useTheme()
  const [ filterSearch, setFilterSearch ] = useState<string>('')
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()

  // Api request function
  const fetchBandConcerts = async ({ pageParam = 0 }) => {
    const response = await api.concerts.getConcerts(
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
    [`band_concerts_${item.id}`],
    fetchBandConcerts, {
      getNextPageParam: (lastPage) => {
        if (lastPage.data.data.length < PAGE_SIZE) return undefined
        return lastPage.data.offset + PAGE_SIZE
      }
    }
  )

  useRefreshOnFocus(refetch)

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
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<IConcert>) => (
    <ConcertListItem
      item={item}
      isLoading={isFetchingNextPage || isRefetching}
      onPress={() => navigate('Concert', { item, itemId: item.id })}
      onIconPress={() => navigate('Concert', { item, itemId: item.id })}
    />
  ), [isFetchingNextPage, isRefetching])

  // Render list empty component
  const renderListEmptyComponent = useCallback(() => (
    isLoading ? null : (
      <Text category="s1">
        Não há apresentações registradas nessa banda
      </Text>
    )
  ), [isLoading])

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
      onFloatingButtonPress={() => navigate("SaveConcert", { bandId: item.id })}
    >
      <Text category="h5">
        Apresentações realizadas
      </Text>
      <Space my={1} />
      <Text category="s1">
        Pequise por apresentações nessa banda:
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
        ListEmptyComponent={renderListEmptyComponent}
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
export default BandConcerts