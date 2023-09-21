// Dependencies
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getTransposedSong } from '../../utils'

// Types
import { ISong } from '../../../domain/models'

// Components
import ChordLyricsPair from '../ChordLyricsPair'
import { Text, useTheme } from '@ui-kitten/components'
import { View } from 'react-native'
import { Chord } from 'chordsheetjs'

// Styled components
const Paragraph = styled(View)`
  margin-top: 8px;
`

const ParagraphLines = styled(View)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  min-width: 100%;
  flex-wrap: wrap;
  break-inside: avoid;
  page-break-inside: avoid;
`

const ChorusContainer = styled(View)`
  padding-left: 8px;
  border-left-width: 3px;
  margin-bottom: 4px;
  margin-top: 4px;
`

const CommentText = styled(Text)`
  font-style: italic;
`

// Songsheet parameters
export interface ISongSheet {
  song: ISong,
  onToneUpdateSuccess?: () => void
}

// Songsheet component
const Songsheet = ({
  song,
  onToneUpdateSuccess = () => {}
}: ISongSheet): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const [ transpose, setTranspose ] = useState<number>(0)
  const [ transpositions, setTranspositions ] = useState<Array<any>>([])
  const [ chordsheet, setChordsheet ] = useState<any | null>(null)

  // Convert song to chordpro object
  useEffect(() => {
    const cs = getTransposedSong(song.body || '', transpose)
    setChordsheet(cs)
    const baseTone = song.tone
    const key = Chord.parse(baseTone)
    const steps = []
    for (let i = -11; i <= 11; i++) {
      steps.push({
        step: i,
        name: key.transpose(i)
      })
    }
    setTranspositions(steps)
  }, [song, transpose])

  // TSX
  return (
    <View>
      {
        chordsheet ? (
          <View>
            {/* Verse */}
            <View>
              {
                chordsheet.paragraphs.map((paragraph: any, i: number) => (
                  <Paragraph
                    key={paragraph.type + i}
                  >
                    {
                      paragraph.type.includes('chorus') ? (
                        <ChorusContainer
                          style={{
                            borderColor: theme['color-primary-500']
                          }}
                        >
                          {
                            paragraph.lines.map((line: any, idx: number) => (
                              <ParagraphLines
                                key={idx}
                              >
                                {
                                  line.hasRenderableItems() && (
                                    line.items.map((item: any, idx2: number) => (
                                      <View
                                        key={'inner-' + idx2}
                                      >
                                        {
                                          item.isRenderable() && (
                                            <>
                                              {
                                                item.name === 'comment' ? (
                                                  <CommentText
                                                    style={{
                                                      color: theme['color-basic-500']
                                                    }}
                                                  >
                                                    { item.value }
                                                  </CommentText>
                                                ) : (
                                                  <ChordLyricsPair
                                                    item={item}
                                                  />
                                                )
                                              }                                                
                                            </>
                                          )
                                        }
                                      </View>
                                    ))
                                  )
                                }
                              </ParagraphLines>
                            ))
                          }
                        </ChorusContainer>
                      ) : (
                        <View>
                          {
                            paragraph.lines.map((line: any, idx: number) => (
                              <ParagraphLines
                                key={idx}
                              >
                                {
                                  line.hasRenderableItems() && (
                                    line.items.map((item: any, idx2: number) => (
                                      <View
                                        key={'inner-' + idx2}
                                      >
                                        {
                                          item.isRenderable() && (
                                            <>
                                              {
                                                item.name === 'comment' ? (
                                                  <CommentText
                                                    style={{
                                                      color: theme['color-basic-500']
                                                    }}
                                                  >
                                                    { item.value }
                                                  </CommentText>
                                                ) : (
                                                  <ChordLyricsPair
                                                    item={item}
                                                  />
                                                )
                                              }                                                
                                            </>
                                          )
                                        }
                                      </View>
                                    ))
                                  )
                                }
                              </ParagraphLines>
                            ))
                          }
                        </View>
                      )
                    }
                  </Paragraph>
                ))
              }
            </View>
            {/* End of the verse */}
          </View>
        ) : null
      }
    </View>
  )
}

export default Songsheet