// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Types
import { ISong } from '../../../../../../domain'

// Components
import { TouchableOpacity, View } from 'react-native'
import { Icon, Layout, Text, useTheme } from '@ui-kitten/components'

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

const ItemData = styled(View)`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  padding: 8px 12px 8px 12px;
  ${color}
`

const ItemAction = styled(TouchableOpacity)`
  flex: 0 0 auto;
  min-width: 48px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SongTextInfo = styled(Text)`
  max-width: 90%;
  overflow: hidden;
`

// Component properties
type IConcertListItem = {
  item: ISong
  isLoading?: boolean
  onPress?: () => void
  onAddPress?: () => void
}

// Component
const SongListItem = ({
  item,
  isLoading = false,
  onPress = () => {},
  onAddPress = () => {}
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
        <ItemAction
          disabled={isLoading}
          onPress={onAddPress}
        >
          <Icon
            name="plus-outline"
            fill={theme['color-primary-500']}
            style={{
              width: 24,
              height: 24
            }}
          />
        </ItemAction>
      </ItemLayout>
    </Wrapper>
  )
}

export default SongListItem