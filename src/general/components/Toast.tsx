import {useAtom} from 'jotai'
import React from 'react'
import {ToastState} from '../../services/UiService'
import { RoughNotation } from "react-rough-notation";

const Toast = () => {
  const [toastState, setToastState] = useAtom(ToastState)
  React.useEffect(() => {
    setTimeout(() => setToastState({message: "", status: "hidden"}), 2000) 
  }, [])
  return (
    <RoughNotation strokeWidth={2} 
      type="highlight" 
      color={`${toastState.status === `ok` ? `#9ffca5` : `#9b3720` }`}
      show={true}
      animationDuration={300}
      iterations={1}
    >
    <div className={`mx-auto text-xl font-bold px-8 py-2 ${toastState.status === `error` ? `text-white ` : `text-black` }`}>
      {toastState.message}
    </div>
  </RoughNotation>
  )
}

export default Toast
