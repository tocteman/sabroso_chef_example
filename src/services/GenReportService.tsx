import React from 'react'
import jsPDF from 'jspdf'
import * as SourceSansProRegular from '../assets/fonts/scp/SourceSansPro-Regular-normal.js'
import * as SourceSansProBold from '../assets/fonts/scp/SourceSansPro-Bold-bold.js'

const blankPdf = () => {
  const doc = new jsPDF()
  doc.addFileToVFS(
    'SourceSansPro-Regular-normal.ttf',
    SourceSansProRegular.font,
  )
  doc.addFileToVFS('SourceSansPro-Bold-bold.ttf', SourceSansProBold.font)
  doc.addFont('SourceSansPro-Regular-normal.ttf', 'SourceSansPro', 'normal')
  doc.addFont('SourceSansPro-Bold-bold.ttf', 'SourceSansPro', 'bold')
  return doc
}

const pdfHeadStyles = () => ({
  fillColor: [255, 247, 247],
  textColor: [2, 2, 2],
  font: 'SourceSansPro',
  fontStyle: 'normal',
  fontSize: 12,
})

const pdfBodyStyles = () => ({
  fillColor: [255, 247, 247],
  textColor: [2, 2, 2],
  font: 'SourceSansPro',
  fontStyle: 'normal',
  fontSize: 12,
})

const pdfAlternateRowStyles = () => ({
  fillColor: [255, 255, 255],
})
