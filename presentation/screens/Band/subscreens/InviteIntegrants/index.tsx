// Dependencies
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRefreshOnFocus } from '../../../../hooks'
import { useBandStore } from '../../../../../main/store'

// Types
import { UserAccount } from '../../../../../domain'

// Main API
import api from '../../../../../infra/api'

// Components
import { Icon, Input, Spinner, Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { IntegrantItem } from './elements'
import { Space } from '../../../../components'
import { BaseContent } from '../../../../layouts'
import { getBandRole } from '../../../../utils'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// General styles
const textStyle = {
  paddingTop: 12,
  paddingRight: 24,
  paddingBottom: 12,
  paddingLeft: 24,
  marginTop: -8,
  marginRight: -8,
  marginBottom: -8,
  marginLeft: -8
}

// Main component
const InviteIntegrants = ({ route }): React.ReactElement => {
  // Destruct params
  const { itemId } = route.params

  // Hooks
  const { band } = useBandStore()
  const [ searchFilter, setSearchFilter ] = useState<string>('')
  const { t } = useTranslation()

  // Http requests
  const {
    data: bandIntegrants,
    isLoading: isFetching,
    refetch: refetchIntegrants,
    isRefetching
  } = useQuery(
    [`band-integrants-${itemId}`],
    () => api.accounts.getRegisteredAccounts()
  )

  const { isLoading, mutateAsync: inviteIntegrant } = useMutation(
    (data: { id: string, bandId: string }) =>
      api.bands.inviteIntegrant(data.bandId, data.id)
  )

  // Refetch on focus
  useRefreshOnFocus(refetchIntegrants)

  // Render list view item function
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<UserAccount>) => (
    <IntegrantItem
      item={item}
      isLoading={isFetching || isRefetching || isLoading}
      onPress={() => submitInvitation(item.id)}
    />
  ), [isFetching, isRefetching, isLoading])

  const renderListFooter = useCallback(() => isFetching
    ? (
      <LoadingContainer>
        <Spinner size="large" />
      </LoadingContainer>
    ) : <Space my={2} />, [isFetching]
  )

  const renderListEmptyComponent = useCallback(() => (
    isFetching ? null : (
      <Text category="s1">
        {t('band_screen.no_members')}
      </Text>
    )
  ), [isFetching, t])

  // Actions
  const submitInvitation = async (itemId: string) => {
    const response = await inviteIntegrant({ id: itemId, bandId: band.id })
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.invite_msg'),
        type: 'success',
        duration: 2000
      })
    } else if ([400].includes(response.status)) {
      showMessage({
        message: t('error_msgs.invited_already_msg'),
        type: 'warning',
        duration: 2000
      })
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: t('error_msgs.invited_denied_msg'),
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.invited_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  // Computed props
  const integrantsData: UserAccount[] = bandIntegrants?.data?.data || []
  const unafiliadedData: UserAccount[] = integrantsData.filter((i: UserAccount) => getBandRole(i.id, band) === 'Sem afiliação')
  const filteredData = unafiliadedData.filter((i: UserAccount) => i.name.toLowerCase().includes(searchFilter.toLowerCase()))

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        {t('band_screen.invite_heading')}
      </Text>
      <Space my={1} />
      {filteredData?.length >= 1 ? (
        <>
          <Text category="s1">
            {t('band_screen.invite_placeholder')}
          </Text>
          <Space my={1} />
        </>
      ) : null}
      {unafiliadedData?.length >= 1 ? (
        <Input
          label={t('band_screen.filter_label')}
          placeholder={t('band_screen.search_musicians_placeholder')}
          keyboardType="ascii-capable"
          accessoryLeft={props => <Icon {...props} name="funnel-outline" />}
          value={searchFilter}
          onChangeText={nextValue => setSearchFilter(nextValue)}
          textStyle={textStyle}
        />
      ) : null}
      <FlatList
        scrollEnabled={false}
        data={filteredData || []}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        ItemSeparatorComponent={() => <Space my={1} />}
        ListHeaderComponent={() => <Space my={2} />}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderListEmptyComponent}
      />
    </BaseContent>
  )
}

export default InviteIntegrants