// Dependencies
import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

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
  const reqConcerts = useInfiniteQuery(
    [`band_concerts_${item.id}`],
    fetchBandConcerts, {
      getNextPageParam: (lastPage) => {
        if (lastPage.data.data.length < PAGE_SIZE) return undefined
        return lastPage.data.offset + PAGE_SIZE
      }
    }
  )

  useRefreshOnFocus(reqConcerts.refetch)

  // All pages data
  const allPagesData = reqConcerts.data?.pages.flatMap((value) => value.data.data) || []

  // Auxiliar Render functions
  const renderSearchButton = useCallback((props: any): React.ReactElement => (
    <Icon
      {...props}
      name={
        reqConcerts.isLoading ||
        reqConcerts.isFetchingNextPage ||
        reqConcerts.isRefetching
          ? 'loader-outline'
          : 'search-outline'
      }
    />
  ), [
    reqConcerts.isLoading,
    reqConcerts.isFetchingNextPage,
    reqConcerts.isRefetching
  ])

  const renderResetButton = useCallback((props: any): React.ReactElement => (
    <Icon
      {...props}
      name={
        reqConcerts.isLoading ||
        reqConcerts.isFetchingNextPage ||
        reqConcerts.isRefetching
          ? 'loader-outline'
          : 'sync-outline'
      }
    />
  ), [
    reqConcerts.isLoading,
    reqConcerts.isFetchingNextPage,
    reqConcerts.isRefetching
  ])

  // Render list view item function
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<IConcert>) => (
    <ConcertListItem
      item={item}
      isLoading={reqConcerts.isFetchingNextPage || reqConcerts.isRefetching}
      onPress={() => navigate('Concert', { item, itemId: item.id })}
      onIconPress={() => navigate('Concert', { item, itemId: item.id })}
    />
  ), [
    reqConcerts.isFetchingNextPage,
    reqConcerts.isRefetching
  ])

  // Render list empty component
  const renderListEmptyComponent = useCallback(() => (
    reqConcerts.isLoading ? null : (
      <Text category="s1">
        {t('band_screen.no_concerts')}
      </Text>
    )
  ), [reqConcerts.isLoading, t])

  //TSX
  return (
    <BaseContent
      hideCardsNavigation
      onEndReached={() => {
        if (
          !reqConcerts.isFetchingNextPage &&
          !reqConcerts.isLoading &&
          !reqConcerts.isRefetching &&
          reqConcerts.hasNextPage
        ) {
          reqConcerts.fetchNextPage()
        }
      }}
      showFloatingButton
      onFloatingButtonPress={() => navigate("SaveConcert", { bandId: item.id })}
    >
      <Text category="h5">
        {t('band_screen.concert_heading')}
      </Text>
      <Space my={1} />
      <Text category="s1">
        {t('band_screen.concert_placeholder')}
      </Text>
      <Space my={1} />
      <SearchContainer>
        <SearchInput 
          placeholder={t('band_screen.search_placeholder')}
          keyboardType="default"
          size="small"
          value={filterSearch}
          onChangeText={nextValue => setFilterSearch(nextValue)}
          disabled={
            reqConcerts.isLoading ||
            reqConcerts.isFetchingNextPage ||
            reqConcerts.isRefetching}
          style={{
            backgroundColor: theme['color-basic-700']
          }}
        />
        <ButtonContainer>
          <SearchButton
            status="info"
            size="small"
            accessoryLeft={renderResetButton}
            disabled={
              reqConcerts.isLoading ||
              reqConcerts.isFetchingNextPage ||
              reqConcerts.isRefetching
            }
            onPress={() => {
              if (
                !reqConcerts.isLoading &&
                !reqConcerts.isFetchingNextPage &&
                !reqConcerts.isRefetching
              ) {
                setFilterSearch('')
                setTimeout(() => reqConcerts.refetch(), 150)
              }
            }}
          >
            {t('band_screen.clear_filter_btn')}
          </SearchButton>
          <SearchButton
            status="primary"
            size="small"
            accessoryLeft={renderSearchButton}
            disabled={
              reqConcerts.isLoading ||
              reqConcerts.isFetchingNextPage ||
              reqConcerts.isRefetching
            }
            onPress={() => {
              if (
                !reqConcerts.isLoading &&
                !reqConcerts.isFetchingNextPage &&
                !reqConcerts.isRefetching
              ) {
                reqConcerts.refetch()
              }
            }}
          >
            {t('band_screen.search_button')}
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
        ListFooterComponent={() => reqConcerts.isFetchingNextPage
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
