// Dependencies
import React, { useRef } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Components
import CardNavigation from '../CardNavigation'
import { Animated, View, ScrollView } from 'react-native'
import { Layout } from '@ui-kitten/components'
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
  margin-top: 16px;
  margin-bottom: 16px;
`

const AnimatedView = styled(Animated.View)`
  height: 100px;
  overflow: hidden;
  ${color}
`

// Main page
const BaseContent = ({ children }): React.ReactElement => {
  // Hooks
  const animatedValue = useRef(new Animated.Value(1)).current

  // JSX
  return (
    <Wrapper>
      <ContentWrapper>
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