import React from 'react'
import {useAtom} from 'jotai'
import { Link, useHistory } from 'react-router-dom'
import Logo from '../../assets/images/sabroso_chica.png'
import {SidebarState} from '../../services/UiService'
interface INavOption {
  text: string;
  linkUrl: string
}

const NavigationSidebar = () => {

  const [, setOpen] = useAtom(SidebarState)
	const history = useHistory()

	const navigateTo = path => {
		window.innerWidth < 640 && setOpen(false)
		history.push(path)
	}

  const navOptions:INavOption[]  = [
    {text: 'Menús', linkUrl: '/menus'},
    {text: 'Comidas', linkUrl: '/meals'},
    {text: 'Órdenes', linkUrl: '/orders'},
    {text: 'Clientes', linkUrl: '/clients'},
    /* {text: 'Cronogramas', linkUrl: '/schedules'}, */
  ]

  return (
		<div>
			<div className="flex flex-col items-center justify-center block w-3/4 p-4 mx-auto mt-8">
				<img src={Logo}/>
			</div>
			<div className="flex flex-col px-8 pt-4">
				{navOptions.map((navOption: INavOption) => (
					<div
						onClick={() => navigateTo(navOption.linkUrl)}
						className="p-2 my-1 text-lg font-bold border-2 border-solid rounded cursor-pointer bg-crema-100 border-crema-300 hover:border-mostaza-300 hover:bg-white hover:shadow-sm"
						key={navOption.text}>
						{navOption.text}
					</div>
				))}
			</div>

		</div>
	)
}

export default NavigationSidebar
