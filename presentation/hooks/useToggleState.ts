// Dependencies
import { useState } from 'react'
import { ToggleProps } from '@ui-kitten/components'

// Custom hook
export function useToggleState(initialState: boolean = false): ToggleProps {

  // Checked state
  const [ checked, setChecked ] = useState<boolean>(initialState)

  // On check check
  const onCheckChange = (isChecked: boolean): void => {
    setChecked(isChecked)
  }

  // Return toggle state
  return { checked, onChange: onCheckChange }
}