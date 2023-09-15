// Dependencies
import React, { useCallback, useState } from 'react'
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
  const { isLoading: isRemovingCategory, mutateAsync: removeCategoryRequest } = useMutation(
    (id: string) => api.songs.removeCategory(id)
  )

  // Infinite scroll api request
  const {
    data,
    isFetchingNextPage,
    isLoading: isLoadingSongs,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery(
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
  useRefreshOnFocus(refetch)

  // Loading state and data
  const isLoading = isRemovingCategory
  const allPagesData = data?.pages.flatMap((value) => value.data.data) || []

  // Render list view item function
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<ISong>) => (
    <SongListItem
      item={item}
      isLoading={isFetchingNextPage || isRefetching}
      onPress={() => navigate('Song', { item, itemId: item.id })}
      onIconPress={() => navigate('Song', { item, itemId: item.id })}
    />
  ), [isFetchingNextPage, isRefetching])

  const renderEmptyListComponent = useCallback(() => (
    isLoadingSongs ? null : (
      <Text category="s1">
        Não há músicas inclusas nessa categoria dentro do repertório da banda.
      </Text>
    )
  ), [isLoadingSongs])

  // Actions
  const removeCategory = async () => {
    const id = item.id
    const response = await removeCategoryRequest(id)
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: `A categoria foi removida da banda com sucesso!`,
        type: 'success',
        duration: 2000
      })
      goBack()
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: `Você não tem permissão para remover essa categoria!`,
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: `Ocorreu um erro ao remover a categoria! Tente novamente mais tarde.`,
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
        if (!isFetchingNextPage &&!isLoading && !isRefetching && hasNextPage) {
          fetchNextPage()
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
                  message: `Essa categoria tem músicas vinculadas. Remova o vínculo com a(s) música(s) para remover essa categoria.`,
                  type: 'info',
                  duration: 2000
                })
                setConfirmDialogState(true)
              }}
              isLoading={isLoading || isLoadingSongs}
            />
            <Space my={2} />
            <Text category="h5">
              Músicas inclusas
            </Text>
            <FlashList
              estimatedItemSize={80}
              scrollEnabled={false}
              data={allPagesData}
              renderItem={renderListItem}
              ListEmptyComponent={renderEmptyListComponent}
              ListHeaderComponent={() => <Space my={2} />}
              ListFooterComponent={() => isLoadingSongs || isFetchingNextPage
                ? (
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
            isLoading={isLoading}
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