// Dependencies
import mime from 'mime'
import React, { useEffect, useState } from 'react'
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
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  // Http requests
  const { isLoading, mutateAsync: saveAccountRequest } = useMutation(
    (data: { id: string, dto: UpdateAccountDTO }) =>
      api.accounts.updateAccount(data.id, data.dto)
  )
  const { isLoading: isUploadingImage, mutateAsync: cloudinaryUpload } = useMutation(
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
      const response = await cloudinaryUpload(imageData)

      // Verify upload response
      if ([200, 201].includes(response.status)) {
        avatarUri = response.data.data.uri
      } else {
        uploadError = true
      }
    }

    // 2. Update account section
    const response = await saveAccountRequest({
      id: currentAccount.id,
      dto: { name, email, avatar: avatarUri }
    })
    if ([200, 201].includes(response.status)) {
      hydrateAuthData(response.data.data)
      showMessage({
        message: uploadError ? 'Sua conta foi atualizada com sucesso porem ocorreu um erro ao fazer o upload  de seu avatar.' : 'Sua conta foi atualizada com sucesso.',
        type: uploadError ? 'info' : 'success',
        duration: 2000
      })
      navigation.goBack()
    } else if ([400].includes(response.status)) {
      showMessage({
        message: 'Há dados invalidos no preenchimento de seu formulário. Por favor verifique o preenchimento do mesmo.',
        type: 'warning',
        duration: 2000
      })
    } else if ([404].includes(response.status)) {
      showMessage({
        message: `Conta de id ${currentAccount.id} não encontrada!`,
        type: 'info',
        duration: 2000
      })
    } else {
      showMessage({
        message: `Ocorreu um erro ao atualizar sua conta! Tente novamente mais tarde.`,
        type: 'danger',
        duration: 2000
      })
    }
  }

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        Atualizar perfil
      </Text>
      <Space my={1} />
      <Text category="s1">
        Atualize os dados de seu perfil no app.
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
            isLoading={isLoading || isUploadingImage}
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
                label="Nome"
                placeholder="Insira seu nome"
                keyboardType="default"
                accessoryLeft={props => <Icon {...props} name="person-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.name as FieldError)}
                textStyle={textStyle}
                disabled={isLoading || isUploadingImage}
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
                label="E-mail"
                placeholder="Insira seu E-mail"
                keyboardType="email-address"
                accessoryLeft={props => <Icon {...props} name="email-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.email as FieldError)}
                textStyle={textStyle}
                disabled={isLoading || isUploadingImage}
              />
            )}
            defaultValue=""
          />
          <Space my={2} />
          <Button
            disabled={isLoading || isUploadingImage}
            onPress={handleSubmit(submitProfile)}
            style={{ width: '100%' }}
          >
            Salvar
          </Button>
        </CustomKeyboardAvoidingView>
      </Container>
    </BaseContent>
  )
}

// Exporting page
export default SaveProfileScreen