// Dependencies
import styled from 'styled-components'
import React, { useState, useEffect }  from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery, useMutation } from '@tanstack/react-query'
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
import { showMessage } from 'react-native-flash-message'
import { Songsheet } from '../../components'
import { BaseContent, ConfirmDialog } from '../../layouts'

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
  const [ isConfirmDialogOpen, setConfirmDialogState ] = useState<boolean>(false)
  const [ song, setSong ] = useState<ISong | null>(item ?? null)
  const [ visible, setVisible ] = useState<boolean>(false)
  const { t } = useTranslation()

  // Http requests
  const reqSong = useQuery(
    [`get-song-${itemId}`],
    () => api.songs.getSong(itemId)
  )

  const reqDeleteSong = useMutation(
    (id: string) => api.songs.deleteSong(id)
  )

  // Effects
  useEffect(() => {
    if (reqSong.data && reqSong.data.data) {
      const { data } = reqSong.data.data
      if (data) setSong(data as ISong)
    }
  }, [reqSong.data])

  // Refresh on focus
  useRefreshOnFocus(reqSong.refetch)

  // Actions
  const onItemSelect = (_: IndexPath): void => {
    setVisible(false)
  }

  const deleteSongAction = async () => {
    const response = await reqDeleteSong.mutateAsync(song.id)
    if (response.status < 400) {
      showMessage({
        message: t('success_msgs.delete_song_msg'),
        duration: 2000,
        type: 'success'
      })
      goBack()
    } else if ([400, 404].includes(response.status)) {
      showMessage({
        message: t('error_msgs.song_not_found_msg'),
        duration: 2000,
        type: 'warning'
      })
      goBack()
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: t('error_msgs.song_delete_denied_msg'),
        duration: 2000,
        type: 'info'
      })
    } else {
      showMessage({
        message: t('error_msgs.song_delete_error_msg'),
        duration: 2000,
        type: 'danger'
      })
    }
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
            showCharts
            showControlHeaders
            onToneUpdateSuccess={reqSong.refetch}
            canUpdateBaseTone
          >
            <OverflowMenu
              anchor={renderToggleButton}
              visible={visible}
              onSelect={onItemSelect}
              onBackdropPress={() => setVisible(false)}
            >
              <MenuItem
                title={t('song_screen.duplicate_action')}
                accessoryLeft={getIcon('file-add-outline')}
                disabled={reqSong.isLoading || reqDeleteSong.isLoading}
                onPress={() => navigate("CloneSong", { item: song })}
                style={{ backgroundColor: theme['color-basic-700'] }}
              />
              <MenuItem
                title={t('song_screen.edit_action')}
                accessoryLeft={getIcon('edit-2-outline')}
                disabled={reqSong.isLoading || reqDeleteSong.isLoading}
                onPress={() => navigate("SaveSong", { item: song, bandId: song.band.id })}
                style={{ backgroundColor: theme['color-basic-700'] }}
              />
              <MenuItem
                title={t('song_screen.delete_action')}
                accessoryLeft={getIcon('trash-2-outline')}
                disabled={reqSong.isLoading || reqDeleteSong.isLoading}
                onPress={() => setConfirmDialogState(true)}
                style={{ backgroundColor: theme['color-basic-700'] }}
              />
            </OverflowMenu>
          </Songsheet>
        ) : reqSong.isLoading ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : null
      }
      <ConfirmDialog
        isVisible={isConfirmDialogOpen}
        onClose={() => setConfirmDialogState(false)}
        onConfirm={deleteSongAction}
      />
    </BaseContent>
  )
} 

// Exporting page
export default SongScreen
