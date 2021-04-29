import React, {Fragment} from 'react'
import { Transition } from "@headlessui/react";

const GenGetIn = React.forwardRef((props, ref) =>
	<Transition
			ref={ref}
			show={props?.show || true}
			as={Fragment}
			enter="transition ease-out duration-200"
			enterFrom="opacity-0 translate-y-1"
			enterTo="opacity-100 translate-y-0"
			leave="transition ease-in duration-150"
			leaveFrom="opacity-100 translate-y-0"
			leaveTo="opacity-0 translate-y-1"
		>
			{props.children}
		</Transition>
)



const GenGetInitial = (props) => {
	return (
		<Transition
			show={props?.show || true}
			as={Fragment}
			enter="transition ease-out duration-200"
			enterFrom="opacity-0 translate-y-1"
			enterTo="opacity-100 translate-y-0"
			leave="transition ease-in duration-150"
			leaveFrom="opacity-100 translate-y-0"
			leaveTo="opacity-0 translate-y-1"
		>
			{props.children}
		</Transition>
	)
}

export default GenGetIn
