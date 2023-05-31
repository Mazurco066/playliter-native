// Dependencies
import React from 'react'
import { getIcon } from '../../utils'

// Components
import { Button, Card, Modal, Text, useTheme } from '@ui-kitten/components'

// Confirm dialog props
interface IConfirmDialog {
  action?: { name: string, id?: string }
  title?: string
  message?: string
  isVisible: boolean
  onClose: () => void
  onConfirm?: () => void,
  onConfirmAction?: (action: { name: string, id?: string }) => void
}

// Confirm dialog component
const ConfirmDialog = ({
  action = { name: 'generic' },
  title = 'Tem certeza?',
  message = 'Essa ação é permanente!',
  isVisible,
  onClose,
  onConfirm = () => {},
  onConfirmAction = () => {}
}: IConfirmDialog) : React.ReactElement => {
  // Hooks
  const theme = useTheme()

  // TSX
  return (
    <Modal
      visible={isVisible}
      onBackdropPress={onClose}
      backdropStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <Card
        disabled
        style={{
          backgroundColor: theme['color-basic-700'],
          borderRadius: 8
        }}
      >
        <Text>
          {title}
        </Text>
        <Text>
          {message}
        </Text>
        <Button
          size="small"
          status="danger"
          accessoryLeft={getIcon('close-outline')}
          onPress={onClose}
        />
        <Button
          size="small"
          status="success"
          accessoryLeft={getIcon('checkmark-outline')}
          onPress={() => {
            onClose()
            onConfirm()
            onConfirmAction(action)
          }}
        />
      </Card>
    </Modal>
  )
}

export default ConfirmDialog