// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Types
import { IConcertSongDto } from '../../../../../../domain'

// Components
import { Icon, Layout, Text, useTheme } from '@ui-kitten/components'
import { TouchableOpacity, View } from 'react-native'
import { OpacityDecorator } from 'react-native-draggable-flatlist'

// Styles components
const Wrapper = styled(View)`
  width: 100%;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  opacity: 1;
`

const ItemLayout = styled(Layout)`
  height: 100%;
  flex-grow: 1;
  display: flex;
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
  padding: 8px;
  ${color}
`

const SongTextInfo = styled(Text)`
  max-width: 100%;
  overflow: hidden;
`

const ItemAction = styled(TouchableOpacity)`
  flex: 0 0 auto;
  min-width: 40px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Component properties
type IConcertListItem = {
  item: IConcertSongDto
  number?: number
  isActive?: boolean
  isLoading?: boolean
  onLongPress?: () => void
}

// Component
const SongListItem = ({
  item,
  number = 0,
  isActive = false,
  isLoading = false,
  onLongPress = () => {},
}: IConcertListItem): React.ReactElement => {
  // Hooks
  const theme = useTheme()

  // TSX
  return (
    <OpacityDecorator>
      <Wrapper
        //onLongPress={onLongPress}
        style={{ opacity: isLoading ? 0.7 : 1 }}
        //disabled={isActive}
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
                fontWeight: 'normal'
              }}
            >
              {item.writter}
            </SongTextInfo>
          </ItemData>
          <ItemAction
            onLongPress={onLongPress}
            disabled={isActive || isLoading}
          >
            <Icon
              name="flip-outline"
              fill={theme['color-secondary-500']}
              style={{
                width: 24,
                height: 24
              }}
            />
          </ItemAction>
        </ItemLayout>
      </Wrapper>
    </OpacityDecorator>
  )
}

export default SongListItem