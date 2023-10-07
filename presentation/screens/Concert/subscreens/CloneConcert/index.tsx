// Dependencies
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../../../main/router'

// Api
import api from '../../../../../infra/api'

// Components
import { Button, Datepicker, Icon, IconElement, Text } from '@ui-kitten/components'
import { showMessage } from 'react-native-flash-message'
import { Space } from '../../../../components'
import { BaseContent } from '../../../../layouts'

const CalendarIcon = (props: any): IconElement => (
  <Icon
    {...props}
    name='calendar'
  />
)

// Duplicate modal component
const CloneConcertScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item } = route.params

  // Hooks
  const { goBack, replace } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ date, setDate ] = useState<Date>(new Date())

  // Http requests
  const {
    isLoading,
    mutateAsync: cloneConcert
  } = useMutation(
    (data: { concertId: string, date: string }) =>
      api.concerts.cloneConcert(data.concertId, data.date)
  )

  // Action
  const cloneConcertAction = async (date: Date) => {
    const concertId = item.id

    // Verify if date is filled
    if (!date) {
      showMessage({
        message: 'Por favor selecione uma data.',
        duration: 2000,
        type: 'info'
      })
      return
    }

    // Clone concert
    const result = await cloneConcert({ concertId, date: date.toISOString().split('T')[0] })
    if ([200, 201].includes(result.status)) {
      showMessage({
        message: 'Apresentação duplicada com sucesso!.',
        duration: 2000,
        type: 'success'
      })
      replace("Concert", { itemId: result.data.data.id })
    } else if ([400].includes(result.status)) {
      showMessage({
        message: 'Há dados inválidos em sua requisição. Por favor revise o preenchimento da data.',
        duration: 2000,
        type: 'warning'
      })
    } else if ([404].includes(result.status)) {
      showMessage({
        message: 'Apresentação não encontrada.',
        duration: 2000,
        type: 'warning'
      })
      goBack()
    } else {
      showMessage({
        message: 'Ops... ocorreu um erro ao duplicar a apresentação. Tente novamente mais tarde.',
        duration: 2000,
        type: 'danger'
      })
    }
  }

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        Clonar apresentação
      </Text>
      <Space my={1} />
      <Text category="s1">
        Duplique uma apresentação existente para manter as músicas na ordenação atual.
      </Text>
      <Space my={2} />
      <Datepicker
        date={date}
        onSelect={nextValue => setDate(nextValue)}
        accessoryRight={CalendarIcon}
      />
      <Space my={2} />
      <Button
        disabled={isLoading}
        onPress={() => cloneConcertAction(date)}
        size='small'
      >
        Duplicar apresentação
      </Button>
      <Space my={1} />
      <Button
        disabled={isLoading}
        onPress={() => goBack()}
        size="small"
        status="danger"
      >
        Cancelar
      </Button>
    </BaseContent>
  )
}

export default CloneConcertScreen