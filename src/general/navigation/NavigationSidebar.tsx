import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/images/sabroso_chica.png'
interface INavOption {
  text: string;
  linkUrl: string
}

const NavigationSidebar = () => {
  const navOptions:INavOption[]  = [
    {text: 'Menús', linkUrl: '/menus'},
    {text: 'Comidas', linkUrl: '/meals'},
    {text: 'Órdenes', linkUrl: '/orders'},
    {text: 'Clientes', linkUrl: '/clients'},
  ]
  return (
    <div>
      <div className="w-3/4 mt-8 p-4 flex flex-col mx-auto block justify-center items-center">
      <img src={Logo}/>
      </div>
    <div className="flex flex-col px-8 pt-4">
      {navOptions.map((navOption: INavOption) => (
      <Link to={navOption.linkUrl}
        className="my-1 p-2 text-lg bg-crema-100 font-bold border-2 border-crema-300 hover:border-mostaza-300 cursor-pointer border-solid hover:bg-white rounded hover:shadow-sm"
        key={navOption.text}>
        {navOption.text}
      </Link>
      ))}
    </div>

    </div>
  )
}

export default NavigationSidebar
