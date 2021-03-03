import React from 'react'

const Topbar = () => {
  return (
    <div className="py-2 bg-red-500 text-white w-full overflow-x-hidden flex flex-row-reverse">
      <div className="px-4 py-2 hover:shadow-sm rounded-lg hover:bg-red-300 bg-red-400 font-bold text-lg mr-6 cursor-pointer"
        onClick={() => {
          localStorage.clear()
          window && window.location.replace('login')
        }}>
        Salir
        </div>
    </div>
  )
}

export default Topbar
