// Dependencies
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useAuthStore } from '../../../../main/store'
import { getBandRole } from '../../../utils'

// Types
import { IBand } from '../../../../domain'

// Components
import { TouchableOpacity, View } from 'react-native'
import { Avatar, Layout, Text, useTheme } from '@ui-kitten/components'

// Styles components
const Wrapper = styled(TouchableOpacity)`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`

const ItemLayout = styled(Layout)`
  flex-grow: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  padding: 8px 12px;
  gap: 12px;
  ${color}
`
const BandLogo = styled(Avatar)`
  flex: 0 0 auto;
`

const ItemData = styled(View)`
  flex-grow: 1;
  align-items: flex-start;
  justify-content: center;
  ${color}
`

const BandItemText = styled(Text)`
  max-width: 90%;
`

// Component properties
type IConcertListItem = {
  item: IBand,
  onPress?: () => void
}

// Component
const BandListItem = ({
  item,
  onPress = () => {}
}: IConcertListItem): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const { account } = useAuthStore()
  const { t } = useTranslation()

  // TSX
  return (
    <Wrapper onPress={onPress}>
      <ItemLayout
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <BandLogo
          source={{ uri: item.logo }}
          size="large"
        />
        <ItemData>
          <BandItemText
            category="label"
            numberOfLines={2}
            style={{
              fontSize: 15
            }}
          >
            {item.title}
          </BandItemText>
          <Text
            category="label"
            numberOfLines={1}
            style={{
              fontSize: 14,
              color: theme['color-secondary-500']
            }}
          >
            {getBandRole(account?.id, item, [
              t('roles.founder'),
              t('roles.admin'),
              t('roles.member'),
              t('roles.no_filiation')
            ])}
          </Text>
        </ItemData>
      </ItemLayout>
    </Wrapper>
  )
}

export default memo(BandListItem)