// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Types
import { ISong } from '../../../../domain'

// Components
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, View } from 'react-native'
import { Layout, Text, useTheme } from '@ui-kitten/components'

// Styles components
const Wrapper = styled(TouchableOpacity)`
  width: 100%;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
`

const ItemLayout = styled(Layout)`
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  ${color}
`

const ItemGradient = styled(LinearGradient)`
  flex: 0 0 auto;
  width: 16px;
  height: 100%;
  position: relative;
  flex-direction: row;
  align-items: center;
`

const ItemData = styled(View)`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  padding: 8px 12px 8px 0px;
  ${color}
`

const SongTextInfo = styled(Text)`
  max-width: 90%;
  overflow: hidden;
`

// Component properties
type IConcertListItem = {
  item: ISong,
  isLoading?: boolean,
  onPress?: () => void
}

// Component
const SongListItem = ({
  item,
  isLoading = false,
  onPress = () => {}
}: IConcertListItem): React.ReactElement => {
  // Hooks
  const theme = useTheme()

  // TSX
  return (
    <Wrapper
      onPress={onPress}
      style={{ opacity: isLoading ? 0.7 : 1 }}
    >
      <ItemLayout
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <ItemGradient
          colors={[theme['color-primary-500'], theme['color-secondary-500']]}
        />
        <ItemData>
          <SongTextInfo
            category="label"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 15
            }}
          >
            {item.title}
          </SongTextInfo>
          <SongTextInfo
            category="label"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 14,
              color: theme['color-secondary-500']
            }}
          >
            {item.writter}
          </SongTextInfo>
        </ItemData>
      </ItemLayout>
    </Wrapper>
  )
}

export default SongListItem
