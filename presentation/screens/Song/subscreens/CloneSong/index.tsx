// Dependencies
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../../../main/router'
import { useRefreshOnFocus } from '../../../../hooks'

// API
import api from '../../../../../infra/api'

// Types
import { IBand } from '../../../../../domain/models'
import { AddSongDto } from '../../../../../domain/dto'

// Components
import { Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { BandListItem } from './elements'
import { Space } from '../../../../components'
import { BaseContent, ConfirmDialog } from '../../../../layouts'

// Custom types
type ConfirmActions = { name: 'clone_song', id?: string }

// Main Page
const CloneSongScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item } = route.params

  // Hooks
  const { replace } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ isConfirmDialogOpen, setConfirmDialogState ] = useState<boolean>(false)
  const [ action, setAction ] = useState<ConfirmActions>({ name: 'clone_song' })
  const { t } = useTranslation()

  // HTTP Requests
  const {
    data: bands,
    isLoading: isBandsLoading,
    refetch
  } = useQuery(
    ['bands'],
    () => api.bands.getBands()
  )

  const { isLoading: isCloneLoading, mutateAsync: cloneSong } = useMutation(
    (data: { song: AddSongDto, bandId: string }) => api.songs.addSong(data.bandId, data.song)
  )

  const {
    isLoading: isCategoriesLoading,
    mutateAsync: fetchCategories
  } = useMutation(
    (bandId: string) => api.songs.getBandSongCategories(bandId)
  )

  // Refetch on focus
  useRefreshOnFocus(refetch)

  // Actions
  const confirmDialogActions = async (action: ConfirmActions) => {
    const bandId = action.id

    // Load band categories
    const categoriesResponse = await fetchCategories(bandId)
    if (categoriesResponse.status < 400) {

      // Verifying if band has categories
      const categories = categoriesResponse.data?.data?.data
      if (categories.length > 0) {
        // New song payload
        const categoryId = categories[0].id
        const songPayload: AddSongDto = {
          title: `${item.title} - Cópia`,
          body: item.body,
          category: categoryId,
          writter: item.writter,
          isPublic: false,
          tone: item.tone
        }

        // Clone request
        const response = await(cloneSong({ song: songPayload, bandId }))

        // Verify response
        if (response.status < 400) {
          showMessage({
            message: t('success_msgs.clone_song_msg'),
            duration: 2000,
            type: 'success'
          })
          replace("Song", { itemId: response.data.data.id })
        } else {
          showMessage({
            message: t('error_msgs.clone_song_error_msg'),
            duration: 2000,
            type: 'danger'
          })
        }

      } else {
        showMessage({
          message: t('error_msgs.clone_song_nc_msg'),
          duration: 2500,
          type: 'info'
        })
      }
    } else {
      showMessage({
        message: t('error_msgs.clone_song_cl_msg'),
        duration: 2000,
        type: 'danger'
      })
    }
  }

  // Renderers
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<IBand>) => (
    <BandListItem
      onPress={() => {
        setAction({ name: 'clone_song', id: item.id })
        setConfirmDialogState(true)
      }}
      item={item}
      isLoading={isBandsLoading || isCloneLoading || isCategoriesLoading}
    />
  ), [setAction, setConfirmDialogState, isBandsLoading, isCloneLoading, isCategoriesLoading])

  // Render list empty component
  const renderListEmptyComponent = useCallback(() => (
    isBandsLoading ? null : (
      <Text category="s1">
        {t('song_screen.no_bands')}
      </Text>
    )
  ), [isBandsLoading, t])

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        {t('song_screen.clone_heading')}
      </Text>
      <Space my={1} />
      <Text category="s1">
        {t('song_screen.clone_placeholder')}
      </Text>
      <FlatList
        ItemSeparatorComponent={() => <Space my={1} />}
        ListHeaderComponent={() => <Space my={2} />}
        ListFooterComponent={() => <Space my={2} />}
        ListEmptyComponent={renderListEmptyComponent}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={bands?.data?.data || []}
        renderItem={renderListItem}
      />
      <ConfirmDialog
        action={action}
        isVisible={isConfirmDialogOpen}
        onClose={() => setConfirmDialogState(false)}
        onConfirmAction={confirmDialogActions}
        message={t('song_screen.confirm_clone')}
      />
    </BaseContent>
  )
}

export default CloneSongScreen