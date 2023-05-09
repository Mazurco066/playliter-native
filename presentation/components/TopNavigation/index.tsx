// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useAuthStore } from '../../../main/store'

// Components
import { View } from 'react-native'
import {
  Avatar,
  Divider,
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
  padding-top: 16px;
  ${color}
`

const TitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  ${color}
`

const InfoContainer = styled(View)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  ${color}
`

const UserAvatar = styled(Avatar)`
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
  const getIcon = (iconName: string) => (props: any): IconElement => (
    <Icon {...props} name={iconName} />
  )

  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={(props: any) => (
        <UserAvatar
          source={{ uri: account?.avatar }}
        />
      )}
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
        accessoryLeft={getIcon('person-outline')}
        title='Perfil'
      />
      <MenuItem
        accessoryLeft={getIcon('info')}
        title='Sobre'
      />
      <MenuItem
        accessoryLeft={getIcon('log-out')}
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
      <TopNavigationAction
        icon={getIcon('arrow-back')}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack()
          }
        }}
      />
      <InfoContainer>
        <Text 
          {...props}
          style={{ textAlign: 'center' }}
        >
          {account?.name}
        </Text>
        <Text
          {...props}
          status="primary"
          category="s1"
          style={{
            textAlign: 'center',
            textTransform: 'uppercase'
          }}
        >
          Playliter
        </Text>
      </InfoContainer>
    </TitleContainer>
  )

  // Main component TSX
  return (
    <>
      <StyledTopNavigation
        title={renderTitle}
        accessoryRight={renderOverflowMenuAction}
      />
      <Divider />
    </>
  )
}

// Exporting custom top navigation
export default TopNavigation