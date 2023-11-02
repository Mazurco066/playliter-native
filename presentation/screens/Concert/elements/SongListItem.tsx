// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { getIcon } from '../../../utils'

// Types
import { IConcertSongDto } from '../../../../domain'

// Components
import { TouchableOpacity, View } from 'react-native'
import { Button, Layout, Text, useTheme } from '@ui-kitten/components'

// Styles components
const Wrapper = styled(TouchableOpacity)`
  width: 100%;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
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

const ItemOrder = styled(View)`
  flex: 0 0 auto;
  min-width: 24px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
`

const ItemOrderNumber = styled(Text)`
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
`

const ItemAction = styled(View)`
  flex: 0 0 auto;
  min-width: 24px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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

// Component properties
type IConcertListItem = {
  item: IConcertSongDto
  number?: number
  isLoading?: boolean
  onPress?: () => void
  onRemovePress?: () => void
}

// Component
const SongListItem = ({
  item,
  number = 0,
  isLoading = false,
  onPress = () => {},
  onRemovePress = () => {}
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
        <ItemOrder>
          <ItemOrderNumber
            category='label'
            style={{ color: theme['color-secondary-500'] }}
          >
            {number}
          </ItemOrderNumber>
        </ItemOrder>
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
        <ItemAction>
          <Button
            size="small"
            appearance="ghost"
            accessoryLeft={getIcon('close-outline', theme['color-danger-500'])}
            style={{ height: '100%' }}
            disabled={isLoading}
            onPress={onRemovePress}
          />
        </ItemAction>
      </ItemLayout>
    </Wrapper>
  )
}

export default SongListItem