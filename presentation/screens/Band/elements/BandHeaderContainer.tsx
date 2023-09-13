// Dependencies
import React, { useState } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { getIcon } from '../../../utils'
import { IBand } from '../../../../domain'
import { getBandRole } from '../../../utils'
import { useAuthStore } from '../../../../main/store'

// Components
import {
  Avatar,
  Button,
  IndexPath,
  MenuItem,
  OverflowMenu,
  Text,
  useTheme
} from '@ui-kitten/components'
import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'

// Styles components
const Container = styled(LinearGradient)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  ${color}
`

const HeaderConteiner = styled(View)`
  position: relative;
  width: 100%;
  min-height: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  padding-bottom: 36px;
`

const ActionContainer = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`

const DataContainer = styled(View)`
  position: relative;
  width: 100%;
  padding: 36px 8px 16px 8px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  ${color}
`

const BandLogo = styled(Avatar)`
  position: absolute;
  align-self: center;
  top: -28px;
`

// Component params
interface IBandHeaderContainer {
  band: IBand
  isLoading?: boolean
  onAddPress?: () => void
  onDeletePress?: () => void
  onEditPress?: () => void
}

// Page component
const BandHeaderContainer = ({
  band,
  isLoading = false,
  onDeletePress = () => {},
  onEditPress = () => {},
}: IBandHeaderContainer): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const { account } = useAuthStore()
  const [ visible, setVisible ] = useState<boolean>(false)

  const onItemSelect = (_: IndexPath): void => {
    setVisible(false)
  }

  const renderToggleButton = (): React.ReactElement => (
    <Button
      size="small"
      appearance="ghost"
      accessoryLeft={getIcon('more-vertical-outline')}
      onPress={() => setVisible(true)}
    />
  )
  
  // TSX
  return (
    <Container
      colors={[theme['color-primary-500'], theme['color-secondary-500']]}
    >
      <HeaderConteiner>
        <ActionContainer>
          <OverflowMenu
            anchor={renderToggleButton}
            visible={visible}
            onSelect={onItemSelect}
            onBackdropPress={() => setVisible(false)}
          >
            <MenuItem
              title='Editar'
              accessoryLeft={getIcon('edit-2-outline')}
              disabled={isLoading}
              onPress={onEditPress}
              style={{
                backgroundColor: theme['color-basic-700']
              }}
            />
            <MenuItem
              title='Excluir'
              accessoryLeft={getIcon('trash-2-outline')}
              disabled={isLoading}
              onPress={onDeletePress}
              style={{
                backgroundColor: theme['color-basic-700']
              }}
            />
          </OverflowMenu>
        </ActionContainer>
        <Text
          category="h6"
          style={{
            fontWeight: 'bold'
          }}
        >
          {band.title}
        </Text>
        <Text
          category="s2"
        >
          {getBandRole(account.id, band)}
        </Text>
      </HeaderConteiner>
      <DataContainer
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <BandLogo
          size='giant'
          source={{ uri: band.logo }}
        />
        <Text
          category="s1"
          style={{
            marginBottom: 16,
            textAlign: 'center'
          }}
        >
          {band.description}
        </Text>
      </DataContainer>
    </Container>
  )
}

export default BandHeaderContainer