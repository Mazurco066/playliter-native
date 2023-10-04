// Dependencies
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getIcon } from '../../utils'
import { useRefreshOnFocus } from '../../hooks'
import { MainStackParamList } from '../../../main/router'

// Api
import api from '../../../infra/api'

// Types
import { IBandInvitation } from '../../../domain'

// Store
import { useAuthStore } from '../../../main/store'

// Components
import { Avatar, Button, Icon, Spinner, Text, useTheme } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native'
import { InviteListItem } from './elements'
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

const ConfirmEmailContainer = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  ${color}
`

const LoadingContainer = styled(View)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Page Main JSX
const ProfileScreen = ({ navigation }) => {
  // Hooks
  const theme = useTheme()
  const { getUserData, logoff } = useAuthStore()
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()

  // HTTP Requests
  const {
    data: pendingInvites,
    isLoading: isLoadingInvites,
    refetch: refetchInvites
  } = useQuery(
    ['band_invites'],
    () => api.bands.getPendingInvitations()
  )
  const {isLoading: isLoadingEmail, mutateAsync: resendEmail } = useMutation(
    () => api.accounts.resendValidationEmail()
  )

  // Refetch data
  useRefreshOnFocus(refetchInvites)

  // User
  const currentUser = getUserData()

  // Renderers
  const renderInviteListItem = useCallback(
    ({ item }: ListRenderItemInfo<IBandInvitation>) => (
      <InviteListItem
        onPress={() => navigate("RespondInvite", { item })}
        item={item}
        isLoading={isLoadingInvites}
      />
    )
  , [isLoadingInvites])

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
      {
        !currentUser.isEmailconfirmed ? (
          <ConfirmEmailContainer
            style={{
              backgroundColor: theme['color-warning-200']
            }}
          >
            <Icon 
              fill={theme['color-warning-500']}
              name="alert-triangle-outline"
              style={{
                width: 32,
                height: 32
              }}
            />
            <Space my={1} />
            <Text
              category="s1"
              style={{
                textAlign: "justify",
                color: "#212121"
              }}
            >
              Por favor valide o E-mail de sua conta. No caso de voce não ter recebido o E-mail clique 
              no botão abaixo para soliciar o reenvio do E-mail de validação de conta.
            </Text>
            <Space my={2} />
            <Button
              size="small"
              appearance="outline"
              status="warning"
              disabled={isLoadingEmail}
              onPress={() => resendEmail()}
              style={{
                width: '100%'
              }}
            >
              Reenviar E-mail de validação
            </Button>
            <Space my={1} />
            <Button
              size="small"
              appearance="outline"
              status="info"
              disabled={isLoadingEmail}
              onPress={() => navigation.navigate("InsertCode")}
              style={{
                width: '100%'
              }}
            >
              Inserir código de validação
            </Button>
          </ConfirmEmailContainer>
        ) : null
      }
      <Text
        category="h6"
      >
        Notificações
      </Text>
      {
        isLoadingInvites ? (
          <LoadingContainer>
            <Space my={2} />
            <Spinner size="large" />
          </LoadingContainer>
        ) : !isLoadingInvites && pendingInvites?.data?.data?.length > 0 ? (
          <FlatList
            ItemSeparatorComponent={() => <Space my={1} />}
            ListHeaderComponent={() => <Space my={2} />}
            ListFooterComponent={() => <Space my={2} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={pendingInvites?.data?.data || []}
            renderItem={renderInviteListItem}
          />
        ) : (
          <>
            <Space my={1} />
            <Text
              category="s1"
            >
              Não há notificações pendentes para sua conta.
            </Text>
            <Space my={3} />
          </>
        )
      }
      
    </BaseContent>
  )
}

// Exporting page
export default ProfileScreen