// Dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { color } from 'styled-system'
import { getIcon } from '../../utils'

// Components
import { Button, Card, Icon, Modal, Spinner, Text, useTheme } from '@ui-kitten/components'
import { Dimensions, View } from 'react-native'
import { Space } from '../../components'

// Device window width
const windowWidth = Dimensions.get('window').width

// Styled components
const ModalCard = styled(Card)`
  width: ${windowWidth - 64}px;
  border-radius: 8px;
  ${color}
`

const ButtonsContainer = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`

// Confirm dialog props
interface IConfirmDialog {
  action?: { name: string, id?: string }
  title?: string
  message?: string
  isVisible: boolean
  enableTimer?: boolean
  onClose: () => void
  onConfirm?: () => void,
  onConfirmAction?: (action: { name: string, id?: string }) => void
}

// Confirm dialog component
const ConfirmDialog = ({
  action = { name: 'generic' },
  title = '',
  message = '',
  enableTimer = false,
  isVisible,
  onClose,
  onConfirm = () => {},
  onConfirmAction = () => {}
}: IConfirmDialog) : React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const [ canConfirm, setCanconfirm ] = useState<boolean>(true)
  const { t } = useTranslation()

  // Effects
  useEffect(() => {
    if (enableTimer) {
      setCanconfirm(false)
      setTimeout(() => setCanconfirm(true), 3000)
    }
  }, [ isVisible ])

  // Render confirm icon
  const renderConfirmIcon = useCallback(() => {
    if (canConfirm) return (
      <Icon
        style={{
          width: 16,
          height: 16
        }}
        name="checkmark-outline"
        fill="#ffffff"
      />
    )
    return (
      <Spinner
        size="tiny"
        status="info"
      />
    )
  }, [canConfirm])

  // TSX
  return (
    <Modal
      visible={isVisible}
      onBackdropPress={onClose}
      backdropStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <ModalCard
        disabled
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <Text
          category="label"
          style={{ fontSize: 16 }}
        >
          {title || t('components.confirm_title')}
        </Text>
        <Space my={1} />
        <Text>
          {message || t('components.confirm_message')}
        </Text>
        <Space my={2} />
        <ButtonsContainer>
          <Button
            size="small"
            status="danger"
            accessoryLeft={getIcon('close-outline')}
            onPress={onClose}
            style={{ flex: 1 }}
          />
          <Button
            size="small"
            status="success"
            accessoryLeft={renderConfirmIcon}
            disabled={!canConfirm}
            onPress={() => {
              if (canConfirm) {
                onClose()
                onConfirm()
                onConfirmAction(action)
              }
            }}
            style={{ flex: 1 }}
          />
        </ButtonsContainer>
      </ModalCard>
    </Modal>
  )
}

export default ConfirmDialog