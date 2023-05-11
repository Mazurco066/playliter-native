// Dependencies
import React, { useRef } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Components
import CardNavigation from '../CardNavigation'
import { Animated, ScrollView } from 'react-native'
import { Layout, useTheme } from '@ui-kitten/components'
import { Space } from '../../components'

// Styled components
const Wrapper = styled(Layout)`
  flex: 1;
  justify-content: center;
  align-items: center;
  ${color}
`

const ContentWrapper = styled(Layout)`
  flex: 1;
  flex-direction: column;
  ${color}
`

const Content = styled(ScrollView)`
  flex: 1;
  margin: 16px;
  ${color}
`

const AnimatedView = styled(Animated.View)`
  height: 100px;
  overflow: hidden;
  ${color}
`

// Main page
const BaseContent = ({ children }): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const animatedValue = useRef(new Animated.Value(1)).current

  // JSX
  return (
    <Wrapper>
      <ContentWrapper
        style={{ backgroundColor: theme['color-basic-900'] }}
      >
        <Content>
          {children}
        </Content>
        <AnimatedView style={{ opacity: animatedValue }}>
          <CardNavigation pointerEvents={null} />
        </AnimatedView>
        <Space my={2} />
      </ContentWrapper>
    </Wrapper>
  )
}

// Exporting page
export default BaseContent