// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useBandStore } from '../../../../main/store'
import { getBandRole } from '../../../utils'

// Types
import { UserAccount } from '../../../../domain'

// Components
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, Layout, Text, useTheme } from '@ui-kitten/components'

// Styles components
const Wrapper = styled(TouchableOpacity)`
  width: 100%;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
`

const ItemLayout = styled(Layout)`
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  ${color}
`

const ItemGradient = styled(LinearGradient)`
  flex: 0 0 auto;
  width: 35px;
  height: 100%;
  position: relative;
  flex-direction: row;
  align-items: center;
`

const BandLogo = styled(Avatar)`
  position: absolute;
  border-color: #ffffff;
  border-width: 1px;
  right: -20px;
`

const ItemData = styled(View)`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  padding: 8px 12px 8px 20px;
  ${color}
`

const SongTextInfo = styled(Text)`
  max-width: 90%;
  overflow: hidden;
`

// Component props
interface IIntegrantItem {
  item: UserAccount,
  isLoading?: boolean
}

// Component
const IntegrantItem = ({
  item,
  isLoading = false
}: IIntegrantItem): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const { band } = useBandStore()

  // TSX
  return (
    <Wrapper
      onPress={() => {}}
      style={{ opacity: isLoading ? 0.7 : 1 }}
    >
      <ItemLayout
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <ItemGradient
          colors={[theme['color-primary-500'], theme['color-secondary-500']]}
        >
          <BandLogo 
            source={{ uri: item.avatar }}
          />
        </ItemGradient>
        <ItemData>
          <SongTextInfo
            category="label"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 15
            }}
          >
            {item.name}
          </SongTextInfo>
          <SongTextInfo
            category="label"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 14,
              color: theme['color-secondary-500']
            }}
          >
            {getBandRole(item.id, band)}
          </SongTextInfo>
        </ItemData>
      </ItemLayout>
    </Wrapper>
  )
}

export default IntegrantItem