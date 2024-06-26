// Dependencies
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { useRefreshOnFocus } from '../../../../hooks'

// Api
import api from '../../../../../infra/api'

// Types
import { MainStackParamList } from '../../../../../main/router'
import { ISong } from '../../../../../domain'

// Components
import { showMessage } from 'react-native-flash-message'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { Spinner, Text } from '@ui-kitten/components'
import { View } from 'react-native'
import { SongListItem } from '../BandSongs/elements'
import { EditCategory, ViewCategory } from './elements'
import { BaseContent, ConfirmDialog } from '../../../../layouts'
import { Space } from '../../../../components'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Paging default values
const PAGE_SIZE = 50

// Save Category Subscreen
const SaveCategory = ({ route }): React.ReactElement => {
  // Destruct params
  const { bandId, item } = route.params

  // Hooks
  const { goBack, navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ isEditable, setEditableState ] = useState<boolean>(false)
  const [ isConfirmDialogOpen, setConfirmDialogState ] = useState<boolean>(false)
  const { t } = useTranslation()

  // Api request function
  const fetchBandSongs = async ({ pageParam = 0 }) => {
    const response = await api.songs.getBandSongsByCategory(
      bandId,
      item.id,
      {
        limit: PAGE_SIZE,
        offset: pageParam
      }
    )
    return response.data
  }

  // Http requests
  const reqRemoveCategory = useMutation(
    (id: string) => api.songs.removeCategory(id)
  )

  // Infinite scroll api request
  const reqCategorySongs = useInfiniteQuery(
    [`band_category_songs_${item?.id}`],
    fetchBandSongs, {
      getNextPageParam: (lastPage) => {
        if (lastPage.data.data.length < PAGE_SIZE) return undefined
        return lastPage.data.offset + PAGE_SIZE
      },
      enabled: item != null
    }
  )

  // Refetch data
  useRefreshOnFocus(reqCategorySongs.refetch)

  // Loading state and data
  const allPagesData = reqCategorySongs.data?.pages.flatMap((value) => value.data.data) || []

  // Render list view item function
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<ISong>) => (
    <SongListItem
      item={item}
      isLoading={reqCategorySongs.isFetchingNextPage || reqCategorySongs.isRefetching}
      onPress={() => navigate('Song', { item, itemId: item.id })}
      onIconPress={() => navigate('Song', { item, itemId: item.id })}
    />
  ), [
    reqCategorySongs.isFetchingNextPage,
    reqCategorySongs.isRefetching
  ])

  const renderEmptyListComponent = useCallback(() => (
    reqCategorySongs.isLoading ? null : (
      <Text category="s1">
        {t('band_screen.no_songs_category')}
      </Text>
    )
  ), [reqCategorySongs.isLoading, t])

  // Actions
  const removeCategory = async () => {
    const id = item.id
    const response = await reqRemoveCategory.mutateAsync(id)
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.remove_category_msg'),
        type: 'success',
        duration: 2000
      })
      goBack()
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: t('error_msgs.remove_category_denied_msg'),
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.remove_category_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  // TSX
  return (
    <BaseContent
      hideCardsNavigation
      onEndReached={() => {
        if (
          !reqCategorySongs.isFetchingNextPage &&
          !reqRemoveCategory.isLoading &&
          !reqCategorySongs.isRefetching && 
          reqCategorySongs.hasNextPage) {
            reqCategorySongs.fetchNextPage()
        }
      }}
    >
      {
        item && !isEditable ? (
          <>
            <ViewCategory
              item={item}
              onEdit={() => setEditableState(true)}
              onGoBack={() => goBack()}
              onRemove={() => {
                if (allPagesData.length > 0) return showMessage({
                  message: t('band_screen.remove_category_warning'),
                  type: 'info',
                  duration: 2000
                })
                setConfirmDialogState(true)
              }}
              isLoading={
                reqRemoveCategory.isLoading ||
                reqCategorySongs.isLoading
              }
            />
            <Space my={2} />
            <Text category="h5">
              {t('band_screen.included_songs')}
            </Text>
            <FlashList
              estimatedItemSize={80}
              scrollEnabled={false}
              data={allPagesData}
              renderItem={renderListItem}
              ListEmptyComponent={renderEmptyListComponent}
              ListHeaderComponent={() => <Space my={2} />}
              ListFooterComponent={() => (
                reqCategorySongs.isLoading || 
                reqCategorySongs.isFetchingNextPage 
              ) ? (
                  <LoadingContainer>
                    <Spinner size="large" />
                  </LoadingContainer>
                ) : <Space my={2} />
              }
            />
          </>
        ) : (
          <EditCategory
            item={item}
            onCancel={() => setEditableState(false)}
            onGoBack={() => goBack()}
            isLoading={reqRemoveCategory.isLoading}
          />
        )
      }
      <ConfirmDialog
        isVisible={isConfirmDialogOpen}
        onClose={() => setConfirmDialogState(false)}
        onConfirm={removeCategory}
      />
    </BaseContent>
  )
}

export default SaveCategory
