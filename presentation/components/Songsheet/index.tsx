// Dependencies
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { getTransposedSong, overwriteBaseTone } from '../../utils'
import { useMutation } from '@tanstack/react-query'

// Types
import { SongPayloadDto } from '../../../domain/dto'
import { ISong } from '../../../domain/models'

// Main API
import api from '../../../infra/api'

// Components
import ChordLyricsPair from '../ChordLyricsPair'
import { Button, IndexPath, Select, SelectItem, Text, useTheme } from '@ui-kitten/components'
import { showMessage } from 'react-native-flash-message'
import { View } from 'react-native'
import { Chord } from 'chordsheetjs'

// Styled components
const Paragraph = styled(View)`
  margin-top: 8px;
  ${color}
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
  ${color}
`

const ChorusContainer = styled(View)`
  padding-left: 8px;
  border-left-width: 3px;
  margin-bottom: 4px;
  margin-top: 4px;
  ${color}
`

const TitleContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`

const SongTitle = styled(Text)`
  flex-grow: 1;
  max-width: 90%;
`

const SongMenu = styled(View)`
  flex: 0 0 auto;
`

const CommentText = styled(Text)`
  font-style: italic;
`

const SongControllHeaders = styled(View)`
  margin-bottom: 4px;
  ${color}
`

const SongHeaders = styled(View)`
  margin-bottom: 4px;
  ${color}
`

const ButtonContainer = styled(View)`
  flex-direction: row;
  gap: 8px;
`

const UpdateToneBtn = styled(Button)`
  margin-top: 8px;
`

// Songsheet parameters
export type ISongSheet = {
  children?: React.ReactElement | React.ReactElement[]
  song: ISong
  canUpdateBaseTone?: boolean
  isLoading?: boolean
  showControlHeaders?: boolean
  showHeaders?: boolean
  onToneUpdateSuccess?: () => void
}

// Songsheet component
const Songsheet = ({
  children,
  song,
  showControlHeaders = false,
  showHeaders = true,
  onToneUpdateSuccess = () => {},
  isLoading = false,
  canUpdateBaseTone = false
}: ISongSheet): React.ReactElement => {
  // Hooks
  const theme = useTheme()
  const [ transpositions, setTranspositions ] = useState<Array<any>>([])
  const [ chordsheet, setChordsheet ] = useState<any | null>(null)
  const [ selectedIndex, setSelectedIndex ] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0))

  // Http requests
  const { isLoading: isMutateLoading, mutateAsync } = useMutation(
    (data: SongPayloadDto) => api.songs.updateSong(data.id, { ...data })
  )

  // Convert song to chordpro object
  useEffect(() => {
    const transposeIndex = Number(selectedIndex.toString()) - 1
    const cs = getTransposedSong(song.body || '', transposeIndex)
    setChordsheet(cs)
    const baseTone = song.tone
    const key = Chord.parse(baseTone)
    const steps = []
    for (let i = 0; i <= 11; i++) {
      steps.push({
        step: i,
        name: key.transpose(i),
        label: key.transpose(i).toString()
      })
    }
    setTranspositions(steps)
  }, [song])

  useEffect(() => {
    const transposeIndex = Number(selectedIndex.toString()) - 1
    const cs = getTransposedSong(song.body || '', transposeIndex)
    setChordsheet(cs)
  }, [song, selectedIndex])

  // Actions
  const onUpdateTone = async () => {
    // Compute song key and transposed body
    const t = transpositions.find(t => t.step === Number(selectedIndex.toString()) - 1)
    const newTone = t.label
    const updatedSongBody = overwriteBaseTone(chordsheet)

    // Define requets payload
    const payload: SongPayloadDto = {
      id: song.id,
      title: song.title,
      writter: song.writter,
      tone: newTone,
      body: updatedSongBody,
      category: song.category.id,
      isPublic: song.isPublic
    }

    // Request api
    const response = await mutateAsync(payload)

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      onToneUpdateSuccess()
      showMessage({
        message: `Tom base da música alterado com sucesso!`,
        type: 'success',
        duration: 2000
      })

      // Update transpositions
      const baseTone = newTone
      const key = Chord.parse(baseTone)
      const steps = []
      for (let i = 0; i <= 11; i++) {
        steps.push({
          step: i,
          name: key.transpose(i),
          label: key.transpose(i).toString()
        })
      }
      setTranspositions(steps)
      setSelectedIndex(new IndexPath(0))

    } else {
      if ([400, 404].includes(response.status)) {
        showMessage({
          message: `Verifique se os parâmetros enviados para mudança de tom base estão corretos!`,
          type: 'warning',
          duration: 2000
        })
      } else if ([401, 403].includes(response.status)) {
        showMessage({
          message: `Você não permissão para alterar o tom base dessa música!`,
          type: 'warning',
          duration: 2000
        })
      } else {
        showMessage({
          message: `Ocorreu um erro ao alterar o tom base dessa música! Tente novamente mais tarde.`,
          type: 'danger',
          duration: 2000
        })
      }
    }
  }

  // TSX
  return (
    <View>
      {
        chordsheet ? (
          <View>
            {
              showHeaders && showControlHeaders ? (
                <SongControllHeaders>
                  <TitleContainer>
                    <SongTitle
                      category="h5"
                    >
                      {song.title}
                    </SongTitle>
                    <SongMenu>
                      {children}
                    </SongMenu>
                  </TitleContainer>
                  <Text
                    category="s1"
                    style={{
                      color: theme['color-secondary-500'],
                      fontWeight: "bold"
                    }}
                  >
                    {chordsheet.artist}
                  </Text>
                  <Select
                    selectedIndex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}
                    size="small"
                    style={{ marginTop: 4 }}
                    value={transpositions.find(t => t.step === Number(selectedIndex.toString()) - 1)?.label}
                  >
                    {
                      transpositions.map((t: any, i: number) => (
                        <SelectItem
                          key={i}
                          title={t.label}
                        />
                      ))
                    }
                  </Select>
                  {
                    selectedIndex.toString() != '1' && canUpdateBaseTone ? (
                      <ButtonContainer>
                        <UpdateToneBtn
                          size="tiny"
                          onPress={onUpdateTone}
                          disabled={isMutateLoading || isLoading}
                        >
                          Atualizar tom base
                        </UpdateToneBtn>
                      </ButtonContainer>
                    ) : null
                  }
                </SongControllHeaders>
              ) : null
            }
            { // Song default headers
              showHeaders && !showControlHeaders ? (
                <SongHeaders>
                  <TitleContainer>
                    <SongTitle
                      category="h5"
                    >
                      {chordsheet.title}
                    </SongTitle>
                    <SongMenu>
                      {children}
                    </SongMenu>
                  </TitleContainer>
                  <Text
                    category="s1"
                    style={{
                      color: theme['color-secondary-500'],
                      fontWeight: "bold"
                    }}
                  >
                    {chordsheet.artist}
                  </Text>
                  <Text
                    category="c1"
                  >
                    Tom: <Text
                      style={{
                        color: theme['color-primary-500'],
                        fontWeight: 'bold'
                      }}
                      category="c1"
                    >{song.tone}</Text>
                  </Text>
                </SongHeaders>
              ) : null
            }
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