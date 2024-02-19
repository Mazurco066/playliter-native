// Dependencies
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

// Components
import { Button, Card, Datepicker, Icon, IconElement, Modal, Text } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'
import { Space } from '../../../components'

const CalendarIcon = (props: any): IconElement => (
  <Icon
    {...props}
    name='calendar'
  />
)

// Styled components
const ModalContainer = styled(Card)`
  width: 900px;
  max-width: 90%;
  margin: 0 auto;
  border-radius: 8px;
`

// Modal styles
const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
})

// Props
type ICloneModal = {
  visible: boolean
  setVisible: (value: boolean) => void
  onDuplicate?: (date: string) => void,
  isLoading?: boolean
}

// Duplicate modal component
const CloneModal = ({
  visible,
  setVisible,
  onDuplicate = () => {},
  isLoading = false
}: ICloneModal): React.ReactElement => {
  // Hooks
  const [ date, setDate ] = useState<Date>(new Date())
  const { t } = useTranslation()

  // TSX
  return (
    <Modal
      visible={visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => isLoading ? () => {} : setVisible(false)}
    >
      <ModalContainer disabled={true}>
        <Text
          category="s1"
          style={{
            fontWeight: 'bold'
          }}
        >
          {t('concert_screen.duplicate_heading')}
        </Text>
        <Space my={1} />
        <Datepicker
          label={t('concert_screen.duplicate_label')}
          placeholder={t('concert_screen.duplicate_placeholder')}
          date={date}
          onSelect={nextDate => setDate(nextDate)}
          accessoryRight={CalendarIcon}
        />
        <Space my={2} />
        <Button
          disabled={isLoading}
          onPress={() => setVisible(false)}
          size='small'
        >
          {t('concert_screen.duplicate_action')}
        </Button>
        <Space my={1} />
        <Button
          disabled={isLoading}
          onPress={() => setVisible(false)}
          size="small"
          status="danger"
        >
          {t('concert_screen.cancel_action')}
        </Button>
      </ModalContainer>
    </Modal>
  )
}

export default CloneModal