// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useAuthStore } from '../../../main/store'

// Components
import { View } from 'react-native'
import {
  Avatar,
  Icon,
  IconElement,
  MenuItem,
  OverflowMenu,
  Text,
  TopNavigation as EvaTopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components'

// Styled components
const StyledTopNavigation = styled(EvaTopNavigation)`
  ${color}
`

const TitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  position: relative;
  ${color}
`

const UserAvatar = styled(Avatar)`
  margin-right: 16px;
  margin-left: 16px;
  ${color}
`

// Top navigation component
const TopNavigation = ({ navigation }): React.ReactElement => {
  // Hooks
  const [ menuVisible, setMenuVisible ] = React.useState(false)
  const { account, logoff } = useAuthStore()

  // Actions
  const toggleMenu = (): void => {
    setMenuVisible(!menuVisible);
  }

  // Auxiliar render functions
  const MenuIcon = (props: any): IconElement => (
    <Icon
      {...props}
      name='more-vertical'
    />
  )
  
  const InfoIcon = (props: any): IconElement => (
    <Icon
      {...props}
      name='info'
    />
  )
  
  const LogoutIcon = (props: any): IconElement => (
    <Icon
      {...props}
      name='log-out'
    />
  )

  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={toggleMenu}
    />
  )

  const renderOverflowMenuAction = (): React.ReactElement => (
    <OverflowMenu
      anchor={renderMenuAction}
      visible={menuVisible}
      onBackdropPress={toggleMenu}
    >
      <MenuItem
        accessoryLeft={InfoIcon}
        title='Perfil'
      />
      <MenuItem
        accessoryLeft={LogoutIcon}
        title='Logout'
        onPress={() => {
          logoff()
          navigation.replace('Auth')
        }}
      />
    </OverflowMenu>
  )

  const renderTitle = (props: any): React.ReactElement => (
    <TitleContainer>
      <UserAvatar source={{ uri: account?.avatar }} />
      <Text {...props}>
        {account?.name}
      </Text>
    </TitleContainer>
  )

  // Main component TSX
  return (
    <StyledTopNavigation
      title={renderTitle}
      accessoryRight={renderOverflowMenuAction}
    />
  )
}

// Exporting custom top navigation
export default TopNavigation
