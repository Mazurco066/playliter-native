// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Types
import { ISongCategory } from '../../../../../../domain'

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

const CategoryTextInfo = styled(Text)`
  max-width: 90%;
  overflow: hidden;
`

// Component properties
type ICategoryListItem = {
  item: ISongCategory
  isLoading?: boolean
  onPress?: () => void
  onIconPress?: () => void
}

// Component
const CategoryListItem = ({
  item,
  isLoading = false,
  onPress = () => {},
  onIconPress = () => {}
}: ICategoryListItem): React.ReactElement => {
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
          <CategoryTextInfo
            category="label"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 15
            }}
          >
            {item.title}
          </CategoryTextInfo>
          <CategoryTextInfo
            category="label"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 14,
              color: theme['color-secondary-500']
            }}
          >
            {item.description}
          </CategoryTextInfo>
        </ItemData>
        <ItemAction
          disabled={isLoading}
          onPress={onIconPress}
        >
          <Icon
            name="arrow-ios-forward-outline"
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

export default CategoryListItem