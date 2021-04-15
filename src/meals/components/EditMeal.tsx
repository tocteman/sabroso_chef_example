import {useAtom} from 'jotai'
import React from 'react'
import {CurrentMeal} from '../../services/MealService'

const EditMeal = () => {

  const [currentMeal] = useAtom(CurrentMeal)

  return (
    <div>

    </div>
  )
}

export default EditMeal
