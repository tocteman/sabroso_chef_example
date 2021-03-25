import React, {useEffect} from 'react' 
import * as SourceSansProRegular from '../assets/fonts/scp/SourceSansPro-Regular-normal.js'
import * as SourceSansProBold from '../assets/fonts/scp/SourceSansPro-Bold-bold.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import format from 'date-fns/format'
import { groupByGroupAndTag } from '../services/OrderService'
import type {IGroupAndQuantity, IOrder} from '../models/OrderTypes'
import type {IParsedGroup} from '../models/GroupTypes'
import { LocalHourFix } from '../utils/DateUtils'
import esLocale from 'date-fns/locale/es'
import {replaceMenuStr} from '../utils/StringUtils.jsx'

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
  retrieveGeneralTable(doc, mapped, currentMenus, parsedGroups)
  // // @ts-ignore
  doc.text(`Total: ${generateAutoTableBody(mapped).reduce((rtotal, row)=> rtotal + row.slice(-1)[0], 0)}`, 15, doc.lastAutoTable.finalY + 15)
  retrieveTagAndMenuTable(doc, groupedOrders, currentMenus)
  doc.setFontSize(14)
  doc.setFont('SourceSansPro', 'bold')
  doc.text(`Observaciones`, 15, 140)
  doc.setDrawColor(155, 155, 155)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(15, 150, 170, 70, 2, 2, 'FD')
  // // @ts-ignore
  doc.text("Recibido _____________________________", 15, 240)
  doc.save(`ReporteSabroso_${format(currentDate + LocalHourFix, 'dd/MMM', {locale: esLocale})}.pdf`)
    return doc
  }

    const retrieveGeneralTable = (docRef, mapData:Map<string, IGroupAndQuantity[]>, menus, parsedGroups) => {
   const tableContent = generateAutoTable(mapData)
   const table = printGroups(tableContent, parsedGroups)
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
      head: table.head,
      body: table.body
    })
  }

  const generateAutoTableBody = (map:any) => {
    const newBody = []
    map.forEach((v, k)=> {
      const newRow = []
      newRow.push(k)
      v.forEach((value, index:number) => (index+1) % 2 === 0 && newRow.push(value))
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

  const menustr = (detail) => replaceMenuStr(detail)
  

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
              tag: currentMenus.get(menustr(detail)),
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

  const generateAutoTable = (map:any) => {
    const t = []
    map.forEach((summary, tag) => {
      const newRow = [tag]
      summary.forEach((item, index) => {
        if ((index + 1) % 2 === 0) {
          if (item > 0) { newRow.push(
            { gn: summary[index-1], value: item}
          ) }
        }
      }) 
      t.push(newRow)
    })
    return t
  }

  const retrieveTotal = (m) => {
    let total = 0
    m.forEach((summary, tag) => {
     const nums = summary
        .map((s, i) => (i+1)%2 ===0 ? s : 0 )
        .reduce((t,n)=> t+n, 0)
      total += nums
    })
    return total
  }

  const printGroups = (t, parsedGroups) =>  {
    const ft = Array.from(new Set(t.flat().map(r => r.gn).filter(r => r)))
    const goodGroups = parsedGroups
      .filter(g => ft.includes(g.name))
      .map(g => g.name)
    const rows = printFoodRows(t, goodGroups)
    const head = ['Menú', ...goodGroups.sort(), 'Total']
    return  { head: [head], body: rows }
  }

  const printFoodRows = (t, goodGroups) => {
    const f = []
    t.forEach(tr => {
      const stringRow = tr.slice(1).map(tri => tri.gn)
      const withoutOrders = [goodGroups, stringRow].reduce((wos,gns)=> 
        wos.filter(g=> !gns.includes(g)))
      const emptyGroups = withoutOrders.map(w => ({gn: w, value: 0}))
      const goodVals = tr.slice(1).concat(emptyGroups) 
      // @ts-ignore
        .sort((a:any,b:any)=> (a.gn > b.gn) - (a.gn < b.gn))
        .map(s => s.value)
      const goodRow =  [
        tr.slice(0,1)[0],
        ...goodVals,
        tr.slice(1).reduce((qty, g)=> qty + g.value, 0)
      ]
      f.push(goodRow)
    })
    //@ts-ignore
    return f.sort((a:any, b:any) => (a[0] > b[0]) - (a[0] < b[0]))
  }



