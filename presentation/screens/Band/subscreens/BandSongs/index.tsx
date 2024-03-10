// Dependencies
import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useRefreshOnFocus } from '../../../../hooks'

// Types
import { ISong } from '../../../../../domain'
import { MainStackParamList } from '../../../../../main/router'

// Main API
import api from '../../../../../infra/api'

// Components
import { Button, Icon, Input, Spinner, Text, useTheme } from '@ui-kitten/components'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
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
  const { t } = useTranslation()

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
  const reqSongs = useInfiniteQuery(
    [`band_songs_${item.id}`],
    fetchBandSongs, {
      getNextPageParam: (lastPage) => {
        if (lastPage.data.data.length < PAGE_SIZE) return undefined
        return lastPage.data.offset + PAGE_SIZE
      }
    }
  )

  const reqCategories = useQuery(
    [`band-categories-${item.id}`],
    () => api.songs.getBandSongCategories(item.id)
  )

  // Refetch data
  useRefreshOnFocus(reqSongs.refetch)
  useRefreshOnFocus(reqCategories.refetch)

  // All pages data
  const allPagesData = reqSongs.data?.pages.flatMap((value) => value.data.data) || []

  // Auxiliar Render functions
  const renderSearchButton = useCallback((props: any): React.ReactElement => (
    <Icon
      {...props}
      name={
        reqSongs.isLoading ||
        reqSongs.isFetchingNextPage ||
        reqSongs.isRefetching
          ? 'loader-outline'
          : 'search-outline'
      }
    />
  ), [
    reqSongs.isLoading,
    reqSongs.isFetchingNextPage,
    reqSongs.isRefetching
  ])

  const renderResetButton = useCallback((props: any): React.ReactElement => (
    <Icon
      {...props}
      name={
        reqSongs.isLoading || reqSongs.isFetchingNextPage || reqSongs.isRefetching
          ? 'loader-outline'
          : 'sync-outline'
      }
    />
  ), [
    reqSongs.isLoading,
    reqSongs.isFetchingNextPage,
    reqSongs.isRefetching
  ])

  // Render list view item function
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<ISong>) => (
    <SongListItem
      item={item}
      isLoading={reqSongs.isFetchingNextPage || reqSongs.isRefetching}
      onPress={() => navigate('Song', { item, itemId: item.id })}
      onIconPress={() => navigate('Song', { item, itemId: item.id })}
    />
  ), [
    reqSongs.isFetchingNextPage,
    reqSongs.isRefetching
  ])

  // Render list empty component
  const renderListEmptyComponent = useCallback(() => (
    reqSongs.isLoading ? null : (
      <Text category="s1">
        {t('band_screen.no_songs')}
      </Text>
    )
  ), [reqSongs.isLoading, t])

  //TSX
  return (
    <BaseContent
      hideCardsNavigation
      onEndReached={() => {
        if (
          !reqSongs.isFetchingNextPage &&
          !reqSongs.isLoading &&
          !reqSongs.isRefetching &&
          reqSongs.hasNextPage
        ) {
          reqSongs.fetchNextPage()
        }
      }}
      showFloatingButton
      isFloatingButtonDisabled={reqCategories.isLoading}
      onFloatingButtonPress={() => {
        const categoryList = reqCategories.data?.data?.data?.data || []
        if (categoryList.length > 0) {
          navigate("SaveSong", { bandId: item.id })
        } else {
          showMessage({
            message: t('band_screen.category_warning'),
            duration: 2000,
            type: 'info'
          })
        }
      }}
    >
      <Text category="h5">
        {t('band_screen.song_heading')}
      </Text>
      <Space my={1} />
      <Text category="s1">
        {t('band_screen.song_placeholder')}
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
            reqSongs.isLoading ||
            reqSongs.isFetchingNextPage ||
            reqSongs.isRefetching
          }
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
              reqSongs.isLoading || 
              reqSongs.isFetchingNextPage || 
              reqSongs.isRefetching
            }
            onPress={() => {
              if (
                !reqSongs.isLoading && 
                !reqSongs.isFetchingNextPage && 
                !reqSongs.isRefetching
              ) {
                setFilterSearch('')
                setTimeout(() => reqSongs.refetch(), 150)
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
              reqSongs.isLoading || 
              reqSongs.isFetchingNextPage || 
              reqSongs.isRefetching
            }
            onPress={() => {
              if (
                !reqSongs.isLoading && 
                !reqSongs.isFetchingNextPage && 
                !reqSongs.isRefetching
              ) {
                reqSongs.refetch()
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
        ListFooterComponent={() => reqSongs.isFetchingNextPage
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
