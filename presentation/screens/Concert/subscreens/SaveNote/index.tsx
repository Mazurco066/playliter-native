// Dependencies
import React, { useState } from 'react'
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
  const { isLoading: isRemovingNote, mutateAsync: removeNoteRequest } = useMutation(
    (id: string) => api.concerts.removeConcertObservation(concertId, id)
  )

  // Hooks
  const { removeObservation } = useConcertStore()
  const { goBack } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ isEditable, setEditableState ] = useState<boolean>(false)
  const [ isConfirmDialogOpen, setConfirmDialogState ] = useState<boolean>(false)

  // Loading state
  const isLoading = isRemovingNote

  // Actions
  const removeNote = async () => {
    const id = item.id
    const response = await removeNoteRequest(id)
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: `A anotação foi removida da apresentação com sucesso!`,
        type: 'success',
        duration: 2000
      })
      removeObservation(id)
      goBack()
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: `Você não tem permissão para remover essa anotação!`,
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: `Ocorreu um erro ao remover a anotação! Tente novamente mais tarde.`,
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