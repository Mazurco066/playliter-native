// Dependencies
import React from 'react'

// Components
import { Text } from '@ui-kitten/components'
import { BaseContent } from '../../layouts'

// Styled components

// Page Main component
const ConcertScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item } = route.params

  // TSX
  return (
    <BaseContent>
      <Text>Concert - {item.title}</Text>
    </BaseContent>
  )
} 

// Exporting page
export default ConcertScreen