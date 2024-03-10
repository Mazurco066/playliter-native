// Dependencies
import mime from 'mime'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useMutation } from '@tanstack/react-query'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { color } from 'styled-system'
import { generateCaption } from '../../../../utils'

// Api
import api from '../../../../../infra/api'

// Types
import { UpdateAccountDTO } from '../../../../../domain/dto'

// Store
import { useAuthStore } from '../../../../../main/store'

// Components
import { Button, Icon, Input, Text, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
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

// Page Main JSX
const SaveProfileScreen = ({ navigation }) => {
  // Hooks
  const theme = useTheme()
  const { getUserData, hydrateAuthData } = useAuthStore()
  const currentAccount = getUserData()
  const [ imageUri, setImageUri ] = useState<string>(currentAccount.avatar)
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  // Http requests
  const reqSaveAccount = useMutation(
    (data: { id: string, dto: UpdateAccountDTO }) =>
      api.accounts.updateAccount(data.id, data.dto)
  )
  const reqUploadImage = useMutation(
    (data: FormData) => api.helpers.uploadImage(data)
  )

  // Effects
  useEffect(() => {    
    if (currentAccount) {
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('name', currentAccount.name, options)
      setValue('email', currentAccount.email, options)
      setValue('avatar', currentAccount.avatar, options)
    } 
  }, [currentAccount])

  // Actions
  const submitProfile = async (data: {
    name: string,
    email: string,
    avatar: string
  }) => {
    // Destruct data
    const { avatar, email, name } = data
    let avatarUri = avatar
    let uploadError = false

    // 1. Upload avatar section
    if (!currentAccount || (currentAccount && currentAccount.avatar !== avatar)) {
      const imageData = new FormData()
      const fileContent: any = {
        uri: avatarUri,
        type: mime.getType(avatarUri),
        name: avatarUri.split('/').pop()
      }
      imageData.append('file', fileContent)
      const response = await reqUploadImage.mutateAsync(imageData)

      // Verify upload response
      if ([200, 201].includes(response.status)) {
        avatarUri = response.data.data.uri
      } else {
        uploadError = true
      }
    }

    // 2. Update account section
    const response = await reqSaveAccount.mutateAsync({
      id: currentAccount.id,
      dto: { name, email, avatar: avatarUri }
    })
    if ([200, 201].includes(response.status)) {
      hydrateAuthData(response.data.data)
      showMessage({
        message: uploadError ? t('success_msgs.save_profile_without_avatar_msg') : t('success_msgs.save_profile_msg'),
        type: uploadError ? 'info' : 'success',
        duration: 2000
      })
      navigation.goBack()
    } else if ([400].includes(response.status)) {
      showMessage({
        message: t('error_msgs.invalid_form_msg'),
        type: 'warning',
        duration: 2000
      })
    } else if ([404].includes(response.status)) {
      showMessage({
        message: t('error_msgs.account_not_found_msg'),
        type: 'info',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.save_profile_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        {t('profile.save_profile_heading')}
      </Text>
      <Space my={1} />
      <Text category="s1">
        {t('profile.save_profile_placeholder')}
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
            isLoading={reqSaveAccount.isLoading || reqUploadImage.isLoading}
            onImageSelect={result => {
              setImageUri(result.assets[0].uri)
              setValue('avatar', result.assets[0].uri, {
                shouldValidate: false,
                shouldDirty: true
              })
            }}
          />
          <Space my={2} />
          <Controller
            control={control}
            name="name"
            rules={{ required: true, minLength: 2 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                label={t('profile.name_label')}
                placeholder={t('profile.name_placeholder')}
                keyboardType="default"
                accessoryLeft={props => <Icon {...props} name="person-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.name as FieldError)}
                textStyle={textStyle}
                disabled={reqSaveAccount.isLoading || reqUploadImage.isLoading}
              />
            )}
            defaultValue=""
          />
          <Space my={2} />
          <Controller
            control={control}
            name="email"
            rules={{ required: true, minLength: 2 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                multiline
                label={t('profile.email_label')}
                placeholder={t('profile.email_placeholder')}
                keyboardType="email-address"
                accessoryLeft={props => <Icon {...props} name="email-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.email as FieldError)}
                textStyle={textStyle}
                disabled={reqSaveAccount.isLoading || reqUploadImage.isLoading}
              />
            )}
            defaultValue=""
          />
          <Space my={2} />
          <Button
            disabled={reqSaveAccount.isLoading || reqUploadImage.isLoading}
            onPress={handleSubmit(submitProfile)}
            style={{ width: '100%' }}
          >
            {t('profile.save_button')}
          </Button>
        </CustomKeyboardAvoidingView>
      </Container>
    </BaseContent>
  )
}

// Exporting page
export default SaveProfileScreen
