// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { getIcon } from '../../utils'

// Store
import { useAuthStore } from '../../../main/store'

// Components
import { Avatar, Button, Text, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'
import { Space } from '../../components'
import { BaseContent } from '../../layouts'

// Styled components
const ProfileContainer = styled(View)`
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  ${color}
`

// Page Main JSX
const ProfileScreen = ({ navigation }) => {
  // Hooks
  const theme = useTheme()
  const { getUserData, logoff } = useAuthStore()

  // User
  const currentUser = getUserData()

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <ProfileContainer
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <Avatar
          size="giant"
          source={{
            uri: currentUser.avatar
          }}
        />
        <Space my={1} />
        <Text
          category="s1"
        >
          {currentUser.name}
        </Text>
        <Text
          category="c2"
        >
          {currentUser.email}
        </Text>             
      </ProfileContainer>
      <Space my={1} />
      <Button
        accessoryLeft={getIcon("edit-outline")}
        size="small"
        onPress={() => navigation.navigate("SaveProfile")}
      >
        Editar dados da conta
      </Button>
      <Space my={1} />
      <Button
        accessoryLeft={getIcon("log-out")}
        size="small"
        status="danger"
        onPress={() => {
          logoff()
          navigation.replace('Auth')
        }}
      >
        Logoff
      </Button>
      <Space my={2} />
      <Text
        category="h6"
      >
        Notificações
      </Text>
      <Space my={1} />
      <Text
        category="s1"
      >
        Não há notificações pendentes para sua conta.
      </Text>
      <Space my={3} />
    </BaseContent>
  )
}

// Exporting page
export default ProfileScreen