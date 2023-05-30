// Dependencies
import React, { useRef } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { isCloseToBottom } from '../../utils'

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
  width: 100%;
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

// Component params
interface IBaseContent {
  children: React.ReactElement | React.ReactElement[]
  hideCardsNavigation?: boolean
  onEndReached?: () => void
}

// Main page
const BaseContent = ({
  children,
  hideCardsNavigation = false,
  onEndReached = () => {}
}: IBaseContent): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const animatedValue = useRef(new Animated.Value(1)).current

  // JSX
  return (
    <Wrapper>
      <ContentWrapper
        style={{ backgroundColor: theme['color-basic-900'] }}
      >
        <Content
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              onEndReached()
            }
          }}
          scrollEventThrottle={400}
        >
          {children}
        </Content>
        {hideCardsNavigation ? null : (
          <AnimatedView style={{ opacity: animatedValue }}>
            <CardNavigation pointerEvents={null} />
          </AnimatedView>
        )}
        <Space my={2} />
      </ContentWrapper>
    </Wrapper>
  )
}

// Exporting page
export default BaseContent