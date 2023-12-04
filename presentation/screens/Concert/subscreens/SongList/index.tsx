// Dependencies
import React, { useCallback, useEffect, useState } from 'react'
import * as Print from 'expo-print'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import { shareAsync } from 'expo-sharing'
import { useRefreshOnFocus } from '../../../../hooks'
import { useConcertStore } from '../../../../../main/store'
import { getIcon, formatISODate } from '../../../../utils'
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

  const {
    data: colorData,
    isLoading: isColorLoading,
    refetch: refetchColor
  } = useQuery(
    [`get-liturgy-${itemId}`],
    () => api.helpers.getLiturgyColor(itemId)
  )

  // Refetch on focus
  useRefreshOnFocus(refetchItem)
  useRefreshOnFocus(refetchColor)

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
  const print = async (color: string) => {
    const htmlContent = await chordProSongtoHtml(songs as ISong[], color, {
      title: concert.title,
      band: concert.band.title,
      date: formatISODate(concert.date),
      description: concert.description,
      dailyMessage: concert.observations.find(obs => obs.title.includes('Evangelho'))?.data || null
    })
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html: htmlContent,
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

  const printToFile = async (color: string) => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const htmlContent = await chordProSongtoHtml(songs as ISong[], color, {
      title: concert.title,
      band: concert.band.title,
      date: formatISODate(concert.date),
      description: concert.description,
      dailyMessage: concert.observations.find(obs => obs.title.includes('Evangelho'))?.data || null
    })
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      width: 595, // A4 Size
      height: 842, // A4 Size,
      margins: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
      }
    })
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' })
  }

  const selectPrinter = async (color: string) => {
    const printer = await Print.selectPrinterAsync() // iOS only
    setSelectedPrinter(printer)
    await print(color)
  }

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <SongControlContainer>
        <Button
          accessoryLeft={getIcon('rewind-left-outline')}
          size="tiny"
          appearance="outline"
          disabled={isFetching}
          onPress={onPrevPress}
        >
          Anterior
        </Button>
        <Button
          accessoryLeft={getIcon('printer-outline')}
          size="tiny"
          disabled={isFetching || isColorLoading}
          onPress={async () => {
            const liturgyColor = colorData?.data?.data?.color || 'purple'
            try {
              if (Platform.OS === 'ios') {
                await selectPrinter(liturgyColor)
              } else {
                await printToFile(liturgyColor)
              }
            } catch (error) {
              console.log('[export error]', error)
            }
          }}
        >
          Exportar
        </Button>
        <Button
          accessoryLeft={getIcon('rewind-right-outline')}
          size="tiny"
          appearance="outline"
          disabled={isFetching}
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