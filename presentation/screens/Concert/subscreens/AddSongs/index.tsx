// Dependencies
import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'

// Types
import { ISong } from '../../../../../domain'
import { MainStackParamList } from '../../../../../main/router'

// Main API
import api from '../../../../../infra/api'

// Components
import { Button, Icon, Input, Spinner, Text, useTheme } from '@ui-kitten/components'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { showMessage } from 'react-native-flash-message'
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
const AddConcertSongs = ({ route }): React.ReactElement => {
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
      item.band.id,
      {
        limit: PAGE_SIZE,
        offset: pageParam
      },
      filterSearch.toLowerCase()
    )
    return response.data
  }

  const {
    isLoading: islinkingSong,
    mutateAsync: linkSong
  } = useMutation(
    (data: { id: string, songId: string }) =>
      api.concerts.linkSong(data.id, data.songId)
  )

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
    [`add_concert_songs_${item.id}`],
    fetchBandSongs, {
      getNextPageParam: (lastPage) => {
        if (lastPage.data.data.length < PAGE_SIZE) return undefined
        return lastPage.data.offset + PAGE_SIZE
      }
    }
  )

  // All pages data
  const allPagesData = data?.pages.flatMap((value) => value.data.data) || []

  // Link song method
  const submitSong = async (songId: string) => {
    const response = await linkSong({ id: item.id, songId })
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.add_concert_song_msg'),
        type: 'success',
        duration: 2000
      })
    } else if ([400].includes(response.status)) {
      showMessage({
        message: t('error_msgs.add_concert_song_present_msg'),
        type: 'warning',
        duration: 2000
      })
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: t('error_msgs.add_concert_song_denied_msg'),
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.add_concert_song_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  // Auxiliar Render functions
  const renderSearchButton = useCallback((props: any): React.ReactElement => (
    <Icon
      {...props}
      name={
        isFetchingNextPage || isRefetching
          ? 'loader-outline'
          : 'search-outline'
      }
    />
  ), [isFetchingNextPage, isRefetching])

  const renderResetButton = useCallback((props: any): React.ReactElement => (
    <Icon
      {...props}
      name={
        isFetchingNextPage || isRefetching
          ? 'loader-outline'
          : 'sync-outline'
      }
    />
  ), [isFetchingNextPage, isRefetching])

  // Render list view item function
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<ISong>) => (
    <SongListItem
      item={item}
      isLoading={isFetchingNextPage || isRefetching || islinkingSong}
      onPress={() => navigate('Song', { item, itemId: item.id })}
      onAddPress={() => submitSong(item.id)}
    />
  ), [isFetchingNextPage, isRefetching, islinkingSong])

  //TSX
  return (
    <BaseContent
      hideCardsNavigation
      onEndReached={() => {
        if (!isFetchingNextPage &&!isLoading && !isRefetching && hasNextPage) {
          fetchNextPage()
        }
      }}
    >
      <Text category="h5">
        {t('concert_screen.add_songs_heading')}
      </Text>
      <Space my={1} />
      <Text category="s1">
        {t('concert_screen.add_band_songs_placeholder')}
      </Text>
      <Space my={1} />
      <SearchContainer>
        <SearchInput 
          placeholder={t('concert_screen.add_songs_label')}
          keyboardType="default"
          size="small"
          value={filterSearch}
          onChangeText={nextValue => setFilterSearch(nextValue)}
          disabled={isFetchingNextPage || isRefetching}
          style={{
            backgroundColor: theme['color-basic-700']
          }}
        />
        <ButtonContainer>
          <SearchButton
            status="info"
            size="small"
            accessoryLeft={renderResetButton}
            disabled={isFetchingNextPage || isRefetching}
            onPress={() => {
              if (!isLoading) {
                setFilterSearch('')
                setTimeout(() => refetch(), 150)
              }
            }}
          >
            {t('concert_screen.clear_filter_action')}
          </SearchButton>
          <SearchButton
            status="primary"
            size="small"
            accessoryLeft={renderSearchButton}
            disabled={isFetchingNextPage || isRefetching}
            onPress={() => {
              if (!isLoading) {
                refetch()
              }
            }}
          >
            {t('concert_screen.search_action')}
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
          ) : <Space my={2} />
        }
      />
    </BaseContent>
  )
}

// Exporting page
export default AddConcertSongs