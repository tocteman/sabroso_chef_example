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
    // {text: 'Cronograma', linkUrl: '/addmenus'},
  ]
  return (
    <div>
      <div className="flex flex-col items-center justify-center block w-3/4 p-4 mx-auto mt-8">
      <img src={Logo}/>
      </div>
    <div className="flex flex-col px-8 pt-4">
      {navOptions.map((navOption: INavOption) => (
      <Link to={navOption.linkUrl}
        className="p-2 my-1 text-lg font-bold border-2 border-solid rounded cursor-pointer bg-crema-100 border-crema-300 hover:border-mostaza-300 hover:bg-white hover:shadow-sm"
        key={navOption.text}>
        {navOption.text}
      </Link>
      ))}
    </div>

    </div>
  )
}

export default NavigationSidebar
