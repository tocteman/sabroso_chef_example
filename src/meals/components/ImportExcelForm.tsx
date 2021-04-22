import React from 'react'
import {useAtom} from 'jotai'
import { DisplayExcelImportPanel, importData} from '../../services/MealService'
import {ToastState} from '../../services/UiService'

const ImportExcelForm = () => {
  const [, setToastState] = useAtom(ToastState)
	const [displayPanel, setDisplayPanel] = useAtom(DisplayExcelImportPanel)
	const [excelMeals, setExcelMeals] = useAtom(ExcelMeals)

	const uploadFile = (file) => setExcelMeals(file)

	return (
		<div className="flex flex-col">
			<label></label>
			<input type="file" onChange={e => {uploadFile(e.target.files[0])}} accept=".xls, .xlsx"/>
		</div>
	)
}
