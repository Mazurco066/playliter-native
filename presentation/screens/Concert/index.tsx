// Dependencies
import React, { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { IConcert, IConcertSongDto } from '../../../domain'
import { MainStackParamList } from '../../../main/router'
import { useConcertStore } from '../../../main/store'

// Main API
import api from '../../../infra/api'

// Components
import { Spinner, Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { BaseContent, ConfirmDialog } from '../../layouts'
import { ConcertHeaderContainer, SongListItem } from './elements'
import { Space } from '../../components'
import { useRefreshOnFocus } from '../../hooks'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Page interfaces
type ConfirmActions = { name: 'delete_concert' | 'remove_song', id?: string }

// Page Main component
const ConcertScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item, itemId } = route.params

  // Hooks
  const { concert, setConcert } = useConcertStore()
  const { goBack, navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ isConfirmDialogOpen, setConfirmDialogState ] = useState<boolean>(false)
  const [ action, setAction ] = useState<ConfirmActions>({ name: 'delete_concert' })
  const { t } = useTranslation()

  // Http requests
  const {
    data: updatedItem,
    isLoading: isFetching,
    refetch: refetchItem
  } = useQuery(
    [`get-concert-${itemId}`],
    () => api.concerts.getConcert(itemId)
  )

  const {
    isLoading: isDeletingConcert,
    mutateAsync: deleteConcert
  } = useMutation(
    (id: string) => api.concerts.deleteConcert(id)
  )

  const {
    isLoading: isUnlinkingSong,
    mutateAsync: unlinkSong
  } = useMutation(
    (data: { id: string, songId: string }) =>
      api.concerts.unlinkSong(data.id, data.songId)
  )

  // Refetch on focus
  useRefreshOnFocus(refetchItem)

  // General api loading
  const isApiLoading = isUnlinkingSong || isDeletingConcert

  // Effects
  useEffect(() => {
    setConcert(item ? { ...item, songs: [] } : null)
  }, [])

  useEffect(() => {
    if (updatedItem && updatedItem.data) {
      const { data } = updatedItem.data
      if (data) setConcert(data as IConcert)
    }
  }, [updatedItem])

  // Actions
  const confirmDialogActions = async (action: ConfirmActions) => {
    switch (action.name) {
      case 'delete_concert':
        const deleteResponse = await deleteConcert(action.id)
        if ([200, 201].includes(deleteResponse.status)) {
          showMessage({
            message: t('success_msgs.delete_concert_msg'),
            type: 'success',
            duration: 2000
          })
          goBack()
        } else if ([401, 403].includes(deleteResponse.status)) {
          showMessage({
            message: t('error_msgs.delete_concert_denied_msg'),
            type: 'warning',
            duration: 2000
          })
        } else {
          showMessage({
            message: t('error_msgs.delete_concert_error_msg'),
            type: 'danger',
            duration: 2000
          })
        }
        break
      case 'remove_song':
        const unlinkResponse = await unlinkSong({
          id: concert.id,
          songId: action.id
        })
        if ([200, 201].includes(unlinkResponse.status)) {
          showMessage({
            message: t('success_msgs.remove_concert_song_msg'),
            type: 'success',
            duration: 2000
          })
          refetchItem()
        } else if ([401, 403].includes(unlinkResponse.status)) {
          showMessage({
            message: t('error_msgs.delete_concert_song_denied_msg'),
            type: 'warning',
            duration: 2000
          })
        } else {
          showMessage({
            message: t('error_msgs.delete_concert_song_error_msg'),
            type: 'danger',
            duration: 2000
          })
        }
        break
    }
  }

  // Render list item function
  const renderItem = ({ item, index }: ListRenderItemInfo<IConcertSongDto>) => (
    <SongListItem
      item={item}
      number={index + 1}
      isLoading={isApiLoading}
      onPress={() => navigate('Song', { itemId: item.id })}
      onRemovePress={() => {
        setAction({ name: 'remove_song', id: item.id })
        setConfirmDialogState(true)
      }}
    />
  )

  const renderEmptyListComponent = useCallback(
    () => (
      isFetching ? null : (
        <Text category="s1">
          {t('concert_screen.no_songs')}
        </Text>
      )
    ),
    [isFetching, t]
  )

  const renderListFooter = useCallback(
    () => (
      isFetching ? (
        <LoadingContainer>
          <Spinner size="large" />
        </LoadingContainer>
      ) : <Space my={4} />
    ),
    [isFetching]
  )

  // TSX
  return (
    <BaseContent
      hideCardsNavigation
      showFloatingButton
      isFloatingButtonDisabled={isApiLoading}
      onFloatingButtonPress={() => navigate('AddConcertSongs', { item: concert })}
    >
      {
        concert ? (
          <>
            <ConcertHeaderContainer
              concert={concert}
              isLoading={isApiLoading}
              canNavigate={concert.songs.length >= 1}
              onAddPress={() => navigate('AddPublicConcertSongs', { item: concert })}
              onDeletePress={() => {
                setAction({ name: 'delete_concert', id: concert.id })
                setConfirmDialogState(true)
              }}
              onDuplicatePress={() => navigate('CloneConcert', { item: concert })}
              onEditPress={() => navigate('SaveConcert', { item: concert, bandId: concert.band.id })}
              onNotesPress={() => navigate('ConcertNotes', { item: concert })}
              onReorderPress={() => navigate('ReorderConcert', { item: concert })}
              onSequentialPress={() => navigate('SongList', { itemId: concert.id, item: concert })}
            />
            <Space my={1} />
            <Text category="h5">
              {t('concert_screen.selected_songs_heading')}
            </Text>
            <FlatList
              ItemSeparatorComponent={() => <Space my={1} />}
              ListHeaderComponent={() => <Space my={2} />}
              ListFooterComponent={renderListFooter}
              ListEmptyComponent={renderEmptyListComponent}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              data={concert.songs || []}
              renderItem={renderItem}
            />
          </>
        ) : isFetching ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : null
      }
      <ConfirmDialog
        action={action}
        isVisible={isConfirmDialogOpen}
        onClose={() => setConfirmDialogState(false)}
        onConfirmAction={confirmDialogActions}
      />
    </BaseContent>
  )
} 

// Exporting page
export default ConcertScreen