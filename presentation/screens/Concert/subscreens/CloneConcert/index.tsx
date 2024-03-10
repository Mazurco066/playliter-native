// Dependencies
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  // Http requests
  const reqCloneConcert = useMutation(
    (data: { concertId: string, date: string }) =>
      api.concerts.cloneConcert(data.concertId, data.date)
  )

  // Action
  const cloneConcertAction = async (date: Date) => {
    const concertId = item.id

    // Verify if date is filled
    if (!date) {
      showMessage({
        message: t('error_msgs.empty_date_msg'),
        duration: 2000,
        type: 'info'
      })
      return
    }

    // Clone concert
    const result = await reqCloneConcert.mutateAsync({
      concertId,
      date: date.toISOString().split('T')[0] 
    })
    if ([200, 201].includes(result.status)) {
      showMessage({
        message: t('success_msgs.clone_concert_msg'),
        duration: 2000,
        type: 'success'
      })
      replace("Concert", { itemId: result.data.data.id })
    } else if ([400].includes(result.status)) {
      showMessage({
        message: t('error_msgs.clone_concert_invalid_msg'),
        duration: 2000,
        type: 'warning'
      })
    } else if ([404].includes(result.status)) {
      showMessage({
        message: t('error_msgs.concert_not_found_msg'),
        duration: 2000,
        type: 'warning'
      })
      goBack()
    } else {
      showMessage({
        message: t('error_msgs.clone_concert_error_msg'),
        duration: 2000,
        type: 'danger'
      })
    }
  }

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        {t('concert_screen.clone_heading')}
      </Text>
      <Space my={1} />
      <Text category="s1">
        {t('concert_screen.clone_placeholder')}
      </Text>
      <Space my={2} />
      <Datepicker
        date={date}
        onSelect={nextValue => setDate(nextValue)}
        accessoryRight={CalendarIcon}
      />
      <Space my={2} />
      <Button
        disabled={reqCloneConcert.isLoading}
        onPress={() => cloneConcertAction(date)}
        size='small'
      >
        {t('concert_screen.duplicate_action')}
      </Button>
      <Space my={1} />
      <Button
        disabled={reqCloneConcert.isLoading}
        onPress={() => goBack()}
        size="small"
        status="danger"
      >
        {t('concert_screen.cancel_action')}
      </Button>
    </BaseContent>
  )
}

export default CloneConcertScreen
