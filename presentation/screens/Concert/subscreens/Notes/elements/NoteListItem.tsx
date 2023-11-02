// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Types
import { IObservationType } from '../../../../../../domain'

// Components
import { TouchableOpacity, View } from 'react-native'
import { Layout, Text, useTheme } from '@ui-kitten/components'

// Styles components
const Wrapper = styled(TouchableOpacity)`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  justify-content: center;
  height: 72px;
`

const ItemLayout = styled(Layout)`
  flex-grow: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  padding: 8px 12px;
  gap: 12px;
  ${color}
`

const ItemData = styled(View)`
  flex-grow: 1;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  ${color}
`

const LimitedItemText = styled(Text)`
  max-width: 100%;
`

// Component properties
type IConcertListItem = {
  item: IObservationType,
  onPress?: () => void
}

// Component
const NoteListItem = ({
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
        <ItemData>
          <LimitedItemText
            category="label"
            numberOfLines={2}
            style={{
              fontSize: 15,
              color: theme['color-secondary-500']
            }}
          >
            {item.title}
          </LimitedItemText>
          <LimitedItemText
            category="s1"
            numberOfLines={1}
            style={{
              fontSize: 14
            }}
          >
            {item.data}
          </LimitedItemText>
        </ItemData>
      </ItemLayout>
    </Wrapper>
  )
}

export default NoteListItem