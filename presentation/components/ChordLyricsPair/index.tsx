// Dependencies
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

// Components
import ChordChart from '../ChordChart'
import { Popover, Text, useTheme } from '@ui-kitten/components'
import { TouchableOpacity, View } from 'react-native'

// Styled components
const PairContainer = styled(View)`
  display: flex;
  flex-direction: column;
`

const ChordText = styled(Text)`
  font-weight: bold;
  margin-right: 2px;
`

const ChartContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 8px;
`

const LyricsText = styled(Text)``

// Props
type IChordLyricsPair = {
  displayCharts?: boolean
  chordsData: {
    [key: string]: {
      positions: string[]
      fingerings: string[][]
    }[]
  }
  item: {
    lyrics: string
    transposed: string
  }
}

// Chord lyrics pair component
const ChordLyricsPair = 
({
  chordsData,
  displayCharts = false,
  item: {
    transposed,
    lyrics
  }
}: IChordLyricsPair) : React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const [ positions, setPositions ] = useState<string[]>([])
  const [ isVisible, setVisible ] = useState<boolean>(false)

  // Effects
  useEffect(() => {
    try {
      if (displayCharts && chordsData.hasOwnProperty(transposed.replace(/\s/g, ''))) {
        const chordObj = chordsData[transposed.replace(/\s/g, '')].find(() => true)
        if (chordObj != null) {
          setPositions(chordObj.positions)
        }
      }
    } catch (err) {}
  }, [transposed])

  const renderToggleButton = (chord: string): React.ReactElement => (
    <TouchableOpacity onPress={() => setVisible(true)}>
      <ChordText
        category="p1"
        style={{
          color: theme['color-secondary-500']
        }}
      >
        {chord}
      </ChordText> 
    </TouchableOpacity>
  )

  // TSX
  return (
    <PairContainer>
      {
        transposed ? (
          <Popover
            visible={isVisible}
            onBackdropPress={() => setVisible(false)}
            anchor={() => renderToggleButton(transposed.replace(/\s/g, ''))}
          >
            <ChartContainer>
              <ChordText
                category="p1"
                style={{
                  color: theme['color-secondary-500']
                }}
              >
                {transposed.replace(/\s/g, '')}
              </ChordText> 
              {
                displayCharts && positions ? (
                  <ChordChart
                    chord={positions}
                    showTuning
                  />
                ) : null
              }
            </ChartContainer>
          </Popover>
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