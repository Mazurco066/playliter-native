// Dependencies
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import { useRefreshOnFocus } from '../../../../hooks'
import { useBandStore } from '../../../../../main/store'

// Types
import { UserAccount } from '../../../../../domain'

// Main API
import api from '../../../../../infra/api'

// Components
import { Icon, Input, Spinner, Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
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

  // Refetch on focus
  useRefreshOnFocus(refetchIntegrants)

  // Render list view item function
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<UserAccount>) => (
    <IntegrantItem
      item={item}
      isLoading={isFetching || isRefetching}
    />
  ), [isFetching, isRefetching])

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
        Não há usuários elegíveis para integrar a sua banda com o filtro selecionado.
      </Text>
    )
  ), [isFetching])

  // Computed props
  const integrantsData: UserAccount[] = bandIntegrants?.data?.data || []
  const unafiliadedData: UserAccount[] = integrantsData.filter((i: UserAccount) => getBandRole(i.id, band) === 'Sem afiliação')
  const filteredData = unafiliadedData.filter((i: UserAccount) => i.name.toLowerCase().includes(searchFilter.toLowerCase()))

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        Convidar músicos
      </Text>
      <Space my={1} />
      {filteredData?.length >= 1 ? (
        <Text category="s1">
          Clique no músico para convida-lo(a) para sua banda.
        </Text>
      ) : null}
      {unafiliadedData?.length >= 1 ? (
        <Input
          label="Filtro"
          placeholder="Pesquise por músicos..."
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