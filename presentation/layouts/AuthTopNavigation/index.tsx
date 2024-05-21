// Dependencies
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { color } from 'styled-system'

// Components
import { View } from 'react-native'
import {
  Button,
  Divider,
  Icon,
  IconElement,
  Text,
  TopNavigation as EvaTopNavigation,
  TopNavigationAction,
  useTheme
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

// Top navigation component
const AuthTopNavigation = ({ navigation }): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const { t } = useTranslation()

  // Auxiliar render functions
  const getIcon = (iconName: string) => (props: any): IconElement => (
    <Icon
      {...props}
      name={iconName}
      fill="#ffffff"
    />
  )

  const renderRightAcessory = (): React.ReactElement => (
    <Button
      size="small"
      onPress={() => {
        navigation.navigate('Login')
      }}
    >
      {t('components.login_action')}
    </Button>
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
        accessoryRight={renderRightAcessory}
        style={{ backgroundColor: theme['color-basic-900'] }}
      />
      <Divider
        style={{ backgroundColor: theme['color-basic-700'] }}
      />
    </>
  )
}

// Exporting custom top navigation
export default AuthTopNavigation
