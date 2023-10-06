// Dependencies
import styled from 'styled-components'
import React, { useState, useEffect }  from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import { ISong } from '../../../domain'
import { useRefreshOnFocus } from '../../hooks'
import { getIcon } from '../../utils'

// Main API
import api from '../../../infra/api'

// Types
import { MainStackParamList } from '../../../main/router'

// Components
import { Button, IndexPath, Spinner, OverflowMenu, MenuItem, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'
import { Songsheet } from '../../components'
import { BaseContent } from '../../layouts'

// Styled components
const LoadingContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

// Page Main component
const SongScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item, itemId } = route.params

  // Hooks
  const theme = useTheme()
  const { goBack, navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ song, setSong ] = useState<ISong | null>(item ?? null)
  const [ visible, setVisible ] = useState<boolean>(false)

  // Http requests
  const {
    data: updatedItem,
    isLoading: isFetching,
    refetch: refetchItem
  } = useQuery(
    [`get-song-${itemId}`],
    () => api.songs.getSong(itemId)
  )

  // Effects
  useEffect(() => {
    if (updatedItem && updatedItem.data) {
      const { data } = updatedItem.data
      if (data) setSong(data as ISong)
    }
  }, [updatedItem])

  // Refresh on focus
  useRefreshOnFocus(refetchItem)

  // Actions
  const onItemSelect = (_: IndexPath): void => {
    setVisible(false)
  }

  // Render components
  const renderToggleButton = (): React.ReactElement => (
    <Button
      size="small"
      appearance="ghost"
      accessoryLeft={getIcon('more-vertical-outline')}
      onPress={() => setVisible(true)}
    />
  )

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      {
        song ? (
          <Songsheet
            song={song}
            showControlHeaders
            onToneUpdateSuccess={refetchItem}
            canUpdateBaseTone
          >
            <OverflowMenu
              anchor={renderToggleButton}
              visible={visible}
              onSelect={onItemSelect}
              onBackdropPress={() => setVisible(false)}
            >
              <MenuItem
                title='Duplicar'
                accessoryLeft={getIcon('file-add-outline')}
                disabled={isFetching}
                onPress={() => {}}
                style={{ backgroundColor: theme['color-basic-700'] }}
              />
              <MenuItem
                title='Editar'
                accessoryLeft={getIcon('edit-2-outline')}
                disabled={isFetching}
                onPress={() => navigate("SaveSong", { item: song, bandId: song.band.id })}
                style={{ backgroundColor: theme['color-basic-700'] }}
              />
              <MenuItem
                title='Excluir'
                accessoryLeft={getIcon('trash-2-outline')}
                disabled={isFetching}
                onPress={() => {}}
                style={{ backgroundColor: theme['color-basic-700'] }}
              />
            </OverflowMenu>
          </Songsheet>
        ) : isFetching ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : null
      }
    </BaseContent>
  )
} 

// Exporting page
export default SongScreen