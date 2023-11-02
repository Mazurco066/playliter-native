// Dependencies
import React from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'

// Types
import { IBandInvitation } from '../../../../domain'

// Components
import { Icon, Text, useTheme } from '@ui-kitten/components'
import { TouchableOpacity, View } from 'react-native'

// Styled components
const Wrapper = styled(TouchableOpacity)`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`

const ItemLayout = styled(View)`
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 12px;
  gap: 12px;
  ${color}
`

const ItemData = styled(View)`
  flex-grow: 1;
  align-items: flex-start;
  justify-content: center;
  ${color}
`

const InviteItemText = styled(Text)`
  max-width: 90%;
`

// Component properties
type IInviteListItem = {
  item: IBandInvitation
  onPress?: () => void
  isLoading?: boolean
}

// Component
const InviteListItem = ({
  item,
  onPress = () => {},
  isLoading = false
}: IInviteListItem): React.ReactElement => {
  // Hooks
  const theme = useTheme()

  // TSX
  return (
    <Wrapper
      disabled={isLoading}
      onPress={onPress}
      style={{
        backgroundColor: theme['color-basic-700']
      }}
    >
      <ItemLayout>
        <Icon
          name="email-outline"
          fill="#ffffff"
          style={{
            width: 32,
            height: 32
          }}
        />
        <ItemData>
          <InviteItemText
            category="label"
            style={{
              fontSize: 15,
              color: theme['color-secondary-500']
            }}
          >
            Novo convite ({item.band.title})
          </InviteItemText>
          <InviteItemText
            category="c1"
            style={{
              fontSize: 14
            }}
          >
            Voce foi convidado a se juntar a banda: {item.band.title}.
          </InviteItemText>
        </ItemData>
      </ItemLayout>
    </Wrapper>
  )
}

export default InviteListItem