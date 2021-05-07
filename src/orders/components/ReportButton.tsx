import React from 'react'
import { CurrentMenuType, MenuTypes } from '../../services/MenuService'
import { generatePdf } from '../../services/OrderReportService'
import { useAtom } from 'jotai'

const ReportButton = ({wkId, date, orders, menus, groups, serviceType }) => {

	const [currentMenuType] = useAtom(CurrentMenuType)


  const pdfGen = () => {
    if (serviceType === 'ALL') {
      Array.from(new Set(groups.map(g => g.serviceType.name)))
        .forEach(gst => {
          const stGroups = groups.filter(g => g.serviceType.name === gst)
          const stGroupsIds = stGroups.map(g => g.id)
          const stOrders = orders.filter(o => stGroupsIds.includes(o.groupId))
          if (stOrders.length > 0 ) return generatePdf(stOrders, stGroups, menus, date)
        })
    } else {
      return generatePdf (orders, groups, menus, date)
    }
  }


	const menuType = () => {
		if (currentMenuType === 'BREAKFAST' || currentMenuType === 'DINNER') {
		return MenuTypes.filter(m => m.code === currentMenuType)[0]
		} else {
			return MenuTypes.filter(m => m.code === 'LUNCH')[0]
		}
	}

	const isHourOk = (now) => now.getHours() <= menuType().maxHourTime ?
											false : true

	const checkDownloadTime = () => {
		console.log({date})
		const selectedDate = new Date(date) // <-- el día
		const now = new Date()
		return now.getDate() < selectedDate.getDate() ? true :
					 now.getDate() === selectedDate.getDate() ? isHourOk(now) :
					 false
		}


	return (
		<div className="mt-1">
			<button onClick={()=> pdfGen()}
				className={`main-button
				${checkDownloadTime() ?
					`cursor-pointer ` :
					`cursor-not-allowed opacity-50`}`}
			>
				Descargar Reporte
			</button>

		</div>
	)
	}


export default ReportButton
