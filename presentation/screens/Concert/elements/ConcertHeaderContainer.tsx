// Dependencies
import React, { useState } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { getIcon, formatISODate } from '../../../utils'
import { IConcert } from '../../../../domain'

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

const ButtonContainer = styled(View)`
  width: 100%;
  flex-direction: row;
  gap: 8px;
`

// Component params
interface IConcertHeaderContainer {
  concert: IConcert
  isLoading?: boolean
  onAddPress?: () => void
  onDeletePress?: () => void
  onEditPress?: () => void
  onNotesPress?: () => void
  onReorderPress?: () => void
  onSequentialPress?: () => void
}

// Page component
const ConcertHeaderContainer = ({
  concert,
  isLoading = false,
  onAddPress = () => {},
  onDeletePress = () => {},
  onEditPress = () => {},
  onNotesPress = () => {},
  onReorderPress = () => {},
  onSequentialPress = () => {}
}: IConcertHeaderContainer): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const [visible, setVisible] = useState<boolean>(false)

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
              title='Adicionar músicas públicas'
              accessoryLeft={getIcon('plus-outline')}
              disabled={isLoading}
              onPress={onAddPress}
              style={{
                backgroundColor: theme['color-basic-700']
              }}
            />
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
              title='Reordenar músicas'
              accessoryLeft={getIcon('flip-outline')}
              disabled={isLoading}
              onPress={onReorderPress}
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
          category="label"
          style={{
            borderWidth: 1,
            borderColor: '#ffffff',
            paddingHorizontal: 8,
            borderRadius: 8,
            marginBottom: 8
          }}
        >
          {formatISODate(concert.date)}
        </Text>
        <Text
          category="s1"
          style={{
            fontWeight: 'bold'
          }}
        >
          {concert.title}
        </Text>
        <Text
          category="s2"
        >
          {concert.band.title}
        </Text>
      </HeaderConteiner>
      <DataContainer
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <BandLogo
          size='giant'
          source={{ uri: concert.band.logo }}
        />
        <Text
          category="s1"
          style={{
            marginBottom: 16,
            textAlign: 'center'
          }}
        >
          {concert.description}
        </Text>
        <ButtonContainer>
          <Button
            accessoryLeft={getIcon('book-outline', theme['color-secondary-500'])}
            appearance="ghost"
            size="medium"
            onPress={onNotesPress}
            disabled={isLoading}
            style={{
              flex: 0,
              borderRadius: 8,
              borderColor: theme['color-secondary-500']
            }}
          />
          <Button
            accessoryLeft={getIcon('file-text-outline')}
            status="primary"
            size="medium"
            onPress={onSequentialPress}
            disabled={isLoading}
            style={{
              flex: 1,
              borderRadius: 8
            }}
          >
            Visualização sequencial
          </Button>
        </ButtonContainer>
      </DataContainer>
    </Container>
  )
}

export default ConcertHeaderContainer