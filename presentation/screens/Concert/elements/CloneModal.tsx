// Dependencies
import React, { useState } from 'react'
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
interface ICloneModal {
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
          Selecione uma data para duplicar
        </Text>
        <Space my={1} />
        <Datepicker
          label="Data da apresentação"
          placeholder="Seclecione uma data para clonar"
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
          Duplicar apresentação
        </Button>
        <Space my={1} />
        <Button
          disabled={isLoading}
          onPress={() => setVisible(false)}
          size="small"
          status="danger"
        >
          Cancelar
        </Button>
      </ModalContainer>
    </Modal>
  )
}

export default CloneModal