// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { formatISODate } from '../../../utils'
import { IConcert } from '../../../../domain'

// Components
import { Avatar, Text, useTheme } from '@ui-kitten/components'
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
  width: 100%;
  min-height: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  padding-bottom: 36px;
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

// Component params
interface IConcertHeaderContainer {
  concert: IConcert
}

// Page component
const ConcertHeaderContainer = ({
  concert
}: IConcertHeaderContainer): React.ReactElement => {
  // Hooks
  const theme = useTheme()

  // TSX
  return (
    <Container
      colors={[theme['color-primary-500'], theme['color-secondary-500']]}
    >
      <HeaderConteiner>
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
        >
          {concert.description}
        </Text>
      </DataContainer>
    </Container>
  )
}

export default ConcertHeaderContainer