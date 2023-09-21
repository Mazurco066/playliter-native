// Dependencies
import ChordSheetJS, { ChordProFormatter, Song, Line } from 'chordsheetjs'
import { Chord } from 'chordsheetjs'
import { getUniquesTyped } from './getUniques'

// Ultimate guitar parser ex: Song verse or chorus
const ultimateGuitarParser = {
  name: 'ultimateguitar',
  pattern: /\[(Verse.*|Chorus)\]/i,
  parser: new ChordSheetJS.UltimateGuitarParser({ preserveWhitespace: false })
}

// Chordpro parser ex: [A]My song[E] goes like [G]this
const chordProParser = {
  name: 'chordpro',
  pattern: /{\w+:.*|\[[A-G].*\]/i,
  parser: new ChordSheetJS.ChordProParser()
}

// Chordsheet parser ex: Common lyrics like Cifra Club
const chordsheetParser = {
  name: 'chordsheet',
  pattern: /.*/,
  parser: new ChordSheetJS.ChordSheetParser({ preserveWhitespace: false })
}

// Parser format for multi parser
const songParsers = [ ultimateGuitarParser, chordProParser, chordsheetParser ]
const plainTextSongParsers = [ ultimateGuitarParser, chordsheetParser, chordProParser ]

function detectFormat (source: string) {
  if (!source) return
  return songParsers.find(({ pattern }) => source.match(pattern))?.parser
}

function detectPlainTextFormat (source: string) {
  if (!source) return
  return plainTextSongParsers.find(({ pattern }) => source.match(pattern))?.parser
}

export const detecteSongFormat = (lyrics: string = '') => {
  if (!lyrics) return 'none'
  const formattedLyrics = lyrics.replaceAll('<br>', '\n').replace(/\r\n/gm, '\n')
  const format = songParsers.find(({ pattern }) => formattedLyrics.match(pattern))?.name
  return format || 'none'
}

 export const plaintextToChordProFormat = (lyrics: string = '') => {
  try {

    // Chordsheetjs utils
    const normalizedSong = lyrics.replaceAll('<br>', '\n').replace(/\r\n/gm, '\n')
    const formatter = new ChordProFormatter()
    
    // Format song into html format
    const song: Song | undefined = detectPlainTextFormat(normalizedSong)?.parse(normalizedSong)
    if (!song) return

    // Return formatted song
    return formatter.format(song).toString()

  } catch (err) {
    console.log('[parse error]', err)
    return lyrics
  }
}

export const getUniqueChords = (lyrics = '', transpose = 0) => {
  try {

    // Chordsheetjs utils
    const song = lyrics.replace(/\r\n/gm, '\n')
    const chordsheetjsSong = detectFormat(song)?.parse(song)

    // Add transposed chord to song object
    const chords: any = {}
    chordsheetjsSong?.lines.forEach((line: Line) => {
      line.items.forEach((pair: any) => {
        if (pair.chords) {
          if (!chords[pair.chords]) {
            chords[pair.chords] = Chord.parse(pair.chords)
              ? Chord.parse(pair.chords).transpose(transpose).toString()
              : ''
          }
          pair.chords = chords[pair.chords]
        }
      })
    })

    // Retrieve song chords
    const allChordsGrouped: any = chordsheetjsSong?.lines.map(
      line => line.items.reduce((ac, cv: any) => cv.chords ? ac.concat(cv.chords.replace(/\s/g, '')) : ac , [])
    )

    // Filter chords
    const allChords = [].concat(...allChordsGrouped).filter(a => a)
    const uniqueChords = getUniquesTyped(allChords)
    return uniqueChords

  } catch (err) {
    console.log('[getUniqueChords]', err)
    return []
  }
}

export const getTransposedSong = (lyrics = '', transpose = 0) => {
  try {

    // Chordsheetjs utils
    const normalizedSong = lyrics.replace(/\r\n/gm, '\n')
    const song: Song | undefined = detectFormat(normalizedSong)?.parse(normalizedSong)
    if (!song) return
        
    // Add transposed chord to song object
    const chords: any = {}
    song.lines.forEach((line: Line) => {
      line.items.forEach((pair: any) => {
        if (pair.chords) {
          if (!chords[pair.chords]) {
            chords[pair.chords] = Chord.parse(pair.chords) ? Chord.parse(pair.chords).transpose(transpose).toString() : ''
          }
          pair.transposed = chords[pair.chords]
        }
      })
    })

    // Return modified song
    return song

  } catch (err) {
    console.log('[getTransposedSong]', err)
    return []
  }
}

export const overwriteBaseTone = (song: Song) => {
  try {

    // Chordsheetjs utils
    const formatter = new ChordProFormatter()

    // Update song object
    song.lines.forEach((line: Line) => {
      line.items.forEach((pair: any) => {
        if (pair.chords && pair.transposed) {
          pair.chords = pair.transposed
        }
      })
    })

    // Return updated song
    return formatter.format(song).toString()

  } catch (err) {
    console.log('[overwriteBasetone]', err)
    return {}
  }
}
