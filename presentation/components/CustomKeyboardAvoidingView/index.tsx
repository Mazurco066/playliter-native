// Dependencies
import React from 'react'
import {
  KeyboardAvoidingView as ReactNativeKeyboardAvoidingView,
  Platform
} from 'react-native'

// Component
const KeyboardAvoindingView = ({ children, ...rest }): React.ReactElement => {
  return (
    <ReactNativeKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      {...rest}
    >
      {children}
    </ReactNativeKeyboardAvoidingView>
  )
}

// Exporting component
export default KeyboardAvoindingView
