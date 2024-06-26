// Dependencies
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useAuthStore } from '../../../main/store'
import { generateCaption } from '../../utils'

// Main API
import { api } from '../../../infra'

// Components
import { showMessage } from 'react-native-flash-message'
import {
  Button,
  Icon,
  Input,
  Layout,
  Text,
  useTheme
} from '@ui-kitten/components'
import {
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import {
  CustomKeyboardAvoidingView,
  Space
} from '../../components'

// Types
import { UserAccount } from '../../../domain'

// Styled components
const Wrapper = styled(Layout)`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  ${color}
`

const Logo = styled(Image)`
  width: 150px;
  height: 150px;
  margin-bottom: 16px;
`

const Form = styled(View)`
  flex: 0 0 auto;
  padding: 16px;
  border-radius: 8px;
  width: 100%;
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

// Page Main TSX
const AuthScreen = ({ navigation }): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const [ secureTextEntry, setSecureTextEntry ] = useState<boolean>(true)
  const { control, handleSubmit, formState: { errors } } = useForm()
  const { hydrateAuthData } = useAuthStore()
  const { t } = useTranslation()

  // Mutations
  const reqLogin = useMutation(
    (data: { username: string, password: string }) => {
      return api.auth.login({
        username: data.username,
        password: data.password
      })
    }
  )

  // Actions
  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry)
  }

  const submitLogin = async (data: { username: string, password: string }) => {
    const response = await reqLogin.mutateAsync({
      username: data.username,
      password: data.password
    })
    if ([200, 201].includes(response.status)) {
      const { data: { account, token } } = response.data
      hydrateAuthData(account as UserAccount, token)
      showMessage({
        message: t('auth.welcome', { name: account.name }),
        type: 'success',
        duration: 2000
      })
      navigation.replace('Main')
    } else {
      showMessage({
        message: t('error_msgs.incorrect_user'),
        type: 'danger',
        duration: 2500
      })
    }
  }

  // Auxiliar Render functions
  const renderPasswordIcon = (props: any): React.ReactElement => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={secureTextEntry ? 'eye-off' : 'eye'}
      />
    </TouchableWithoutFeedback>
  )

  // TSX
  return (
    <Wrapper
      level="1"
    >
      <ScrollView
        centerContent
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          width: 320
        }}
        keyboardShouldPersistTaps="handled"
      >
        <CustomKeyboardAvoidingView
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Logo
            source={require('../../../assets/logo_white.png')}
          />
          <Form
            style={{ backgroundColor: theme['color-basic-700'] }}
          >
            <Controller
              control={control}
              name="username"
              rules={{ required: true, minLength: 2 }}
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  label={t('auth.username_label')}
                  placeholder={t('auth.username_placeholder')}
                  keyboardType="ascii-capable"
                  accessoryLeft={props => <Icon {...props} name="person-outline" />}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={nextValue => onChange(nextValue)}
                  caption={generateCaption(errors.username as FieldError)}
                  textStyle={textStyle}
                  disabled={reqLogin.isLoading}
                />
              )}
              defaultValue=""
            />
            <Space my={2} />
            <Controller
              control={control}
              name="password"
              rules={{ required: true, minLength: 8 }}
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  label={t('auth.password_label')}
                  placeholder="••••••••"
                  keyboardType="ascii-capable"
                  secureTextEntry={secureTextEntry}
                  accessoryLeft={props => <Icon {...props} name="lock-outline" />}
                  accessoryRight={renderPasswordIcon}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={nextValue => onChange(nextValue)}
                  caption={generateCaption(errors.password as FieldError)}
                  textStyle={textStyle}
                  disabled={reqLogin.isLoading}
                />
              )}
              defaultValue=""
            />
            <Space my={1} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ForgotPassword")
              }}
            >
              <Text
                style={{ textAlign: 'center', fontWeight: '700' }}
                status="primary"
                category="s1"
              >
                {t('auth.forgot_password_link')}
              </Text>
            </TouchableOpacity>
            <Space my={2} />
            <Button
              disabled={reqLogin.isLoading}
              onPress={handleSubmit(submitLogin)}
            >
              {t('auth.login_action')}
            </Button>
            <Space my={1} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignUp")
              }}
            >
              <Text
                style={{ textAlign: 'center' }}
                category='s2'
              >
                {t('auth.has_no_account')}<Text
                  style={{ fontWeight: '700' }}
                  status="primary"
                  category="s2"
                >
                  {t('auth.create_now')}
                </Text>
              </Text>
            </TouchableOpacity>
          </Form>
        </CustomKeyboardAvoidingView>
      </ScrollView>
    </Wrapper>
  )
}

// Exporting page
export default AuthScreen
