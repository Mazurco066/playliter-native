// Dependencies
import mime from 'mime'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { color } from 'styled-system'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

// Http client
import api from '../../../../../infra/api'

// Types
import { SaveBandDto } from '../../../../../domain/dto'
import { MainStackParamList } from '../../../../../main/router'

// Components
import { Button, Icon, Input, Text, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { generateCaption } from '../../../../utils'
import { CustomKeyboardAvoidingView, PhoneImagePicker, Space } from '../../../../components'
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

// CONSTS
const DEFAULT_IMG = 'https://res.cloudinary.com/r4kta/image/upload/v1663515679/playliter/logo/default_band_mklz55.png'

// Main page
const SaveBandScreen = ({ route }) : React.ReactElement => {
  // Destruct params
  const { item } = route.params

  // Hooks
  const theme = useTheme()
  const { goBack } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ imageUri, setImageUri ] = useState<string>(DEFAULT_IMG)
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  // Http requests
  const reqSaveBand= useMutation(
    (data: { id?: string, dto: SaveBandDto }) =>
      data.id
        ? api.bands.updateBand(data.id, data.dto)
        : api.bands.createBand(data.dto)
  )
  
  const reqUploadImage = useMutation(
    (data: FormData) => api.helpers.uploadImage(data)
  )

  // Effects
  useEffect(() => {    
    if (item) {
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', item.title, options)
      setValue('description', item.description, options)
      setValue('logo', item.logo, options)
      setImageUri(item.logo)
    } else {
      const options = { shouldValidate: false, shouldDirty: true }
      setValue('title', '', options)
      setValue('description', '', options)
      setValue('logo', DEFAULT_IMG, options)
      setImageUri(DEFAULT_IMG)
    }
  }, [item])

  // Actions
  const submitBand = async (data: {
    title: string,
    description: string,
    logo: string
  }) => {
    // Destruct data
    const { description, logo, title } = data
    let logoUri = logo
    let uploadError = false

    // 1. Upload logo section
    if (!item || (item && item.logo !== logo)) {
      const imageData = new FormData()
      const fileContent: any = {
        uri: logoUri,
        type: mime.getType(logoUri),
        name: logoUri.split('/').pop()
      }
      imageData.append('file', fileContent)
      const response = await reqUploadImage.mutateAsync(imageData)

      // Verify upload response
      if ([200, 201].includes(response.status)) {
        logoUri = response.data.data.uri
      } else {
        uploadError = true
      }
    }

    // 2. Update band section
    const response = await reqSaveBand.mutateAsync({
      id: (item && item.id) ? item.id : null,
      dto: { title, description, logo: logoUri }
    })
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: uploadError ? t('success_msgs.save_band_without_logo_msg') : t('success_msgs.save_band_msg'),
        type: uploadError ? 'info' : 'success',
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
        message: t('error_msgs.band_not_found_msg'),
        type: 'info',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.save_band_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        {t('band_screen.save_band_title')}
      </Text>
      <Space my={1} />
      <Text category="s1">
        {
          item
            ? t('band_screen.update_band_heading')
            : t('band_screen.save_band_heading')
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
          <PhoneImagePicker
            uri={imageUri}
            isLoading={reqSaveBand.isLoading || reqUploadImage.isLoading}
            onImageSelect={result => {
              setImageUri(result.assets[0].uri)
              setValue('logo', result.assets[0].uri, {
                shouldValidate: false,
                shouldDirty: true
              })
            }}
          />
          <Space my={2} />
          <Controller
            control={control}
            name="title"
            rules={{ required: true, minLength: 2 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                label={t('band_screen.input_band_title_label')}
                placeholder={t('band_screen.input_band_title_placeholder')}
                keyboardType="default"
                accessoryLeft={props => <Icon {...props} name="book-open-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.title as FieldError)}
                textStyle={textStyle}
                disabled={reqSaveBand.isLoading || reqUploadImage.isLoading}
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
                label={t('band_screen.input_band_desc_label')}
                placeholder={t('band_screen.input_band_desc_placeholder')}
                keyboardType="default"
                accessoryLeft={props => <Icon {...props} name="menu-2-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.description as FieldError)}
                textStyle={textStyle}
                disabled={reqSaveBand.isLoading || reqUploadImage.isLoading}
              />
            )}
            defaultValue=""
          />
          <Space my={2} />
          <Button
            disabled={reqSaveBand.isLoading || reqUploadImage.isLoading}
            onPress={handleSubmit(submitBand)}
            style={{ width: '100%' }}
          >
            {t('band_screen.save_button')}
          </Button>
        </CustomKeyboardAvoidingView>
      </Container>
    </BaseContent>
  )
}

export default SaveBandScreen
