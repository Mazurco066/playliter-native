// Dependencies
import React, { memo } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Components
import { TouchableOpacity } from 'react-native'
import { Layout, Text, useTheme } from '@ui-kitten/components'
import { IConcert } from '../../../../domain'

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
        <Text>
          Concert here: {item.title}
        </Text>
      </ItemLayout>
    </Wrapper>
  )
}

export default memo(ConcertListItem)