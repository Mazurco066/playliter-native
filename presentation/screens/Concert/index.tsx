// Dependencies
import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { IConcert, IConcertSongDto } from '../../../domain'
import { MainStackParamList } from '../../../main/router'

// Main API
import api from '../../../infra/api'

// Components
import { Spinner, Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { BaseContent, ConfirmDialog } from '../../layouts'
import { Space } from '../../components'
import { ConcertHeaderContainer, SongListItem } from './elements'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Page interfaces
type ConfirmActions = { name: 'delete_concert' | 'remove_song', id?: string }

// Page Main component
const ConcertScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item, itemId } = route.params

  // Hooks
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ concert, setConcert ] = useState<IConcert | null>(item ?? null)
  const [ isConfirmDialogOpen, setConfirmDialogState ] = useState<boolean>(false)
  const [ action, setAction ] = useState<ConfirmActions>({ name: 'delete_concert' })

  // Http requests
  const {
    data: updatedItem,
    isLoading: isFetching,
    refetch: refetchItem
  } = useQuery(
    [`get-concert-${itemId}`],
    () => api.concerts.getConcert(itemId)
  )

  // Effects
  useEffect(() => {
    if (updatedItem && updatedItem.data) {
      const { data } = updatedItem.data
      if (data) setConcert(data as IConcert)
    }
  }, [updatedItem])

  // Actions
  const confirmDialogActions = async (action: ConfirmActions) => {
    console.log('confirmed action: ' + action.name + ' with id: ' + action.id)
  }

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      {
        concert ? (
          <>
            <ConcertHeaderContainer
              concert={concert}
              onDeletePress={() => {
                setAction({ name: 'delete_concert', id: concert.id })
                setConfirmDialogState(true)
              }}
              onEditPress={() => console.log('edit click')}
              onNotesPress={() => console.log('notes click')}
              onReorderPress={() => console.log('reorder click')}
              onSequentialPress={() => console.log('sequential click')}
            />
            <Space my={1} />
            <Text category="h5">
              Músicas selecionadas
            </Text>
            {
              concert.songs.length > 0 ? (
                <FlatList
                  ItemSeparatorComponent={() => <Space my={1} />}
                  ListHeaderComponent={() => <Space my={2} />}
                  ListFooterComponent={() => <Space my={2} />}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}
                  data={concert.songs || []}
                  renderItem={({ item, index }: ListRenderItemInfo<IConcertSongDto>) => (
                    <SongListItem
                      item={item}
                      number={index + 1}
                      onPress={() => navigate('Song', { itemId: item.id })}
                      onRemovePress={() => {
                        setAction({ name: 'remove_song', id: item.id })
                        setConfirmDialogState(true)
                      }}
                    />
                  )}
                />    
              ) : (
                <Text
                  category="s1"
                  style={{ marginTop: 8 }}
                >
                  Não há músicas adicionadas nessa apresentação no momento.
                </Text>
              )
            }
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
export default ConcertScreen