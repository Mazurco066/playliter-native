// Dependencies
import React from 'react'
import { View } from 'react-native'
import { space } from 'styled-system'
import styled from 'styled-components'

// Component styles
const StyledSpace = styled(View)`
  ${space}
`

// Component TSX
const Space = (props: any) => <StyledSpace {...props} />

// Exporting component
export default Space