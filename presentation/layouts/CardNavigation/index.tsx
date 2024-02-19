// Dependencies
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { getNavigationCards } from '../../utils'
import { MainStackParamList } from '../../../main/router'

// Components
import { View, FlatList } from 'react-native'
import { Card } from './elements'
import { Space } from '../../components'

// Main component
const CardNavigation = ({ ...rest }): React.ReactElement => {
  // Hooks
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const { t } = useTranslation()

  // Card translated data
  const cardsData = getNavigationCards(
    t('components.card_home'),
    t('components.card_bands'),
    t('components.card_songs'),
    t('components.card_profile')
  )

  // TSX
  return (
    <View {...rest}>
      <FlatList
        data={cardsData}
        renderItem={({ item: {
          icon,
          label,
          route = '',
          params = {}
        } }) => (
          <Card
            icon={icon}
            label={label}
            route={route}
            onPress={() => navigate(route, params)}
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