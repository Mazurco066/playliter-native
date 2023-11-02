// Dependencies
import React from 'react'
import styled from 'styled-components'
import * as ImagePicker from 'expo-image-picker'
import { getIcon } from '../../utils'

// Components
import { Avatar, Button, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'

// Styled components
const BandLogoContainer = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`

const BandLogoEditBtn = styled(Button)`
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 20px;
`

// Props
type IPhoneImagePicker = {
  uri: string
  isLoading?: boolean
  onImageSelect: (result: ImagePicker.ImagePickerResult) => void
}

// Component
const PhoneImagePicker = ({
  uri,
  isLoading = false,
  onImageSelect = () => {}
}: IPhoneImagePicker) => {
  // Hooks
  const theme = useTheme()

  // Actions
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false
    })
    if (!result.canceled && result.assets.length > 0) {
      onImageSelect(result)
    }
  }

  // TSX
  return (
    <BandLogoContainer>
      <Avatar
        source={{ uri }}
        size="giant"
      />
      <BandLogoEditBtn
        size="tiny"
        accessoryLeft={getIcon("edit-outline")}
        onPress={pickImage}
        disabled={isLoading}
        style={{
          backgroundColor: theme['color-secondary-500'],
          borderColor: theme['color-secondary-500']
        }}
      />
    </BandLogoContainer>
  )
}

export default PhoneImagePicker