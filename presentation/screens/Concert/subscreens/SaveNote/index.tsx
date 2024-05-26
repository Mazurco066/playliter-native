// Dependencies
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useConcertStore } from '../../../../../main/store'

// Http client
import api from '../../../../../infra/api'
import { useMutation } from '@tanstack/react-query'

// Types
import { MainStackParamList } from '../../../../../main/router'

// Components
import { showMessage } from 'react-native-flash-message'
import { EditNote, ViewNote } from './elements'
import { BaseContent, ConfirmDialog } from '../../../../layouts'

// Notes subscreen
const SaveNote = ({ route }): React.ReactElement => {
  // Destruct params
  const { concertId, item } = route.params

  // Http requests
  const reqDeleteNote = useMutation(
    (id: string) => api.concerts.removeConcertObservation(concertId, id)
  )

  // Hooks
  const { removeObservation } = useConcertStore()
  const { goBack } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ isEditable, setEditableState ] = useState<boolean>(false)
  const [ isConfirmDialogOpen, setConfirmDialogState ] = useState<boolean>(false)
  const { t } = useTranslation()

  // Loading state
  const isLoading = reqDeleteNote.isLoading

  // Actions
  const removeNote = async () => {
    const id = item.id
    const response = await reqDeleteNote.mutateAsync(id)
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.save_note_msg'),
        type: 'success',
        duration: 2000
      })
      removeObservation(id)
      goBack()
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: t('error_msgs.save_note_denied_msg'),
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.save_note_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  // TSX
  return (
    <BaseContent
      hideCardsNavigation
    >
      {
        item && !isEditable ? (
          <ViewNote
            item={item}
            onEdit={() => setEditableState(true)}
            onGoBack={() => goBack()}
            onRemove={() => setConfirmDialogState(true)}
            isLoading={isLoading}
          />
        ) : (
          <EditNote
            item={item}
            onCancel={() => setEditableState(false)}
            onGoBack={() => goBack()}
            isLoading={isLoading}
          />
        )
      }
      <ConfirmDialog
        isVisible={isConfirmDialogOpen}
        onClose={() => setConfirmDialogState(false)}
        onConfirm={removeNote}
      />
    </BaseContent>
  )
}

export default SaveNote
