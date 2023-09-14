// Dependencies
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useRefreshOnFocus } from '../../../../hooks'
import { MainStackParamList } from '../../../../../main/router'

// Types
import { ISongCategory } from '../../../../../domain'

// Main API
import api from '../../../../../infra/api'

// Components
import { Spinner, Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { Space } from '../../../../components'
import { CategoryListItem } from './elements'
import { BaseContent } from '../../../../layouts'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Main component
const BandCategories = ({ route }): React.ReactElement => {
  // Destruct params
  const { itemId } = route.params

  // Hooks
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()

  // Http requests
  const {
    data: bandCategories,
    isLoading: isFetching,
    refetch: refetchCategories,
    isRefetching
  } = useQuery(
    [`band-categories-${itemId}`],
    () => api.songs.getBandSongCategories(itemId)
  )

  // Refetch on focus
  useRefreshOnFocus(refetchCategories)

  // Render list view item function
  const renderListItem = useCallback(({ item }: ListRenderItemInfo<ISongCategory>) => (
    <CategoryListItem
      item={item}
      isLoading={isFetching || isRefetching}
      onPress={() => navigate("SaveCategory", { bandId: itemId, item })}
      onIconPress={() => navigate("SaveCategory", { bandId: itemId, item })}
    />
  ), [isFetching, isRefetching])

  const renderListFooter = useCallback(() => isFetching
    ? (
      <LoadingContainer>
        <Spinner size="large" />
      </LoadingContainer>
    ) : <Space my={4} />, [isFetching]
  )

  const renderListEmptyComponent = useCallback(() => (
    isFetching ? null : (
      <Text category="s1">
        Não há categorias registradas nessa banda
      </Text>
    )
  ), [isFetching])

  // TSX
  return (
    <BaseContent
      hideCardsNavigation
      showFloatingButton
      onFloatingButtonPress={() => navigate("SaveCategory", { bandId: itemId })}
    >
      <Text category="h5">
        Categorias registradas
      </Text>
      <Space my={1} />
      {bandCategories?.data?.data?.data.length >= 1 ? (
        <Text category="s1">
          Clique na categoria para visualizar e gerencia-la.
        </Text>
      ) : null}
      <FlatList
        scrollEnabled={false}
        data={bandCategories?.data?.data?.data || []}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        ListHeaderComponent={() => <Space my={2} />}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderListEmptyComponent}
      />
    </BaseContent>
  )
}

export default BandCategories