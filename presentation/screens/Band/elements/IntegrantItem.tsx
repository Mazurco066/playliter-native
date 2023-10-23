// Dependencies
import React, { useState } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useBandStore, useAuthStore } from '../../../../main/store'
import { getBandRole, getIcon } from '../../../utils'

// Types
import { UserAccount } from '../../../../domain'

// Components
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, View } from 'react-native'
import {
  Avatar,
  Button,
  IndexPath,
  Layout,
  OverflowMenu,
  MenuItem,
  Text,
  useTheme
} from '@ui-kitten/components'

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

const ActionContainer = styled(View)`
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`

// Component props
interface IIntegrantItem {
  item: UserAccount
  isLoading?: boolean
  onDemotePress?: () => void
  onPromotePress?: () => void
  onRemovePress?: () => void
  onTransferPress?: () => void
}

// Component
const IntegrantItem = ({
  item,
  isLoading = false,
  onDemotePress = () => {},
  onPromotePress = () => {},
  onRemovePress = () => {},
  onTransferPress = () => {}
}: IIntegrantItem): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const { account } = useAuthStore()
  const { band } = useBandStore()
  const [ visible, setVisible ] = useState<boolean>(false)

  //Actions
  const onItemSelect = (_: IndexPath): void => {
    setVisible(false)
  }

  const renderToggleButton = (): React.ReactElement => (
    <Button
      size="small"
      appearance="ghost"
      accessoryLeft={getIcon('more-vertical-outline')}
      onPress={() => setVisible(true)}
    />
  )

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
        {
          (band.owner.id !== item.id && item.id !== account.id) ? (
            <ActionContainer>
              <OverflowMenu
                anchor={renderToggleButton}
                visible={visible}
                onSelect={onItemSelect}
                onBackdropPress={() => setVisible(false)}
              >
                {
                  band.owner.id === account.id ? (
                    <MenuItem
                      title="Transferir liderança"
                      accessoryLeft={getIcon('trending-up-outline')}
                      disabled={isLoading}
                      onPress={onTransferPress}
                      style={{
                        backgroundColor: theme['color-basic-700']
                      }}
                    />
                  ) : null
                }
                {
                  band.admins.find((admin: UserAccount) => admin.id === item.id) ? (
                    <MenuItem
                      title='Remover admin'
                      accessoryLeft={getIcon('arrowhead-down-outline')}
                      disabled={isLoading}
                      onPress={onDemotePress}
                      style={{
                        backgroundColor: theme['color-basic-700']
                      }}
                    />
                  ) : (
                    <MenuItem
                      title='Tornar admin'
                      accessoryLeft={getIcon('arrowhead-up-outline')}
                      disabled={isLoading}
                      onPress={onPromotePress}
                      style={{
                        backgroundColor: theme['color-basic-700']
                      }}
                    />
                  )
                }
                <MenuItem
                  title='Remover'
                  accessoryLeft={getIcon('person-remove-outline')}
                  disabled={isLoading}
                  onPress={onRemovePress}
                  style={{
                    backgroundColor: theme['color-basic-700']
                  }}
                />
              </OverflowMenu>
            </ActionContainer>
          ) : null
        }
      </ItemLayout>
    </Wrapper>
  )
}

export default IntegrantItem