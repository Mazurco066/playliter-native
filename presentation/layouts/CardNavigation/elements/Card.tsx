// Dependencies
import React from 'react'
import { useRoute } from '@react-navigation/native'
import { View } from 'react-native'
import styled from 'styled-components'
import { color } from 'styled-system'

// Components
import {
  Icon,
  Layout,
  Text,
  Card as UiKittenCard,
  useTheme
} from '@ui-kitten/components'

// Styles components
const Wrapper = styled(Layout)`
  min-width: 120px;
  max-width: 150px;
  height: 100px;
  background-color: transparent;
`

const StyledUiKittenCard = styled(UiKittenCard)`
  flex: 1;
  ${color}
`

const ContentWrapper = styled(View)`
  width: 100%;
  height: 100%;
  justify-content: space-between;
`

// Main component
const Card = ({
  label,
  route,
  icon,
  onPress = () => {}
}): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const { name } = useRoute()

  // TSX
  return (
    <Wrapper>
      <StyledUiKittenCard
        onPress={onPress}
        appearance="filled"
        status={route === name ? 'primary' : null}
        activeOpacity={0.8}
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <ContentWrapper>
          <Icon
            name={icon}
            fill="#ffffff"
            style={{
              width: 24,
              height: 24
            }}
          />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ color: 'white' }}>
            {label}
          </Text>
        </ContentWrapper>
      </StyledUiKittenCard>
    </Wrapper>
  )
}

// Exporting card component
export default Card
