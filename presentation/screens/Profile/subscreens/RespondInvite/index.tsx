// React
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useMutation } from '@tanstack/react-query'
import { getIcon } from '../../../../utils'

// API
import api from '../../../../../infra/api'

// Types
import { RespondInviteDto } from '../../../../../domain/dto'
import { IBandInvitation } from '../../../../../domain/models'

// Compoents
import { Avatar, Button, Text, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Space } from '../../../../components'
import { BaseContent } from '../../../../layouts'

// Styled components
const InviteContainer = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  ${color}
`

// Main page
const RespondInviteScreen = ({ route, navigation }): React.ReactElement => {
  // Destruct params
  const { item } = route.params

  // Hooks
  const theme = useTheme()
  const [ currentInvite, setCurrentInvite ] = useState<IBandInvitation>(item)

  // Http requests
  const { isLoading, mutateAsync: respondInvite } = useMutation(
    (data: RespondInviteDto) => api.bands.respondInvitation(data)
  )

  // Effects
  useEffect(() => {
    setCurrentInvite(item)
  }, [item])

  // Actions
  const respondInviteAction = async (response: 'accepted' | 'denied') => {
    const inviteId = currentInvite.id
    const requestBody = { inviteId, response }
    const apiResponse = await respondInvite(requestBody)
    if ([200, 201].includes(apiResponse.status)) {
      navigation.goBack()
      showMessage({
        message: response === 'accepted'
          ? 'O convite foi aceito com sucesso!'
          : 'O convite foi recusado com sucesso!',
        type: 'success',
        duration: 2000
      })
    } else {
      showMessage({
        message: 'Ocorreu um erro ao responder o convite! Por favor tente novamente mais tarde.',
        type: 'danger',
        duration: 2000
      })
    }
  }

  // TSX
  return (
    <BaseContent
			hideCardsNavigation
		>
      <Text category="h5">
        Responder convite
      </Text>
      <Space my={1} />
      <Text
        category="s1"
        style={{
          textAlign: "justify"
        }}
      >
        Voce foi convidado a se juntar a uma banda. Visualize os detalhes da banda abaixo e decida se irá aceitar ou recusar.
      </Text>
      <Space my={2} />
      <InviteContainer
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <Avatar
          size="giant"
          source={{
            uri: currentInvite.band.logo
          }}
        />
        <Space my={1} />
        <Text
          category="label"
          style={{
            fontSize: 16,
            textAlign: "center"
          }}
        >
          {currentInvite.band.title}
        </Text>
        <Space my={1} />
        <Text
          category="c1"
          style={{
            fontSize: 14,
            textAlign: "center"
          }}
        >
          {currentInvite.band.description}
        </Text>
      </InviteContainer>
      <Space my={2} />
      <Button
        status="success"
        size="small"
        accessoryLeft={getIcon('checkmark-outline')}
        disabled={isLoading}
        onPress={() => respondInviteAction('accepted')}
      >
        Aceitar
      </Button>
      <Space my={1} />
      <Button
        status="danger"
        size="small"
        accessoryLeft={getIcon('close-outline')}
        disabled={isLoading}
        onPress={() => respondInviteAction('denied')}
      >
        Recusar
      </Button>
      <Space my={2} />
    </BaseContent>
    )
}

export default RespondInviteScreen