// Dependencies
import React from 'react'
import styled from 'styled-components'

// Components
import { Text, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'

// Styled components
const PairContainer = styled(View)`
  display: flex;
  flex-direction: column;
`

const ChordText = styled(Text)`
  font-weight: bold;
  margin-right: 2px;
`

const LyricsText = styled(Text)``

// Props
type IChordLyricsPair = {
  item: {
    lyrics: string
    transposed: string
  }
}

// Chord lyrics pair component
const ChordLyricsPair = ({
  item: {
    transposed,
    lyrics
  }
}: IChordLyricsPair) : React.ReactElement => {
  // Hooks
  const theme = useTheme()

  // TSX
  return (
    <PairContainer>
      {
        transposed ? (
          <ChordText
            category="p1"
            style={{
              color: theme['color-secondary-500']
            }}
          >
            {transposed.replace(/\s/g, '')}
          </ChordText>
        ) : null
      }
      <LyricsText
        category="p1"
      >
        {lyrics}
      </LyricsText>
    </PairContainer>
  )
}

export default ChordLyricsPair