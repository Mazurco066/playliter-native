// Dependencies
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useMutation } from '@tanstack/react-query'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

// Http client
import api from '../../../../../infra/api'

// Types
import { SaveConcertDto } from '../../../../../domain'
import { MainStackParamList } from '../../../../../main/router'

// Components
import { Button, Datepicker, Icon, Input, Text, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { generateCaption } from '../../../../utils'
import { CustomKeyboardAvoidingView, Space } from '../../../../components'
import { BaseContent } from '../../../../layouts'

// Styled components
const Container = styled(View)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;
  margin-bottom: 32px;
  ${color}
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

// Save subscreen
const SaveConcert = ({ route }): React.ReactElement => {
  // Destruct params
  const { bandId, item } = route.params

  // Hooks
  const theme = useTheme()
  const { goBack } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  // Http requests
  const { isLoading, mutateAsync: saveConcertRequest } = useMutation(
    (data: { id?: string, dto: SaveConcertDto }) =>
      data.id
        ? api.concerts.updateConcert(data.id, data.dto)
        : api.concerts.createConcert(data.dto)
  )

  // Effects
  useEffect(() => {    
    if (item) {
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', item.title, options)
      setValue('description', item.description, options)
      setValue('date', new Date(item.date.split('T')[0]), options)
    } else {
      const options = { shouldValidate: false, shouldDirty: true }
      setValue('title', '', options)
      setValue('description', '', options)
      setValue('date', new Date(), options)
    }
  }, [item])

  // Actions
  const submitConcert = async (data: {
    title: string,
    description: string,
    date: Date
  }) => {
    const response = await saveConcertRequest({
      id: (item && item.id) ? item.id : null,
      dto: {
        band: bandId,
        title: data.title,
        description: data.description,
        date: data.date.toISOString().split('T')[0]
      }
    })
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.save_concert_msg'),
        type: 'success',
        duration: 2000
      })
      goBack()
    } else if ([400].includes(response.status)) {
      showMessage({
        message: t('error_msgs.invalid_form_msg'),
        type: 'warning',
        duration: 2000
      })
    } else if ([404].includes(response.status)) {
      showMessage({
        message: t('error_msgs.concert_not_found_msg'),
        type: 'info',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.save_concert_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        {t('concert_screen.save_concert_heading')}
      </Text>
      <Space my={1} />
      <Text category="s1">
        {
          item
            ? t('concert_screen.update_concert_placeholder')
            : t('concert_screen.new_concert_placeholder')
        }
      </Text>
      <Space my={2} />
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
            name="date"
            rules={{ required: true, minLength: 2 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Datepicker
                label={t('concert_screen.date_label')}
                placeholder="yyyy-mm-dd"
                date={value}
                onBlur={onBlur}
                onSelect={nextDate => onChange(nextDate)}
                caption={generateCaption(errors.date as FieldError)}
                style={{ width: '100%' }}
                accessoryLeft={props => <Icon {...props} name="calendar-outline" />}
                disabled={isLoading}
              />
            )}
            defaultValue=""
          />
          <Space my={2} />
          <Controller
            control={control}
            name="title"
            rules={{ required: true, minLength: 2 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                label={t('concert_screen.title_label')}
                placeholder={t('concert_screen.title_placeholder')}
                keyboardType="default"
                accessoryLeft={props => <Icon {...props} name="book-open-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.title as FieldError)}
                textStyle={textStyle}
                disabled={isLoading}
              />
            )}
            defaultValue=""
          />
          <Space my={2} />
          <Controller
            control={control}
            name="description"
            rules={{ required: true, minLength: 2 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                multiline
                label={t('concert_screen.description_label')}
                placeholder={t('concert_screen.description_placeholder')}
                keyboardType="default"
                accessoryLeft={props => <Icon {...props} name="menu-2-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.description as FieldError)}
                textStyle={textStyle}
                disabled={isLoading}
              />
            )}
            defaultValue=""
          />
          <Space my={2} />
          <Button
            disabled={isLoading}
            onPress={handleSubmit(submitConcert)}
            style={{ width: '100%' }}
          >
            {t('concert_screen.save_action')}
          </Button>
        </CustomKeyboardAvoidingView>
      </Container>
    </BaseContent>
  )
}

export default SaveConcert