// PDF preview styles

// PDF song styles
export const pdfPrintStyles: string = `
.printable-songsheet {
  page-break-after: always;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
  -moz-print-color-adjust: exact;
  -ms-print-color-adjust: exact;
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
  margin-right: 2px;
  color: #4963f7;
  font-weight: bold;
}
.paragraph+.paragraph {
  margin-top: 16px
}
.row {
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
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