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
import type {IMenu} from '../models/MenuTypes.js'
import {MenuTypes} from '../services/MenuService'

export const generatePdf = (
  groupedOrders: IOrder[],
  parsedGroups: IParsedGroup[],
  currentMenus: IMenu[],
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
  doc.text(`:: ${theTypes(parsedGroups, currentMenus)}`, 145, 35)
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
  doc.save(`ReporteSabroso_${theTypes(parsedGroups, currentMenus)}${format(currentDate + LocalHourFix, 'dd/MMM', {locale: esLocale})}.pdf`)
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

  const generateAutoTableBody = (mapped:any) => 
   Array.from(mapped, ([tag, summary]) => ({tag, summary}))
     .map(row => [ row.tag, row.summary.map(v => 
         (typeof v === 'number') && (v > 0 ? v : 0)
       ).filter(v => (v === 0) ? true : v).flat()
     ])
     .map(row => row.flat())
     .map(row => ([...row, row.slice(1).reduce((rtotal, o) => rtotal + o, 0)]))
    .sort((a,b)=> a[0].charCodeAt(0) - b[0].charCodeAt(0))
  
  const generateAutoTable = (mapped: any) => 
    Array.from(mapped, ([tag, summary]) => ({tag, summary}))
    .map(row => [
      row.tag, 
      row.summary
      .map((item ,index) => ((index + 1) % 2 === 0 ) && 
        (item > 0) && {gn: row.summary[index -1], value: item})
      .filter(i => i)
    ].flat()
  )

  const theTypes = (groups, menus) => {
    const menuTypes = Array.from(new Set(menus
      .filter(m => m.type?.length > 1)
      .map(m => MenuTypes.filter(mt => mt.code === m.type)[0]?.name)
    ))
    const printedMenuType = menuTypes.length > 1 ? "General" : menuTypes[0]
    const printedServiceType = groups[0]?.serviceType.name
    return `${printedMenuType}--${printedServiceType}`
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

  const relateTagAndMenu = (orders:IOrder[], currentMenus) => 
    orders
    .filter(o => o.status !== 'CANCELED')
    .map(o => o.details.length > 1 ?
      o.details.map(d => ({tag: d.tag, menuName: replaceMenuStr(d)})) : 
        [{tag: o.details[0].tag, menuName:replaceMenuStr(o.details[0])}]
      )
    .flat()
    .reduce((rmenus, menu) =>
      rmenus = {...rmenus, [menu.tag]: menu.menuName}
    , {})

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
    const theTable = {
      head: [head],
      body: rows
    }
    return theTable
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
      ].reduce((row, v) => v === 0 ? [...row, "-"] : [...row, v] ,[])
      f.push(goodRow)
    })
    //@ts-ignore
    return f.sort((a:any, b:any) => (a[0] > b[0]) - (a[0] < b[0]))
  }

