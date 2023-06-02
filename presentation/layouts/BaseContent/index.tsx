// Dependencies
import React, { useRef } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { isCloseToBottom } from '../../utils'

// Components
import CardNavigation from '../CardNavigation'
import { Animated, ScrollView, TouchableOpacity } from 'react-native'
import { Icon, Layout, useTheme } from '@ui-kitten/components'
import { Space } from '../../components'

// Styled components
const Wrapper = styled(Layout)`
  position: relative;
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

const FloatingButton = styled(TouchableOpacity)`
  position: absolute;
  right: 24px;
  bottom: 24px;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9;
`

// Component params
interface IBaseContent {
  children: React.ReactElement | React.ReactElement[]
  floatingIcon?: string
  hideCardsNavigation?: boolean
  isFloatingButtonDisabled?: boolean
  showFloatingButton?: boolean
  onFloatingButtonPress?: () => void
  onEndReached?: () => void
}

// Main page
const BaseContent = ({
  children,
  floatingIcon = 'plus-outline',
  hideCardsNavigation = false,
  isFloatingButtonDisabled = false,
  showFloatingButton = false,
  onFloatingButtonPress = () => {},
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
      {
        showFloatingButton ? (
          <FloatingButton
            onPress={onFloatingButtonPress}
            disabled={isFloatingButtonDisabled}
            style={{
              backgroundColor: theme['color-primary-500']
            }}
          >
            <Icon
              name={floatingIcon}
              fill="#ffffff"
              style={{
                width: 24,
                height: 24
              }}
            />
          </FloatingButton>
        ) : null
      }
    </Wrapper>
  )
}

// Exporting page
export default BaseContent