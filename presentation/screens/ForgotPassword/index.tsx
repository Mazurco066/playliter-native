// Dependencies
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import styled from 'styled-components'
import { color } from 'styled-system'
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
  TouchableOpacity
} from 'react-native'
import {
  CustomKeyboardAvoidingView,
  Space
} from '../../components'

// Styled components
const Wrapper = styled(Layout)`
  flex: 1;
  justify-content: center;
  align-items: center;
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
const ForgotPasswordScreen = ({ navigation }): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const { control, handleSubmit, formState: { errors } } = useForm()
  const { t } = useTranslation()

  // Mutations
  const reqForgotPassword = useMutation(
    (email: string) => {
      return api.auth.forgotPassword(email)
    }
  )

  // Actions
  const submitPasswordRecovery = async (data: { email: string }) => {
    const response = await reqForgotPassword.mutateAsync(data.email)
    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.confirmation_mail_msg'),
        type: 'success',
        duration: 2500
      })
      navigation.goBack()
    } else if ([400, 404].includes(response.status)) {
      showMessage({
        message: t('error_msgs.email_already_taken_msg'),
        type: 'info',
        duration: 2500
      })
    } else {
      showMessage({
        message: t('error_msgs.email_send_error_msg'),
        type: 'danger',
        duration: 2500
      })
    }
  }

  // TSX
  return (
    <Wrapper level="1">
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
          <Logo source={require('../../../assets/logo_white.png')} />
          <Form style={{ backgroundColor: theme['color-basic-700'] }}>
            <Text category="h6">
              {t('auth.password_redefinition_label')}
            </Text>
            <Text category="c1">
              {t('auth.password_redefinition_description')}
            </Text>
            <Space my={1} />
            <Controller
              control={control}
              name="email"
              rules={{ required: true, minLength: 7 }}
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  label={t('auth.email_label')}
                  placeholder={t('auth.email_placeholder')}
                  keyboardType="email-address"
                  accessoryLeft={props => <Icon {...props} name="email-outline" />}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={nextValue => onChange(nextValue)}
                  caption={generateCaption(errors.username as FieldError)}
                  textStyle={textStyle}
                  disabled={reqForgotPassword.isLoading}
                />
              )}
              defaultValue=""
            />
            <Space my={2} />
            <Button
              disabled={reqForgotPassword.isLoading}
              onPress={handleSubmit(submitPasswordRecovery)}
            >
              {t('auth.send_email_action')}
            </Button>
            <Space my={1} />
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Text
                style={{ textAlign: 'center' }}
                category='s2'
              >
                {t('auth.remember_password')}<Text
                  style={{ fontWeight: '700' }}
                  status="primary"
                  category="s2"
                >
                  {t('auth.login_now')}
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
export default ForgotPasswordScreen
