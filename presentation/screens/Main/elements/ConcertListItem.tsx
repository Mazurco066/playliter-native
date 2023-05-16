// Dependencies
import React, { memo } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { formatISODate } from '../../../utils'

// Types
import { IConcert } from '../../../../domain'

// Components
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, Layout, Text, useTheme } from '@ui-kitten/components'
import { Space } from '../../../components'

// Styles components
const Wrapper = styled(TouchableOpacity)`
  min-width: 120px;
  max-width: 150px;
  min-height: 100px;
  border-radius: 8px;
  overflow: hidden;
`

const ItemLayout = styled(Layout)`
  flex-grow: 1;
  align-items: center;
  ${color}
`

const ItemGradient = styled(LinearGradient)`
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px;
  padding-top: 8px;
  padding-bottom: 18px;
  margin-bottom: 16px;
  position: relative;
`

const BandLogo = styled(Avatar)`
  position: absolute;
  bottom: -20px;
`

const ItemData = styled(View)`
  padding: 8px;
  align-items: flex-start;
`

// Component properties
interface IConcertListItem {
  item: IConcert,
  onPress?: () => void
}

// Component
const ConcertListItem = ({
  item,
  onPress = () => {}
}: IConcertListItem): React.ReactElement => {
  // Hooks
  const theme = useTheme()

  // TSX
  return (
    <Wrapper onPress={onPress}>
      <ItemLayout style={{
        backgroundColor: theme['color-basic-700']
      }}>
        <ItemGradient
          colors={[theme['color-primary-500'], theme['color-secondary-500']]}
        >
          <Text
            category="label"
            style={{
              borderWidth: 1,
              borderColor: '#ffffff',
              paddingHorizontal: 8,
              borderRadius: 8
            }}
          >
            {formatISODate(item.date)}
          </Text>
          <Space my={1} />
          <BandLogo 
            source={{ uri: item.band.logo }}
          />
        </ItemGradient>
        <ItemData>
          <Text
            category="label"
            style={{
              fontSize: 14,
              textAlign: 'left'
            }}
          >
            {item.title}
          </Text>
          <Space my={0.5} />
          <Text
            category="label"
            style={{
              color: theme['color-secondary-500'],
              fontSize: 14,
              textAlign: 'left'
            }}
          >
            {item.band.title}
          </Text>
        </ItemData>
      </ItemLayout>
    </Wrapper>
  )
}

export default memo(ConcertListItem)