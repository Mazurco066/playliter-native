// Dependencies
import React, { useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { color } from 'styled-system'
import { generateCaption } from '../../utils'

// Components
import { TouchableWithoutFeedback } from 'react-native'
import {
  Button,
  Icon,
  Input,
  Layout,
  Text,
} from '@ui-kitten/components'

// Styled components
const Wrapper = styled(Layout)`
  flex: 1;
  justify-content: center;
  align-items: center;
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
const AuthScreen = () => {
  // Hooks
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true)
  const { control, handleSubmit, formState: { errors } } = useForm()

  // Actions
  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry)
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
    <Wrapper>
      <Text category='h1'>Login</Text>
      <Controller
        control={control}
        name="username"
        rules={{ required: true, minLength: 2 }}
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            label="Usuário"
            placeholder="Insira seu usuário"
            keyboardType="ascii-capable"
            accessoryLeft={props => <Icon {...props} name="person-outline" />}
            value={value}
            onBlur={onBlur}
            onChangeText={nextValue => onChange(nextValue)}
            caption={generateCaption(errors.username as FieldError)}
            textStyle={textStyle}
            style={{ marginBottom: 8 }}
          />
        )}
        defaultValue=""
      />
      <Controller
        control={control}
        name="password"
        rules={{ required: true, minLength: 8 }}
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            label="Senha"
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
            style={{ marginBottom: 16 }}
          />
        )}
        defaultValue=""
      />
      <Button onPress={handleSubmit(
        (data) => {
          console.log('[form submit]', data)
        }
      )}>
        Acessar
      </Button>
    </Wrapper>
  )
}

// Exporting page
export default AuthScreen