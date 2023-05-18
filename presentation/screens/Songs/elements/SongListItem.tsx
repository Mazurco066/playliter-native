// Dependencies
import React, { memo } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Types
import { ISong } from '../../../../domain'

// Components
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, Layout, Text, useTheme } from '@ui-kitten/components'

// Styles components
const Wrapper = styled(TouchableOpacity)`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`

const ItemLayout = styled(Layout)`
  flex-grow: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  ${color}
`

const ItemGradient = styled(LinearGradient)`
  flex: 0 0 auto;
  width: 35px;
  height: 100%;
  position: relative;
  flex-direction: row;
  align-items: center;
`

const BandLogo = styled(Avatar)`
  position: absolute;
  border-color: #ffffff;
  border-width: 1px;
  right: -20px;
`

const ItemData = styled(View)`
  flex-grow: 1;
  align-items: flex-start;
  justify-content: center;
  padding: 8px 12px 8px 20px;
  ${color}
`

const SongTextInfo = styled(Text)`
  max-width: 90%;
`

// Component properties
interface IConcertListItem {
  item: ISong,
  onPress?: () => void
}

// Component
const SongListItem = ({
  item,
  onPress = () => {}
}: IConcertListItem): React.ReactElement => {
  // Hooks
  const theme = useTheme()

  // TSX
  return (
    <Wrapper onPress={onPress}>
      <ItemLayout
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <ItemGradient
          colors={[theme['color-primary-500'], theme['color-secondary-500']]}
        >
          <BandLogo 
            source={{ uri: item.band.logo }}
          />
        </ItemGradient>
        <ItemData>
          <SongTextInfo
            category="label"
            numberOfLines={2}
            style={{
              fontSize: 15
            }}
          >
            {item.title}
          </SongTextInfo>
          <SongTextInfo
            category="label"
            numberOfLines={2}
            style={{
              fontSize: 14,
              color: theme['color-secondary-500']
            }}
          >
            {item.writter}
          </SongTextInfo>
          <SongTextInfo
            category="c1"
            numberOfLines={2}
            style={{
              color: theme['color-basic-200'],
              marginTop: 2
            }}
          >
            Publicada por {item.band.title}
          </SongTextInfo>
        </ItemData>
      </ItemLayout>
    </Wrapper>
  )
}

export default memo(SongListItem)