// Dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useConcertStore } from '../../../../../main/store'

// Http client
import api from '../../../../../infra/api'
import { useQuery, useMutation } from '@tanstack/react-query'

// Types
import { IConcert, IObservationType } from '../../../../../domain'
import { MainStackParamList } from '../../../../../main/router'

// Components
import { Button, Text, useTheme } from '@ui-kitten/components'
import { LinearGradient } from 'expo-linear-gradient'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { NoteListItem } from './elements'
import { BaseContent } from '../../../../layouts'
import { getIcon } from '../../../../utils'
import { Space } from '../../../../components'
import { useRefreshOnFocus } from '../../../../hooks'

// Styled components
const Container = styled(LinearGradient)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
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

const DataContainer = styled(View)`
  position: relative;
  align-items: center;
  width: 100%;
  padding: 16px 8px 16px 8px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  ${color}
`

const ActionContainer = styled(View)`
  width: 100%;
  flex-direction: row;
  gap: 8px;
  margin-top: 12px;
`

// Notes subscreen
const ConcertNotes = ({ route }): React.ReactElement => {
  // Http requests
  const { item: { id: concertId } } = route.params
  const reqConcert = useQuery(
    [`get-concert-${concertId}`],
    () => api.concerts.getConcert(concertId)
  )
  const reqScrapLiturgy = useMutation((date: string) => {
    return api.helpers.scrapLiturgy(date)
  })

  const reqAddNote = useMutation((data: {
    concertId: string,
    title: string,
    content: string
  }) => {
    return api.concerts.addConcertObservation(data.concertId, data.title, data.content)
  })


  // Refetch on focus
  useRefreshOnFocus(reqConcert.refetch)

  // Hooks
  const [ isScrapLoading, setScrapLoading ] = useState<boolean>(false)
  const { concert, setConcert } = useConcertStore()
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const { t } = useTranslation()
  const theme = useTheme()

  // Effects
  useEffect(() => {
    if (reqConcert.data && reqConcert.data.data) {
      const { data } = reqConcert.data.data
      if (data) setConcert(data as IConcert)
    }
  }, [reqConcert.data])

  // Render item
  const renderItem = useCallback(({ item }: ListRenderItemInfo<IObservationType>) => (
    <NoteListItem
      onPress={() => navigate('SaveNote', { concertId: concert.id, item: item })}
      item={item}
    />
  ), [navigate, concert])

  // Handlers
  const onImportLiturgy = async () => {
    setScrapLoading(true)
    const liturgyResponse = await reqScrapLiturgy.mutateAsync(
      concert.date.split('T')[0]
    )

     // Verify if request was successfull
     if ([200, 201].includes(liturgyResponse.status)) {

      // PS: Promise.all works but it ll misss some observations
      // Api is not adding all if all requests are at same time on Promise.all
      const responses = []
      for (let i = 0; i < liturgyResponse.data.data.length; i++) {
        const liturgy = liturgyResponse.data.data[i]
        const obsResponse = await reqAddNote.mutateAsync({
          title: liturgy.title,
          content: liturgy.content,
          concertId: concert.id
        })
        responses.push(obsResponse)
      }
      
      // Verify import errors
      const hasImportErrors = responses.find(resp => ![200, 201].includes(resp.status))

      // User feedback
      setScrapLoading(false)
      reqConcert.refetch()
      if (!hasImportErrors) {
        showMessage({
          message: t('success_msgs.liturgy_import_msg'),
          duration: 2000,
          type: 'success'
        })
      } else {
        showMessage({
          message: t('error_msgs.liturgy_import_error_msg'),
          duration: 2000,
          type: 'info'
        })
      }
    } else {
      setScrapLoading(false)
    }
  }

  // Destruct data
  const { observations } = concert

  // TSX
  return (
    <BaseContent
      hideCardsNavigation
    >
      <Container
        colors={[theme['color-primary-500'], theme['color-secondary-500']]}
      >
        <HeaderContainer>
          <Text category="h5">
            {t('concert_screen.notes_heading')}
          </Text>
        </HeaderContainer>
        <DataContainer
          style={{
            backgroundColor: theme['color-basic-700']
          }}
        >
          <Text
            category="s1"
            style={{ textAlign: 'center' }}
          >
            {t('concert_screen.notes_placeholder')}
          </Text>
          <ActionContainer>
            <Button
              status="primary"
              size="medium"
              onPress={onImportLiturgy}
              disabled={reqConcert.isLoading || isScrapLoading}
              style={{
                flex: 1,
                borderRadius: 8
              }}
            >
              {t('concert_screen.liturgy_action')}
            </Button>
            <Button
              accessoryLeft={getIcon('plus-outline', theme['color-secondary-500'])}
              appearance="ghost"
              size="medium"
              onPress={() => navigate("SaveNote", { concertId: concert.id })}
              style={{
                flex: 0,
                borderRadius: 8,
                borderColor: theme['color-secondary-500']
              }}
            />
          </ActionContainer>
        </DataContainer>
      </Container>
      <Space my={1} />
      <Text category="h5">
        {t('concert_screen.saved_notes_heading')}
      </Text>
      {
        observations.length > 0 ? (
          <FlatList
            ItemSeparatorComponent={() => <Space my={1} />}
            ListHeaderComponent={() => <Space my={2} />}
            ListFooterComponent={() => <Space my={2} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={observations || []}
            renderItem={renderItem}
          />
        ) : (
          <>
            <Space my={2} />
            <Text category="s1">
              {t('concert_screen.no_notes')}
            </Text>
          </>
        )
      }
    </BaseContent>
  )
}

export default ConcertNotes
