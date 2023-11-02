// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Components
import { Space } from '../../../components'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, View } from 'react-native'
import { Spinner, Text, useTheme } from '@ui-kitten/components'

// Styles components
const BandFeatureContainer = styled(View)`
  position: relative;
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
  ${color}
`

const FeatureContainer = styled(View)`
  padding: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  ${color}
`

const GradientAscent = styled(LinearGradient)`
  width: 100%;
  padding-top: 2px;
  padding-bottom: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Component params
type IBandFeature = {
  isLoading?: boolean,
  onPress?: () => void,
  amount: number,
  title: string,
  bgColor?: string
}

// Main Component
const BandFeature = ({
    isLoading = false,
    onPress = () => {},
    amount,
    title,
    bgColor
}: IBandFeature): React.ReactElement => {
  // Hooks
  const theme = useTheme()

  // TSX
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      style={{
        width: '31%'
      }}
    >
      <BandFeatureContainer
        style={{
          backgroundColor: bgColor || theme['color-basic-700'],
        }}
      >
        <FeatureContainer>
          {
            isLoading ? (
              <>
                <Spinner size="small" />
                <Space my={1} />
              </>
            ) : (
              <Text
                category="h6"
              >
                {amount}
              </Text>
            )
          }

          
          <Text
            category="c1"
            style={{
              textAlign: 'center'
            }}
          >
            {title}
          </Text>
        </FeatureContainer>
        <GradientAscent
          colors={[theme['color-primary-500'], theme['color-secondary-500']]}
        >
          <Text
            category="c1"
            style={{
              fontWeight: '600'
            }}
          >
            Acessar
          </Text>
        </GradientAscent>
      </BandFeatureContainer>
    </TouchableOpacity>
  )
}

export default BandFeature