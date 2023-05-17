// Dependencies
import React from 'react'

// Components
import { Text } from '@ui-kitten/components'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { BaseContent } from '../../layouts'
import { Space } from '../../components'

// Styled components

// Page Main JSX
const SongsScreen = ({ navigation }) => (
  <BaseContent>
    <Text category="h5">
      Repertório público
    </Text>
    <Space my={1} />
    <Text category="s1">
      Pequise por músicas pulbicadas no app
    </Text>
  </BaseContent>
)

// Exporting page
export default SongsScreen