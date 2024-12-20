// Dependencies
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuthStore } from '../../../main/store'
import { MainStackParamList } from '../../../main/router'

// Types
import { IBand, IConcert } from '../../../domain'

// Main API
import api from '../../../infra/api'

// Components
import { Spinner, Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { BaseContent } from '../../layouts'
import { BandListItem, ConcertListItem } from './elements'
import { Space } from '../../components'
import { useRefreshOnFocus } from '../../hooks'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Main page
const MainScreen = (): React.ReactElement => {
  // Hooks
  const { account } = useAuthStore()
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const { t } = useTranslation()

  // HTTP Requests
  const reqFutureConcerts = useQuery(
    ['shows_home'],
    () => api.concerts.getPendingConcerts()
  )

  const reqBands = useQuery(
    ['bands_home'],
    () => api.bands.getBands({
      limit: 5,
      offset: 0
    })
  )

  // Refetch
  useRefreshOnFocus(reqFutureConcerts.refetch)
  useRefreshOnFocus(reqBands.refetch)

  // Rernder band list item component
  const renderBandListItem = useCallback(({ item }: ListRenderItemInfo<IBand>) => (
    <BandListItem
      onPress={() => navigate('Band', { item, itemId: item.id })}
      item={item}
    />
  ) , [])

  // Render concert list item
  const renderConcertListItem = useCallback(({ item }: ListRenderItemInfo<IConcert>) => (
    <ConcertListItem
      onPress={() => navigate('Concert', { item, itemId: item.id })}
      item={item}
    />
  ), [])

  // TSX
  return (
    <BaseContent>
      <Text category="h5">
        {t('main_screen.greeting')}{account?.name}!
      </Text>
      <Space my={1} />
      {
        reqFutureConcerts.isLoading ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : (
          <>
            {
              reqFutureConcerts.data?.data?.data?.length > 0 ? (
                <>
                  <Text category="s1">
                    { t('main_screen.pending_concerts', {
                      count: reqFutureConcerts.data?.data?.data.length
                      })
                    }
                  </Text>
                  <Space my={2} />
                  <FlatList
                    horizontal
                    ItemSeparatorComponent={() => <Space mx={1} />}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    data={reqFutureConcerts.data?.data?.data || []}
                    renderItem={renderConcertListItem}
                  />
                </>
              ) : (
                <Text category="s1">
                  {t('main_screen.no_pending_concerts')}
                </Text>
              )
            }
          </>
        )
      }
      <Space my={2} />
      <Text category="h5">
        {t('main_screen.band_title')}
      </Text>
      {
        reqBands.isLoading ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : (
          <>
          {
            reqBands.data?.data?.data?.length > 0 ? (
              <>
                <FlatList
                  ItemSeparatorComponent={() => <Space my={1} />}
                  ListHeaderComponent={() => <Space my={2} />}
                  ListFooterComponent={() => <Space my={2} />}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}
                  data={reqBands.data?.data?.data || []}
                  renderItem={renderBandListItem}
                />
              </>
            ) : (
              <>
                <Space my={1} />
                <Text category="s1">
                  {t('main_screen.no_bands')}
                </Text>
              </>
            )
          }
          </>
        )
      }
    </BaseContent>
  )
}

// Exporting page
export default MainScreen
