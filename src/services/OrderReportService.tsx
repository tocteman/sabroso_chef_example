import React, {useEffect} from 'react' 
import * as SourceSansProRegular from '../assets/fonts/scp/SourceSansPro-Regular-normal.js'
import * as SourceSansProBold from '../assets/fonts/scp/SourceSansPro-Bold-bold.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import format from 'date-fns/format'
import { groupByGroupAndTag } from '../services/OrderService'
import type {IOrder} from '../models/OrderTypes'
import type {IParsedGroup} from '../models/GroupTypes'
import { LocalHourFix } from '../utils/DateUtils'
import esLocale from 'date-fns/locale/es'

export const generatePdf = (
  groupedOrders: IOrder[],
  parsedGroups: IParsedGroup[],
  currentMenus: Map<string, string>,
  currentDate: number
) => {

  const mapped = new Map( 
    Object.entries(
      groupByGroupAndTag(
        groupedOrders, parsedGroups, currentMenus 
      )
    )
  )
  mapped.forEach((v, k)=> {  //@ts-ignore
    mapped.set(k, v.reduce(
      (rvalue, innerObj)=> rvalue.concat(Object.values(innerObj)) ,[])
    )
  })
  const doc = new jsPDF()
  doc.addFileToVFS('SourceSansPro-Regular-normal.ttf', SourceSansProRegular.font)
  doc.addFileToVFS('SourceSansPro-Bold-bold.ttf', SourceSansProBold.font)
  doc.addFont('SourceSansPro-Regular-normal.ttf', 'SourceSansPro', 'normal')
  doc.addFont('SourceSansPro-Bold-bold.ttf',  'SourceSansPro', 'bold')
  const img = new Image()
  img.src = 'https://sabroso-email-content.s3.amazonaws.com/sabroso_chica.png'
  doc.addImage(img, 'png', 15, 10, 30, 12)
  doc.setFont('SourceSansPro', 'bold')
  doc.text(format(currentDate + LocalHourFix, 'EEEE, dd MMMM yyyy', {locale: esLocale}), 15, 35)
  doc.setFontSize(12)
  doc.setFont('SourceSansPro', 'bold')
  retrieveGeneralTable(doc, mapped, currentMenus)
  // // @ts-ignore
  doc.text(`Total: ${generateAutoTableBody(mapped).reduce((rtotal, row)=> rtotal + row.slice(-1)[0], 0)}`, 15, doc.lastAutoTable.finalY + 7)
  retrieveTagAndMenuTable(doc, groupedOrders, currentMenus)
  doc.setFontSize(14)
  doc.setFont('SourceSansPro', 'bold')
  doc.text(`Observaciones`, 15, 126)
  doc.setDrawColor(155, 155, 155)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(15, 130, 170, 70, 2, 2, 'FD')
  // // @ts-ignore
  doc.text("Recibido _____________________________", 15, 240)
  doc.save(`ReporteSabroso_${format(currentDate + LocalHourFix, 'dd/MMM', {locale: esLocale})}.pdf`)
    return doc
  }

  const retrieveGeneralTable = (docRef, mapData, currentMenus) => {
    return autoTable(docRef, {
      headStyles: {
        fillColor: [240, 235, 235],
        textColor: [25, 25, 25],
        font: 'SourceSansPro',
        fontStyle: 'bold',
        fontSize: 12
      },
      bodyStyles: {
        fillColor: [255, 247, 247],
        textColor: [2, 2, 2],
        font: 'SourceSansPro',
        fontStyle: 'normal',
        fontSize: 12
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      columnStyles: {0: {fontStyle: 'bold'}},
      showHead: true,
      startY: 40,
      head: [generateAutoTableHead(mapData)],
      body: generateAutoTableBody(mapData)
    })
  }

  const generateAutoTableHead =(map: any) => {
    const newHead = ["Menú"]
    map.values().next().value.forEach((value, index)=> (index + 2) % 2 === 0 && newHead.push(value))
    newHead.push("Total")
    return newHead
  }

  const generateAutoTableBody = (map:any) => {
    const newBody = []
    map.forEach((v, k)=> {
      const newRow = []
      newRow.push(k)
      v.forEach((value, index)=> (index+1) % 2 === 0 && newRow.push(value))
      newRow.push(newRow.slice(1).reduce((rtotal, order)=> rtotal + order, 0))
      newBody.push(newRow)
    })
    return newBody.sort((a,b)=> a[0].charCodeAt(0) - b[0].charCodeAt(0))
  }

  const retrieveTagAndMenuTable = (docRef, orders, currentMenus) => {
    return autoTable(docRef, {
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [2, 2, 2],
        font: 'SourceSansPro',
        fontStyle: 'normal',
        fontSize: 12
      },
      alternateRowStyles: {
        fillColor: [255, 247, 257],
      },
      columnStyles: {0: {fontStyle: 'bold'}},
      startY: 90,
      showHead: false,
      body: Object.entries(relateTagAndMenu(orders, currentMenus)).sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0))
    })
  }

  const menustr = (menuString) => menuString.replace(/\s+,/g, ",")
  

  const relateTagAndMenu = (orders:IOrder[], currentMenus) => {
    console.log(currentMenus)
   const finalparse = []
    orders
    .map(o => ({...o, details: JSON.parse(o.details)}))
    .filter(order => order.status !== 'CANCELED')
    .forEach(parsedOrder => {
        parsedOrder.details.length>0 ?
          parsedOrder.details.forEach(detail =>
            finalparse.push({
              tag: currentMenus.get(menustr(`${detail.details}`)),
              menuName:menustr(`${detail.details}`)
            })
          ) :
        finalparse.push({
          tag: currentMenus.get(menustr(parsedOrder.details[0].details)),
          menuName: menustr(parsedOrder.details[0].details)
        })
      })
    return finalparse
    .reduce((rmenus, menu) =>
      rmenus = {...rmenus, [menu.tag]: menu.menuName}
     , {})
  }



