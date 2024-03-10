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
  const reqBand = useQuery(
    [`get-band-${itemId}`],
    () => api.bands.getBand(itemId)
  )

  const reqConcerts = useQuery(
    [`get-band-concerts-${itemId}`],
    () => api.concerts.getConcerts(itemId, { limit: 1, offset: 0 })
  )

  const reqSongs = useQuery(
    [`get-band-songs-${itemId}`],
    () => api.songs.getBandSongs(itemId, { limit: 1, offset: 0 })
  )

  const reqCategories = useQuery(
    [`get-band-categories-${itemId}`],
    () => api.songs.getBandSongCategories(itemId, { limit: 1, offset: 0 })
  )

  const reqPromoteIntegrant = useMutation(
    (data: { id: string, bandId: string }) => api.bands.promoteIntegrant(data.bandId, data.id)
  )

  const reqTransferOwnership = useMutation(
    (data: { id: string, bandId: string }) => api.bands.transferOwnership(data.bandId, data.id)
  )

  const reqDemoteIntegrant = useMutation(
    (data: { id: string, bandId: string }) => api.bands.demoteIntegrant(data.bandId, data.id)
  )

  const reqRemoveIntegrant = useMutation(
    (data: { id: string, bandId: string }) => api.bands.removeIntegrant(data.bandId, data.id)
  )

  const reqRemoveBand = useMutation((id: string) => api.bands.deleteBand(id))

  // Refetch on focus
  useRefreshOnFocus(reqBand.refetch)
  useRefreshOnFocus(reqConcerts.refetch)
  useRefreshOnFocus(reqSongs.refetch)
  useRefreshOnFocus(reqCategories.refetch)

  // Effects
  useEffect(() => {
    setBand(item ?? null)
  }, [])

  useEffect(() => {
    if (reqBand.data && reqBand.data.data) {
      const { data } = reqBand.data.data
      if (data) setBand(data as IBand)
    }
  }, [reqBand.data])

  // Numbers and data
  const categoryAmount = reqCategories.data?.data?.data?.total || 0
  const concertAmount = reqConcerts.data?.data?.data?.total || 0
  const songAmount = reqSongs.data?.data?.data?.total || 0
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
      isLoading={
        reqBand.isLoading ||
        reqPromoteIntegrant.isLoading ||
        reqDemoteIntegrant.isLoading ||
        reqRemoveIntegrant.isLoading ||
        reqRemoveBand.isLoading ||
        reqTransferOwnership.isLoading
      }
    />
  ), [
    reqBand.isLoading,
    reqPromoteIntegrant.isLoading,
    reqDemoteIntegrant.isLoading,
    reqRemoveIntegrant.isLoading,
    reqRemoveBand.isLoading,
    reqTransferOwnership.isLoading,
    setAction,
    setConfirmDialogState
  ])

  // Actions
  const demoteIntegrantAction = async (id: string) => {
    const response = await reqDemoteIntegrant.mutateAsync({
      id,
      bandId: band.id
    })
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.demote_msg'),
        type: 'success',
        duration: 2000
      })
      reqBand.refetch()
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
    const response = await reqPromoteIntegrant.mutateAsync({
      id,
      bandId: band.id
    })
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.promote_msg'),
        type: 'success',
        duration: 2000
      })
      reqBand.refetch()
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
        const removeBandResponse = await reqRemoveBand.mutateAsync(action.id)
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
        const removeIntegrantResponse = await reqRemoveIntegrant.mutateAsync({
          id: action.id,
          bandId: band.id
        })
        if ([200, 201].includes(removeIntegrantResponse.status)) {
          showMessage({
            message: t('success_msgs.remove_member_msg'),
            type: 'success',
            duration: 2000
          })
          reqBand.refetch()
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
        const transferOwnershipResponse = await reqTransferOwnership.mutateAsync({
          id: action.id,
          bandId: band.id
        })
        if ([200, 201].includes(transferOwnershipResponse.status)) {
          showMessage({
            message: t('success_msgs.owner_transfer_msg'),
            type: 'success',
            duration: 2000
          })
          reqBand.refetch()
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
      isFloatingButtonDisabled={
        reqRemoveBand.isLoading ||
        reqBand.isLoading
      }
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
              isLoading={
                reqRemoveBand.isLoading ||
                reqBand.isLoading
              }
            />
            <Space my={2} />
            <BandFeatureContainer>
              <BandFeature
                isLoading={reqSongs.isLoading}
                amount={songAmount}
                title={t('band_screen.songs_title')}
                onPress={() => navigate('BandSongs', { item: band, itemId: band.id })}
              />
              <BandFeature
                isLoading={reqCategories.isLoading}
                amount={categoryAmount}
                title={t('band_screen.categories_title')}
                onPress={() => navigate('BandCategories', { item: band, itemId: band.id })}
              />
              <BandFeature
                isLoading={reqConcerts.isLoading}
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
        ) : reqBand.isLoading ? (
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
