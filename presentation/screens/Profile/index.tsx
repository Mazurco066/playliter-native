// Dependencies
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useQuery } from '@tanstack/react-query'
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
import { Avatar, Button, Text, useTheme } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
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
      <Text
        category="h6"
      >
        Notificações
      </Text>
      {
        pendingInvites?.data?.data?.length > 0 ? (
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