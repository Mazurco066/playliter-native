// Dependencies
import React from 'react'

// Types
import { UserAccount } from '../../../../domain'

// Components
import { Text } from '@ui-kitten/components'

// Component props
interface IIntegrantItem {
  item: UserAccount
}

// Component
const IntegrantItem = ({
  item
}: IIntegrantItem): React.ReactElement => {

  // TSX
  return (
    <Text category="s1">
      {item.name}
    </Text>
  )
}

export default IntegrantItem