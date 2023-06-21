// Dependencies
import React from 'react'

// Types
import { IObservationType } from '../../../../../../domain'

// Components
import { Button, Text } from '@ui-kitten/components'

// Component props
interface IEditNote {
  isLoading?: boolean,
  item?: IObservationType,
  onCancel?: () => void,
  onGoBack?: () => void
  onSave?: () => void,
}

// Main component
const EditNote = ({
  isLoading = false,
  item,
  onCancel = () => {},
  onGoBack = () => {},
  onSave = () => {}
}: IEditNote): React.ReactElement => {
  // TSX
  return (
    <>
      <Text>Edit mode</Text>
      <Button
        onPress={item ? onCancel : onGoBack}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        onPress={onSave}
        disabled={isLoading}
      >
        Save
      </Button>
    </>
  )
}

export default EditNote