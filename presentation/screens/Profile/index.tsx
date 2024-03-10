// Dependencies
import React, { useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { InviteListItem } from './elements'
import { Space } from '../../components'
import { BaseContent, ConfirmDialog } from '../../layouts'

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
  const { getUserData, hydrateAuthData, logoff } = useAuthStore()
  const [ isConfirmDialogOpen, setConfirmDialogState ] = useState<boolean>(false)
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const { t } = useTranslation()

  // HTTP Requests
  const reqAccountData = useQuery(
    ['get-current-account'],
    () => api.accounts.getCurrentAccount()
  )
  const reqInvites = useQuery(
    ['band_invites'],
    () => api.bands.getPendingInvitations()
  )
  const reqSendEmail = useMutation(
    () => api.accounts.resendValidationEmail()
  )
  const reqDeleteAccount = useMutation(
    () => api.accounts.deleteAccountData()
  )

  // Refetch data
  useRefreshOnFocus(reqAccountData.refetch)
  useRefreshOnFocus(reqInvites.refetch)

  // Effects
  useEffect(() => {
    if (
      reqAccountData.data &&
      reqAccountData.data.data &&
      reqAccountData.data.data.data
    ) {
      hydrateAuthData(reqAccountData.data.data.data)
    }
  }, [reqAccountData.data])

  // Handlers
  const deleteAccountHandler = async () => {
    const response = await reqDeleteAccount.mutateAsync()
    if (response.status < 400) {
      showMessage({
        message: t('success_msgs.wipe_msg'),
        duration: 3000,
        type: 'success'
      })
      logoff()
      navigation.replace('Auth')
    } else {
      showMessage({
        message: t('error_msgs.wipe_error_msg'),
        duration: 2000,
        type: 'warning'
      })
    }
  }

  // User
  const currentUser = getUserData()

  // Renderers
  const renderInviteListItem = useCallback(
    ({ item }: ListRenderItemInfo<IBandInvitation>) => (
      <InviteListItem
        onPress={() => navigate("RespondInvite", { item })}
        item={item}
        isLoading={reqInvites.isLoading}
      />
    )
  , [reqInvites.isLoading])

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
        {t('profile.edit_account')}
      </Button>
      <Space my={1} />
      <Button
        accessoryLeft={getIcon("alert-triangle-outline")}
        size="small"
        status="danger"
        onPress={() => {
          setConfirmDialogState(true)
        }}
      >
        {t('profile.delete_account')}
      </Button>
      <Space my={1} />
      <Button
        accessoryLeft={getIcon("log-out")}
        disabled={reqDeleteAccount.isLoading}
        size="small"
        status="info"
        onPress={() => {
          if (!reqDeleteAccount.isLoading) {
            logoff()
            navigation.replace('Auth')
          }
        }}
      >
        {t('profile.logoff')}
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
              {t('profile.peding_confirmation')}
            </Text>
            <Space my={2} />
            <Button
              size="small"
              appearance="outline"
              status="warning"
              disabled={reqSendEmail.isLoading || reqDeleteAccount.isLoading}
              onPress={() => reqSendEmail.mutateAsync()}
              style={{
                width: '100%'
              }}
            >
              {t('profile.resend_email')}
            </Button>
            <Space my={1} />
            <Button
              size="small"
              appearance="outline"
              status="info"
              disabled={reqSendEmail.isLoading || reqDeleteAccount.isLoading}
              onPress={() => navigation.navigate("InsertCode")}
              style={{
                width: '100%'
              }}
            >
              {t('profile.insert_code')}
            </Button>
          </ConfirmEmailContainer>
        ) : null
      }
      <Text category="h6">
        {t('profile.notifications_heading')}
      </Text>
      {
        reqInvites.isLoading ? (
          <LoadingContainer>
            <Space my={2} />
            <Spinner size="large" />
          </LoadingContainer>
        ) : !reqInvites.isLoading && reqInvites.data?.data?.data?.length > 0 ? (
          <FlatList
            ItemSeparatorComponent={() => <Space my={1} />}
            ListHeaderComponent={() => <Space my={2} />}
            ListFooterComponent={() => <Space my={2} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={reqInvites.data?.data?.data || []}
            renderItem={renderInviteListItem}
          />
        ) : (
          <>
            <Space my={1} />
            <Text category="s1">
              {t('profile.no_notifications')}
            </Text>
            <Space my={3} />
          </>
        )
      }
      <ConfirmDialog
        enableTimer
        isVisible={isConfirmDialogOpen}
        onClose={() => setConfirmDialogState(false)}
        onConfirm={deleteAccountHandler}
        message={t('profile.confirm_wipe')}
      />
    </BaseContent>
  )
}

// Exporting page
export default ProfileScreen
