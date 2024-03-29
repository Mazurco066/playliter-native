// Dependencies
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { color } from 'styled-system'

// Types
import { IObservationType } from '../../../../../../domain'

// Components
import { Button, Text, useTheme } from '@ui-kitten/components'
import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import { Space } from '../../../../../components'
import { getIcon } from '../../../../../utils'

// Styled components
const Container = styled(LinearGradient)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  ${color}
`

const HeaderContainer = styled(View)`
  position: relative;
  width: 100%;
  min-height: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  padding-bottom: 8px;
`

const ButtonContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
`

const DataContainer = styled(View)`
  width: 100%;
  padding: 16px;
`

// Component props
type IViewNote = {
  isLoading?: boolean,
  item: IObservationType,
  onEdit?: () => void,
  onGoBack?: () => void,
  onRemove?: () => void
}

// Main component
const ViewNote = ({
  isLoading = false,
  item,
  onEdit = () => {},
  onRemove = () => {}
}: IViewNote): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const { t } = useTranslation()

  // TSX
  return (
    <Container
      colors={[theme['color-primary-500'], theme['color-secondary-500']]}
    >
      <HeaderContainer>
        <Text
          category="h5"
          style={{
            textAlign: 'center'
          }}
        >
          {item.title}
        </Text>
        <Space my={1} />
        <ButtonContainer>
          <Button
            size="tiny"
            status="info"
            onPress={onEdit}
            disabled={isLoading}
            accessoryLeft={getIcon('edit-outline')}
          >
            {t('concert_screen.edit_action')}
          </Button>
          <Button
            size="tiny"
            status="danger"
            onPress={onRemove}
            disabled={isLoading}
            accessoryLeft={getIcon('edit-outline')}
          >
            {t('concert_screen.remove_action')}
          </Button>
        </ButtonContainer>
      </HeaderContainer>
      <DataContainer
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <Space my={2} />
        <Text
          category="s1"
          style={{
            fontSize: 14
          }}
        >
          {item.data}
        </Text>
      </DataContainer>
    </Container>
  )
}

export default ViewNote