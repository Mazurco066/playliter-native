// Dependencies
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { IConcertSongDto } from '../../../../../domain'
import { getIcon } from '../../../../utils'
import { MainStackParamList } from '../../../../../main/router'

// Main api client
import api from '../../../../../infra/api'

// Components
import DraggableFlatList, { DragEndParams, RenderItemParams } from 'react-native-draggable-flatlist'
import styled from 'styled-components'
import { color } from 'styled-system'
import { showMessage } from 'react-native-flash-message'
import { Button, Text, useTheme } from '@ui-kitten/components'
import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import { SongListItem } from './elements'
import { Space } from '../../../../components'
import { BaseContent } from '../../../../layouts'

// Styled components
const Container = styled(LinearGradient)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  ${color}
`

const HeaderConteiner = styled(View)`
  position: relative;
  width: 100%;
  min-height: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  padding-bottom: 8px;
`

const DataContainer = styled(View)`
  position: relative;
  align-items: center;
  width: 100%;
  padding: 16px 8px 16px 8px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  ${color}
`

const ButtonGroup = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

// Reorder subscreen
const ReorderConcert = ({ route }): React.ReactElement => {
  // Destruct params
  const { item } = route.params

  // Http requests
  const {
    isLoading: isReorderingSongs,
    mutateAsync: reorderSongs
  } = useMutation(
    (data: { id: string, songs: string[] }) =>
      api.concerts.reorderConcert(data.id, data.songs)
  )
  
  // Hooks
  const theme = useTheme()
  const { goBack } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ songsData, setSongsData ] = useState<IConcertSongDto[]>(item.songs)
  const [ scrollEnabled, setScrollEnabled ] = useState<boolean>(true)
  const { t } = useTranslation()

  // Reordable list actions
  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<IConcertSongDto>) => {
    return (
      <SongListItem 
        item={item}
        onLongPress={drag}
        isActive={isActive}
        isLoading={isReorderingSongs}
      />
    )
  }, [isReorderingSongs])

  const onDragBegin = useCallback(() => {
    setScrollEnabled(false)
  }, [setScrollEnabled])

  const onDragEnd = useCallback(({ data }: DragEndParams<IConcertSongDto>) => {
    setSongsData(data)
    setScrollEnabled(true)
  }, [setSongsData, setScrollEnabled])

  // Actions
  const submitOrder = async () => {
    const songIds = songsData.map((s) => s.id)
    const response = await reorderSongs({
      id: item.id,
      songs: songIds
    })
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.reorder_msg'),
        type: 'success',
        duration: 2000
      })
      goBack()
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: t('error_msgs.reorder_denied_msg'),
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.reorder_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Container
        colors={[theme['color-primary-500'], theme['color-secondary-500']]}
      >
        <HeaderConteiner>
          <Text category="h5">
            {t('concert_screen.reorder_heading')}
          </Text>
        </HeaderConteiner>
        <DataContainer
          style={{
            backgroundColor: theme['color-basic-700']
          }}
        >
          <Text
            category="s1"
            style={{ textAlign: 'center' }}
          >
            {t('concert_screen.reorder_placeholder')}
          </Text>
        </DataContainer>
      </Container>
      <Space my={2} />
      <ButtonGroup>
        <Button
          status="danger"
          size="small"
          onPress={() => goBack()}
          disabled={isReorderingSongs}
          style={{ flex: 1 }}
          accessoryLeft={getIcon('close-outline')}
        >
          {t('concert_screen.cancel_action')}
        </Button>
        <Button
          status="primary"
          size="small"
          onPress={submitOrder}
          disabled={isReorderingSongs}
          style={{ flex: 1 }}
          accessoryLeft={getIcon('checkmark-outline')}
        >
          {t('concert_screen.reorder_action')}
        </Button>
      </ButtonGroup>
      <DraggableFlatList
        scrollEnabled={false}
        data={songsData}
        renderItem={renderItem}
        onDragBegin={onDragBegin}
        onDragEnd={onDragEnd}
        keyExtractor={(item) => item.id}
        activationDistance={scrollEnabled ? 100 : 1}
        ItemSeparatorComponent={() => <Space my={1} />}
        ListHeaderComponent={() => <Space my={2} />}
        ListFooterComponent={() => <Space my={2} />}
      />
       <ButtonGroup>
        <Button
          status="danger"
          size="small"
          onPress={() => goBack()}
          disabled={isReorderingSongs}
          style={{ flex: 1 }}
          accessoryLeft={getIcon('close-outline')}
        >
          {t('concert_screen.cancel_action')}
        </Button>
        <Button
          status="primary"
          size="small"
          onPress={submitOrder}
          disabled={isReorderingSongs}
          style={{ flex: 1 }}
          accessoryLeft={getIcon('checkmark-outline')}
        >
          {t('concert_screen.reorder_action')}
        </Button>
      </ButtonGroup>
    </BaseContent>
  )
}

export default ReorderConcert