// Dependencies
import styled from 'styled-components'
import React, { useCallback, useEffect, useState }  from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { IBand, UserAccount } from '../../../domain'
import { MainStackParamList } from '../../../main/router'
import { useBandStore } from '../../../main/store'
import { useRefreshOnFocus } from '../../hooks'

// Main API
import api from '../../../infra/api'

// Components
import { Spinner, Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Space } from '../../components'
import { BandFeature, BandHeaderContainer, IntegrantItem } from './elements'
import { BaseContent, ConfirmDialog } from '../../layouts'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

const BandFeatureContainer = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

// Page interfaces
type ConfirmActions = { name: 'delete_band' | 'remove_integrant' | 'transfer_ownership', id?: string }

// Page Main component
const BandScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item, itemId } = route.params
  const { t } = useTranslation()

  // Hooks
  const { band, setBand } = useBandStore()
  const { goBack, navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ isConfirmDialogOpen, setConfirmDialogState ] = useState<boolean>(false)
  const [ action, setAction ] = useState<ConfirmActions>({ name: 'delete_band' })

  // Http requests
  const {
    data: updatedItem,
    isLoading: isFetching,
    refetch: refetchItem
  } = useQuery(
    [`get-band-${itemId}`],
    () => api.bands.getBand(itemId)
  )

  const {
    data: bandConcerts,
    isLoading: isFetchingConcerts,
    refetch: refetchConcerts
  } = useQuery(
    [`get-band-concerts-${itemId}`],
    () => api.concerts.getConcerts(itemId, { limit: 1, offset: 0 })
  )

  const {
    data: bandSongs,
    isLoading: isFetchingSongs,
    refetch: refetchSongs
  } = useQuery(
    [`get-band-songs-${itemId}`],
    () => api.songs.getBandSongs(itemId, { limit: 1, offset: 0 })
  )

  const {
    data: bandCategories,
    isLoading: isFetchingCategories,
    refetch: refetchCategories
  } = useQuery(
    [`get-band-categories-${itemId}`],
    () => api.songs.getBandSongCategories(itemId, { limit: 1, offset: 0 })
  )

  const { isLoading: isPromoteLoading, mutateAsync: promoteIntegrant } = useMutation(
    (data: { id: string, bandId: string }) => api.bands.promoteIntegrant(data.bandId, data.id)
  )

  const { isLoading: isTransferLoading, mutateAsync: transferOwnership } = useMutation(
    (data: { id: string, bandId: string }) => api.bands.transferOwnership(data.bandId, data.id)
  )

  const { isLoading: isDemoteLoading, mutateAsync: demoteIntegrant } = useMutation(
    (data: { id: string, bandId: string }) => api.bands.demoteIntegrant(data.bandId, data.id)
  )

  const { isLoading: isRemoveIntegrantLoading, mutateAsync: removeIntegrant } = useMutation(
    (data: { id: string, bandId: string }) => api.bands.removeIntegrant(data.bandId, data.id)
  )

  const { isLoading: isRemoveBandLoading, mutateAsync: removeBand } = useMutation(
    (id: string) => api.bands.deleteBand(id)
  )

  // Refetch on focus
  useRefreshOnFocus(refetchItem)
  useRefreshOnFocus(refetchConcerts)
  useRefreshOnFocus(refetchSongs)
  useRefreshOnFocus(refetchCategories)

  // Effects
  useEffect(() => {
    setBand(item ?? null)
  }, [])

  useEffect(() => {
    if (updatedItem && updatedItem.data) {
      const { data } = updatedItem.data
      if (data) setBand(data as IBand)
    }
  }, [updatedItem])

  // Numbers and data
  const categoryAmount = bandCategories?.data?.data?.total || 0
  const concertAmount = bandConcerts?.data?.data?.total || 0
  const songAmount = bandSongs?.data?.data?.total || 0
  const integrants = band?.members || []

  // Render functions
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<UserAccount>) => (
    <IntegrantItem
      item={item}
      onDemotePress={() => demoteIntegrantAction(item.id)}
      onPromotePress={() => promoteIntegrantAction(item.id)}
      onTransferPress={() => {
        setAction({ name: 'transfer_ownership', id: item.id })
        setConfirmDialogState(true)
      }}
      onRemovePress={() => {
        setAction({ name: 'remove_integrant', id: item.id })
        setConfirmDialogState(true)
      }}
      isLoading={isFetching || isPromoteLoading || isDemoteLoading || isRemoveIntegrantLoading || isRemoveBandLoading || isTransferLoading}
    />
  ), [
    isFetching,
    isPromoteLoading,
    isDemoteLoading,
    isRemoveIntegrantLoading,
    isRemoveBandLoading,
    isTransferLoading,
    setAction,
    setConfirmDialogState
  ])

  // Actions
  const demoteIntegrantAction = async (id: string) => {
    const response = await demoteIntegrant({ id, bandId: band.id })
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.demote_msg'),
        type: 'success',
        duration: 2000
      })
      refetchItem()
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: t('error_msgs.demote_denied_msg'),
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.demote_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  const promoteIntegrantAction = async (id: string) => {
    const response = await promoteIntegrant({ id, bandId: band.id })
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.promote_msg'),
        type: 'success',
        duration: 2000
      })
      refetchItem()
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: t('error_msgs.promote_denied_msg'),
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.promote_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  const confirmDialogActions = async (action: ConfirmActions) => {
    switch (action.name) {
      case 'delete_band':
        const removeBandResponse = await removeBand(action.id)
        if ([200, 201].includes(removeBandResponse.status)) {
          showMessage({
            message: t('success_msgs.band_remove_msg'),
            type: 'success',
            duration: 2000
          })
          goBack()
        } else if ([401, 403].includes(removeBandResponse.status)) {
          showMessage({
            message: t('error_msgs.band_remove_denied'),
            type: 'warning',
            duration: 2000
          })
        } else {
          showMessage({
            message: t('error_msgs.band_remove_error'),
            type: 'danger',
            duration: 2000
          })
        }
        break
      case 'remove_integrant':
        const removeIntegrantResponse = await removeIntegrant({
          id: action.id,
          bandId: band.id
        })
        if ([200, 201].includes(removeIntegrantResponse.status)) {
          showMessage({
            message: t('success_msgs.remove_member_msg'),
            type: 'success',
            duration: 2000
          })
          refetchItem()
        } else if ([401, 403].includes(removeIntegrantResponse.status)) {
          showMessage({
            message: t('error_msgs.remove_member_denied_msg'),
            type: 'warning',
            duration: 2000
          })
        } else {
          showMessage({
            message: t('error_msgs.remove_member_error_msg'),
            type: 'danger',
            duration: 2000
          })
        }
        break
      case 'transfer_ownership':
        const transferOwnershipResponse = await transferOwnership({
          id: action.id,
          bandId: band.id
        })
        if ([200, 201].includes(transferOwnershipResponse.status)) {
          showMessage({
            message: t('success_msgs.owner_transfer_msg'),
            type: 'success',
            duration: 2000
          })
          refetchItem()
        } else if ([401, 403].includes(transferOwnershipResponse.status)) {
          showMessage({
            message: t('error_msgs.owner_transfer_denied_msg'),
            type: 'warning',
            duration: 2000
          })
        } else {
          showMessage({
            message: t('error_msgs.owner_transfer_error_msg'),
            type: 'danger',
            duration: 2000
          })
        }
        break
    }
  }

  // TSX
  return (
    <BaseContent
      hideCardsNavigation
      showFloatingButton
      floatingIcon="person-add-outline"
      onFloatingButtonPress={() => navigate("InviteIntegrants", { item: band, itemId: band.id })}
      isFloatingButtonDisabled={isRemoveBandLoading || isFetching}
    >
      {
        band ? (
          <>
            <BandHeaderContainer
              band={band}
              onDeletePress={() => {
                setAction({ name: 'delete_band', id: band.id })
                setConfirmDialogState(true)
              }}
              onEditPress={() => navigate('SaveBand', { item: band })}
              isLoading={isRemoveBandLoading || isFetching}
            />
            <Space my={2} />
            <BandFeatureContainer>
              <BandFeature
                isLoading={isFetchingSongs}
                amount={songAmount}
                title={t('band_screen.songs_title')}
                onPress={() => navigate('BandSongs', { item: band, itemId: band.id })}
              />
              <BandFeature
                isLoading={isFetchingCategories}
                amount={categoryAmount}
                title={t('band_screen.categories_title')}
                onPress={() => navigate('BandCategories', { item: band, itemId: band.id })}
              />
              <BandFeature
                isLoading={isFetchingConcerts}
                amount={concertAmount}
                title={t('band_screen.concerts_title')}
                onPress={() => navigate('BandConcerts', { item: band, itemId: band.id })}
              />
            </BandFeatureContainer>
            <Space my={2} />
            <Text category="h5">
              {t('band_screen.members_title')}
            </Text>
            <FlatList
              ItemSeparatorComponent={() => <Space my={1} />}
              ListHeaderComponent={() => <Space my={2} />}
              ListFooterComponent={() => <Space my={4} />}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              data={integrants}
              renderItem={renderListItem}
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
export default BandScreen