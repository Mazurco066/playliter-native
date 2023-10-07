// Dependencies
import { Chord } from 'chordsheetjs'
import { Asset } from 'expo-asset'
import { getTransposedSong, formatISODate } from '../../../../../utils'
import { ISong } from '../../../../../../domain/models'
import { pdfPreviewStyles, pdfPrintStyles } from './styles'

// Method params
interface IPreviewData {
  title: string
  band: string
  date: string
  description: string
  dailyMessage?: string
}

// Converter function
export async function chordProSongtoHtml(songs: ISong[], pdfPreview?: IPreviewData): Promise<string> {
  let previewHtml = ''
  let songsHtml = ''

  // Loading preview asset
  const imageAsset = Asset.fromModule(require('../../../../../../assets/playliter-bg.png'))
  await imageAsset.downloadAsync() // Ensure the asset is downloaded

  // PDF Preview page
  if (pdfPreview) {
    previewHtml += `<div id="ghost-preview"><span>dummy</span></div><div id="pdf-preview"><div class="svg-container"><img src="${imageAsset.uri}" alt="PDF Preview" /></div><div class="show-info"><h3 class="show-title">${pdfPreview.title}</h3><h4 class="band-info">${pdfPreview.date} - ${pdfPreview.band}</h4><p class="show-desc">${pdfPreview.description}</p>`
    if (pdfPreview.dailyMessage) {
      previewHtml += `<p class="show-add-text">${pdfPreview.dailyMessage}</p>`
    }
    previewHtml += `</div><div class="credits-container"><p class="credits">PDF gerado pelo app <strong>Playliter</strong> em<strong> ${formatISODate(new Date().toISOString())}</strong></p></div></div>`        
  }

  // Mapping songs
  for (let i = 0; i < songs.length; i++) {
    // Transposing songs
    const transposed: any = getTransposedSong(songs[i].body, 0)
    const baseTone = songs[i].tone
    const key = Chord.parse(baseTone)
    const steps = []
    for (let j = 0; j <= 11; j++) {
      steps.push({
        step: j,
        name: key.transpose(j),
        label: key.transpose(j).toString()
      })
    }

    // Html data
    if (transposed) {
      songsHtml += `<div class="printable-songsheet"><div class="song-info" style="margin-bottom:1rem;"><h1 class="song-title">${transposed.title}</h1><span class="song-artist">Por: ${transposed.artist}</span><span class="song-tone"><small>Tom: <strong>${steps.find(t => t.step === 0)?.label}</strong></small></span></div><div class="song-section">`
      songsHtml += transposed.paragraphs.map(function (paragraph: any) {
        var paragraphHtml = '<div class="paragraph ' + paragraph.type + '">'
        paragraphHtml += paragraph.lines.map(function (line: any) {
          var lineHtml = '<div class="row">'
          if (line.hasRenderableItems()) {
            lineHtml += line.items.map(function (item: any) {
              var itemHtml = ''
              if (item.isRenderable()) {
                if (item.name === 'comment') {
                  itemHtml += '<div class="comment"><small>' + item.value + '</small></div>'
                } else {
                  itemHtml += '<div class="column">'
                  if (item.transposed) {
                    itemHtml += '<div class="chord">' + item.transposed.replace(/\s/g, '') + '</div>'
                  }
                  itemHtml += '<div class="lyrics">' + item.lyrics + '</div></div>'
                }
              }
              return itemHtml
            }).join('')
          }
          lineHtml += '</div>'
          return lineHtml
        }).join('')
        paragraphHtml += '</div>'
        return paragraphHtml
      }).join('')
      songsHtml += '</div></div>'
    }
  }

  // Unifing content
  const finalHtml = `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" /></head><style>${pdfPreviewStyles}${pdfPrintStyles}</style><body>${previewHtml}${songsHtml}</body></html>`

  // Returning html to print
  return finalHtml
}