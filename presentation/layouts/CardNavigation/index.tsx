// Dependencies
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { navigationCards } from '../../utils'
import { MainStackParamList } from '../../../main/router'

// Components
import { View, FlatList } from 'react-native'
import { Card } from './elements'
import { Space } from '../../components'

// Main component
const CardNavigation = ({ ...rest }) => {
  // Hooks
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()

  // TSX
  return (
    <View {...rest}>
      <FlatList
        data={navigationCards}
        renderItem={({ item: { label, route = '', params = {} } }) => (
          <Card
            label={label}
            onPress={() => navigate('Bands', params)}
          />
        )}
        horizontal
        keyExtractor={(_, idx) => idx.toString()}
        ItemSeparatorComponent={() => <Space mx={1} />}
        ListHeaderComponent={() => <Space mx={2} />}
        ListFooterComponent={() => <Space mx={2} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

// Exporting card navigation
export default CardNavigation