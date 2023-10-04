// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useMutation } from '@tanstack/react-query'

// Api
import api from '../../../../../infra/api'

// Components
import { Text, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'
import { Space } from '../../../../components'
import { BaseContent } from '../../../../layouts'

// Styled components
const CodeInputContainer = styled(View)`
  padding: 16px;
  border-radius: 8px;
  ${color}
`

// Main page
const InsertCodeScreen = (): React.ReactElement => {
  // Hooks
  const theme = useTheme()

  // Http requests
  const { isLoading, mutateAsync: verifyAccount } = useMutation(
    (data: string) => api.accounts.verifyAccount(data)
  )

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        Validar E-mail
      </Text>
      <Space my={1} />
      <Text category="s1">
        Insira o código que voce recebeu em seu E-mail para finalizar a validação de sua conta.
      </Text>
      <Space my={2} />
      <CodeInputContainer
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <Text>Insert code</Text>
      </CodeInputContainer>
    </BaseContent>
  )
}

export default InsertCodeScreen