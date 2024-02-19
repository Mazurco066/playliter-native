// Dependencies
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, FieldError, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { color } from 'styled-system'

// Http client
import api from '../../../../../../infra/api'
import { useMutation } from '@tanstack/react-query'

// Types
import { IObservationType } from '../../../../../../domain'

// Components
import { showMessage } from 'react-native-flash-message'
import { Button, Icon, Input, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'
import { CustomKeyboardAvoidingView, Space } from '../../../../../components'
import { generateCaption } from '../../../../../utils'
import { useConcertStore } from '../../../../../../main/store'

// Styled components
const Container = styled(View)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;
  ${color}
`

const ButtonGroup = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
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

type IEditNote = {
  isLoading?: boolean,
  item?: IObservationType,
  onCancel?: () => void,
  onGoBack?: () => void
}

// Main component
const EditNote = ({
  isLoading = false,
  item,
  onCancel = () => {},
  onGoBack = () => {},
}: IEditNote): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const { concert } = useConcertStore()
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  // Effects
  useEffect(() => {
    if (item) {
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', item.title, options)
      setValue('content', item.data, options)
    }
  }, [item])

  // Http requests
  const { isLoading: isSavingNote, mutateAsync: saveNoteRequest } = useMutation(
    (data: { id?: string, title: string, data: string, concertId: string }) =>
      data.id
        ? api.concerts.updateConcertObservation(data.concertId, data.id, data.title, data.data)
        : api.concerts.addConcertObservation(data.concertId, data.title, data.data)
  )

  // Actions
  const submitNote = async ({ title, content }: { title: string, content: string }) => {
    const id = item?.id || null
    const response = await saveNoteRequest({
      id,
      title: title,
      data: content,
      concertId: concert.id
    })
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.remove_note_msg'),
        type: 'success',
        duration: 2000
      })
      onGoBack()
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: t('error_msgs.remove_note_denied_msg'),
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.remove_note_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  // TSX
  return (
    <Container
      style={{
        backgroundColor: theme['color-basic-700']
      }}
    >
      <CustomKeyboardAvoidingView
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Controller
          control={control}
          name="title"
          rules={{ required: true, minLength: 2 }}
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              label={t('concert_screen.title_label')}
              placeholder={t('concert_screen.title_placeholder')}
              keyboardType="default"
              accessoryLeft={props => <Icon {...props} name="bookmark-outline" />}
              value={value}
              onBlur={onBlur}
              onChangeText={nextValue => onChange(nextValue)}
              caption={generateCaption(errors.title as FieldError)}
              textStyle={textStyle}
              disabled={isLoading || isSavingNote}
            />
          )}
          defaultValue=""
        />
        <Space my={2} />
        <Controller
          control={control}
          name="content"
          rules={{ required: true, minLength: 8 }}
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              multiline
              label={t('concert_screen.content_label')}
              placeholder={t('concert_screen.content_placeholder')}
              keyboardType="default"
              accessoryLeft={props => <Icon {...props} name="book-open-outline" />}
              value={value}
              onBlur={onBlur}
              onChangeText={nextValue => onChange(nextValue)}
              caption={generateCaption(errors.content as FieldError)}
              textStyle={textStyle}
              disabled={isLoading || isSavingNote}
            />
          )}
          defaultValue=""
        />
        <Space my={2} />
        <ButtonGroup>
          <Button
            status="danger"
            onPress={item ? onCancel : onGoBack}
            style={{ flex: 1 }}
            disabled={isLoading || isSavingNote}
          >
            {t('concert_screen.cancel_action')}
          </Button>
          <Button
            style={{ flex: 1 }}
            onPress={handleSubmit(submitNote)}
            disabled={isLoading || isSavingNote}
          >
            {t('concert_screen.save_action')}
          </Button>
        </ButtonGroup>
      </CustomKeyboardAvoidingView>
    </Container>
  )
}

export default EditNote