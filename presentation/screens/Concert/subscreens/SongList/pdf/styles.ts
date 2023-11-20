// PDF preview styles
export const pdfPreviewStyles: string = `
  @page {
    size: A4;
    margin: 0;
    padding: 0;
  }
  #ghost-preview {
    page-break-after: always;
  }
  #pdf-preview {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: #633FC4!important;
    border: 1px solid #633FC4!important;
    color: #FFFFFF!important;
    margin: auto;
    margin-top: 0!important;
    overflow: hidden;
    z-index: 0;
    -webkit-print-color-adjust:exact !important;
    print-color-adjust:exact !important;
  }
  .svg-container {
    position: absolute;
    height: 809px!important;
    width: 496px!important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1;
    right: 0;
    bottom: 0;
  }
  .svg-container img {
    object-fit: cover;
    height: 100%!important;
    width: 100%!important;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  .show-info {
    position: absolute;
    top: 16px;
    left: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-left: 16px;
    z-index: 3;
  }
  .credits-container {
    position: absolute;
    bottom: 8px;
    left: 16px;
    padding-left: 16px;
    z-index: 4;
  }
  .show-title {
    width: 500px!important;
    margin-bottom: 0 !important;
    font-size: 32px!important;
    color: #FFFFFF;
    text-transform: uppercase;
    text-align: left;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .band-info {
    color: #FFFFFF;
    margin-bottom: 0 !important;
    text-align: left;
    text-transform: uppercase;
    font-weight: bold;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .show-desc {
    margin-bottom: 0 !important;
    width: 300px!important;
    color: #FFFFFF;
    text-align: left;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .show-add-text {
    width: 450px!important;
    color: #FFFFFF;
    font-size: 14px;
    text-align: left;
    white-space: break-spaces;
    text-align: justify;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .credits {
    color: #FFFFFF;
    text-align: left;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .show-date strong,
  .credits strong {
    color: #FFFFFF;
  }
`


// PDF song styles
export const pdfPrintStyles: string = `
.printable-songsheet {
  page-break-after: always;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
  -moz-print-color-adjust: exact;
  -ms-print-color-adjust: exact;
  padding: 16px;
}
.song-artist,
.song-title {
  margin-bottom: 6px;
  display: block!important;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"
}
.song-title {
  font-weight: 700;
  text-transform: uppercase;
  color: #8257e5;
  font-size: 18px;
}
.song-artist {
  font-size: 16px;
}
.song-tone {
  display: block!important;
  margin-bottom: 0;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  font-size: 16px;
}
.song-tone string {
  color: #4963f7;
}
.column, .row {
  display: flex!important;
}
.song-section {
  width: 100%;
  max-width: 100%;
  display: block;
  overflow: hidden;
  overflow-x: auto;
}
.chord,.lyrics {
  max-height: 28px;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  white-space: pre;
  font-size: 16px;
}
.chord {
  margin-right: 4px;
  color: #4963f7;
  font-weight: bold;
  font-size: 16px;
}
.paragraph+.paragraph {
  margin-top: 16px
}
.row {
  flex-direction: row;
  align-items: flex-end;
  position: relative;
  break-inside: avoid;
  page-break-inside: avoid;
  font-size: 16px;
}
.column {
  flex-direction: column;
}
.comment {
  color: #cccccc;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"
}
.chorus:before,
.comment,
.verse::before {
  font-weight: 700;
  font-style: italic;
  break-after: avoid;
  page-break-inside: avoid;
}
.chord-sheet :not(.tab) .chord {
  color: #4963f7;
  font-weight: 700;
}
.chorus {
  border-left: 4px solid #8257e5;
  padding-left: 24px;
}
.chorus::before {
  content: "Refrão:";
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"
}
.verse::before {
  counter-increment: verse;
  content: "Verso " counter(verse) ":";
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"
}
.chord:after, .lyrics:after {
  content: '\\200b'
}
`