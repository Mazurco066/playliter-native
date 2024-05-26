// Dependencies
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useMutation } from '@tanstack/react-query'

// Api
import api from '../../../../../infra/api'

// Components
import { Button, Icon, Text, useTheme } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { Space } from '../../../../components'
import { BaseContent } from '../../../../layouts'

// Styled components
const CodeInputContainer = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 16px;
  ${color}
`

const CodeInputInnerContainer = styled(View)`
  width: 80%;
`

// Code input styles
const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    borderRadius: 8
  },
  focusCell: {
    borderColor: '#000',
  },
})

// Consts
const CELL_COUNT = 4

// Main page
const InsertCodeScreen = ({ navigation }): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const [ value, setValue ] = useState<string>('')
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT})
  const [ props, getCellOnLayoutHandler ] = useClearByFocusCell({ value, setValue })
  const { t } = useTranslation()

  // Http requests
  const reqVerifyAccount = useMutation(
    (data: string) => api.accounts.verifyAccount(data)
  )
  const reqSendEmail = useMutation(
    () => api.accounts.resendValidationEmail()
  )

  // Effects
  useEffect(() => {
    const persistCode = async (code: string) => {
      const r = await reqVerifyAccount.mutateAsync(code)
      if ([200, 201].includes(r.status)) {
        showMessage({
          message: t('success_msgs.email_validation_msg'),
          duration: 2000,
          type: 'success'
        })
        navigation.goBack()
      } else if ([400, 404].includes(r.status)) {
        showMessage({
          message: t('error_msgs.email_validation_invalid_msg'),
          duration: 2000,
          type: 'warning'
        })
        setValue('')
      } else {
        showMessage({
          message: t('error_msgs.email_validation_error_msg'),
          duration: 2000,
          type: 'danger'
        })
      }
    }
    if (value.length === 4) {
      persistCode(value)
    }
  }, [
    value,
    reqVerifyAccount.mutateAsync,
    setValue
  ])

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        {t('profile.validate_mail_heading')}
      </Text>
      <Space my={1} />
      <Text category="s1">
        {t('profile.validate_mail_placeholder')}
      </Text>
      <Space my={2} />
      <CodeInputContainer
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <Icon
          name="lock-outline"
          fill={theme['color-secondary-500']}
          style={{
            width: 48,
            height: 48
          }}
        />
        <Space my={1} />
        <Text
          category="s1"
          style={{ textAlign: 'center' }}
        >
          {t('profile.validate_mail_label')}
        </Text>
        <Space my={2} />
        <CodeInputInnerContainer>
          <CodeField
            ref={ref}
            {...props}
            editable={!reqVerifyAccount.isLoading}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && { borderColor: theme['color-secondary-500'] }]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </CodeInputInnerContainer>
      </CodeInputContainer>
      <Space my={2} />
      <Button
        size="small"
        disabled={reqSendEmail.isLoading || reqVerifyAccount.isLoading}
        onPress={() => reqSendEmail.mutateAsync()}
      >
        {t('profile.resend_email')}     
      </Button>
      <Space my={2} />
    </BaseContent>
  )
}

export default InsertCodeScreen
