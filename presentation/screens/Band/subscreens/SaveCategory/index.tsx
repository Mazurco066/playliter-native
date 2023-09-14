// Dependencies
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useMutation } from '@tanstack/react-query'

// Api
import api from '../../../../../infra/api'

// Types
import { MainStackParamList } from '../../../../../main/router'

// Components
import { showMessage } from 'react-native-flash-message'
import { EditCategory, ViewCategory } from './elements'
import { BaseContent, ConfirmDialog } from '../../../../layouts'

// Save Category Subscreen
const SaveCategory = ({ route }): React.ReactElement => {
  // Destruct params
  const { bandId, item } = route.params

  // Hooks
  const { goBack } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ isEditable, setEditableState ] = useState<boolean>(false)
  const [ isConfirmDialogOpen, setConfirmDialogState ] = useState<boolean>(false)

  // Http requests
  const { isLoading: isRemovingCategory, mutateAsync: removeCategoryRequest } = useMutation(
    (id: string) => api.songs.removeCategory(id)
  )

   // Loading state
   const isLoading = isRemovingCategory

   // Actions
  const removeCategory = async () => {
    const id = item.id
    const response = await removeCategoryRequest(id)
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: `A categoria foi removida da banda com sucesso!`,
        type: 'success',
        duration: 2000
      })
      goBack()
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: `Você não tem permissão para remover essa categoria!`,
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: `Ocorreu um erro ao remover a categoria! Tente novamente mais tarde.`,
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
          <ViewCategory
            item={item}
            onEdit={() => setEditableState(true)}
            onGoBack={() => goBack()}
            onRemove={() => setConfirmDialogState(true)}
            isLoading={isLoading}
          />
        ) : (
          <EditCategory
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
        onConfirm={removeCategory}
      />
    </BaseContent>
  )
}

export default SaveCategory