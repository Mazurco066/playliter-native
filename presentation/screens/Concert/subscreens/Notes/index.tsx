// Dependencies
import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useConcertStore } from '../../../../../main/store'

// Types
import { IObservationType } from '../../../../../domain'
import { MainStackParamList } from '../../../../../main/router'

// Components
import { Button, Text, useTheme } from '@ui-kitten/components'
import { LinearGradient } from 'expo-linear-gradient'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { NoteListItem } from './elements'
import { BaseContent } from '../../../../layouts'
import { getIcon } from '../../../../utils'
import { Space } from '../../../../components'

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
const ConcertNotes = (): React.ReactElement => {
  // Hooks
  const { concert } = useConcertStore()
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const theme = useTheme()

  // Render item
  const renderItem = useCallback(({ item }: ListRenderItemInfo<IObservationType>) => (
    <NoteListItem
      onPress={() => navigate("SaveNote", { concertId: concert.id, item: item })}
      item={item}
    />
  ), [navigate, concert])

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
            Anotações
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
            Salve anotações referentes a apresentação. Caso precise utilize a função importar liturgia 
            para obter automaticamente os dados referentes ao dia informado.
          </Text>
          <ActionContainer>
            <Button
              status="primary"
              size="medium"
              style={{
                flex: 1,
                borderRadius: 8
              }}
            >
              Importar liturgia
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
        Anotações salvas
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
              Essa apresentação não tem nenhuma anotação no momento.
            </Text>
          </>
        )
      }
    </BaseContent>
  )
}

export default ConcertNotes