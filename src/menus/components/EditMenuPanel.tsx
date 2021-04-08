import React from 'react'
import {useLocalStorage} from 'src/utils/LocalStorageHook'

const EditMenuPanel = () => {
  const [cu] = useLocalStorage('user', '')
  
  return (
    <div>

    </div>
  )
}

export default EditMenuPanel
