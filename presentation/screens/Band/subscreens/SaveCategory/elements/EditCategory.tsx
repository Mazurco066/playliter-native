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
import { ISongCategory } from '../../../../../../domain'

// Components
import { showMessage } from 'react-native-flash-message'
import { Button, Icon, Input, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'
import { CustomKeyboardAvoidingView, Space } from '../../../../../components'
import { generateCaption } from '../../../../../utils'
import { useBandStore } from '../../../../../../main/store'

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

type IEditCategory = {
  isLoading?: boolean,
  item?: ISongCategory,
  onCancel?: () => void,
  onGoBack?: () => void
}

// Main component
const EditCategory = ({
  isLoading = false,
  item,
  onCancel = () => {},
  onGoBack = () => {},
}: IEditCategory): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const { band } = useBandStore()
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
      setValue('description', item.description, options)
    }
  }, [item])

  // Http requests
  const { isLoading: isSavingCategory, mutateAsync: saveCategoryRequest } = useMutation(
    (data: { id?: string, title: string, description: string, bandId: string }) =>
      data.id
        ? api.songs.updateCategory(data.id, data.title, data.description)
        : api.songs.addCategory(data.bandId, data.title, data.description)
  )

  // Actions
  const submitCategory = async ({ title, description }: { title: string, description: string }) => {
    const id = item?.id || null
    const response = await saveCategoryRequest({
      id,
      title: title,
      description: description,
      bandId: band.id
    })
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.save_category_msg'),
        type: 'success',
        duration: 2000
      })
      onGoBack()
    } else if ([401, 403].includes(response.status)) {
      showMessage({
        message: t('error_msgs.save_category_denied_msg'),
        type: 'warning',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.save_category_error_msg'),
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
              label={t('band_screen.input_category_title_label')}
              placeholder={t('band_screen.input_category_title_placeholder')}
              keyboardType="default"
              accessoryLeft={props => <Icon {...props} name="bookmark-outline" />}
              value={value}
              onBlur={onBlur}
              onChangeText={nextValue => onChange(nextValue)}
              caption={generateCaption(errors.title as FieldError)}
              textStyle={textStyle}
              disabled={isLoading || isSavingCategory}
            />
          )}
          defaultValue=""
        />
        <Space my={2} />
        <Controller
          control={control}
          name="description"
          rules={{ required: true, minLength: 8 }}
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              multiline
              label={t('band_screen.input_category_desc_label')}
              placeholder={t('band_screen.input_category_desc_placeholder')}
              keyboardType="default"
              accessoryLeft={props => <Icon {...props} name="book-open-outline" />}
              value={value}
              onBlur={onBlur}
              onChangeText={nextValue => onChange(nextValue)}
              caption={generateCaption(errors.content as FieldError)}
              textStyle={textStyle}
              disabled={isLoading || isSavingCategory}
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
            disabled={isLoading || isSavingCategory}
          >
            {t('band_screen.cancel_button')}
          </Button>
          <Button
            style={{ flex: 1 }}
            onPress={handleSubmit(submitCategory)}
            disabled={isLoading || isSavingCategory}
          >
            {t('band_screen.save_button')}
          </Button>
        </ButtonGroup>
      </CustomKeyboardAvoidingView>
    </Container>
  )
}

export default EditCategory