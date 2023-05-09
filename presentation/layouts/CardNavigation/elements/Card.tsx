// Dependencies
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import { color } from 'styled-system'

// Components
import {
  Layout,
  Text,
  Card as UiKittenCard
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
  onPress = () => {}
}): React.ReactElement => {
  // TSX
  return (
    <Wrapper>
      <StyledUiKittenCard
        onPress={onPress}
        appearance="filled"
        activeOpacity={0.8}>
        <ContentWrapper>
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
