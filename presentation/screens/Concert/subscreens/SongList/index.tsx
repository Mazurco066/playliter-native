// Dependencies
import React, { useCallback, useEffect, useState } from 'react'
import * as Print from 'expo-print'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import { shareAsync } from 'expo-sharing'
import { useRefreshOnFocus } from '../../../../hooks'
import { useConcertStore } from '../../../../../main/store'
import { getIcon } from '../../../../utils'
import { chordProSongtoHtml } from './pdf'

// Main API
import api from '../../../../../infra/api'

// Types
import { IConcert, ISong } from '../../../../../domain/models'

// Components
import { Button } from '@ui-kitten/components'
import { Platform, View } from 'react-native'
import { Songsheet } from '../../../../components'
import { BaseContent } from '../../../../layouts'

// Styled components
const SongControlContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

// Main Screen
const SongListScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item, itemId } = route.params

  // Hooks
  const { concert, setConcert } = useConcertStore()
  const [ songIndex, setSongIndex ] = useState<number>(0)
  const [ selectedPrinter, setSelectedPrinter ] = useState(null)

  // Http requests
  const {
    data: updatedItem,
    isLoading: isFetching,
    refetch: refetchItem
  } = useQuery(
    [`get-concert-${itemId}`],
    () => api.concerts.getConcert(itemId)
  )

  // Refetch on focus
  useRefreshOnFocus(refetchItem)

  // Effects
  useEffect(() => {
    setConcert(item ? { ...item, songs: [] } : null)
  }, [])

  useEffect(() => {
    if (updatedItem && updatedItem.data) {
      const { data } = updatedItem.data
      if (data) setConcert(data as IConcert)
    }
  }, [updatedItem])

  // Direct data
  const { songs } = concert

  // Actions
  const onPrevPress = useCallback(() => {
    const prevIndex: number = songIndex - 1
    setSongIndex((prevIndex < 0) ? (songs.length - 1) : prevIndex)
  }, [songIndex, setSongIndex])

  const onNextPress = useCallback(() => {
    const nextIndex: number = songIndex + 1
    setSongIndex((nextIndex > (songs.length - 1)) ? 0 : nextIndex)
  }, [songIndex, setSongIndex])

  // Print functions
  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html: chordProSongtoHtml(songs as ISong[]),
      printerUrl: selectedPrinter?.url, // iOS only
      width: 595, // A4 Size
      height: 842, // A4 Size,
      margins: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
      }
    })
  }

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({
      html: chordProSongtoHtml(songs as ISong[])
    })
    console.log('File has been saved to:', uri)
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' })
  }

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync() // iOS only
    setSelectedPrinter(printer)
    await print()
  }

  // TSX
  return (
    <BaseContent
      hideCardsNavigation
    >
      <SongControlContainer>
        <Button
          accessoryLeft={getIcon('rewind-left-outline')}
          size="tiny"
          appearance="outline"
          onPress={onPrevPress}
        >
          Anterior
        </Button>
        <Button
          accessoryLeft={getIcon('printer-outline')}
          size="tiny"
          onPress={() => {
            if (Platform.OS === 'ios') {
              selectPrinter()
            } else {
              printToFile()
            }
          }}
        >
          Exportar
        </Button>
        <Button
          accessoryLeft={getIcon('rewind-right-outline')}
          size="tiny"
          appearance="outline"
          onPress={onNextPress}
        >
          Próximo
        </Button>
      </SongControlContainer>
      <Songsheet
        song={songs[songIndex] as ISong}
        showHeaders
      />
    </BaseContent>
  )
}

export default SongListScreen