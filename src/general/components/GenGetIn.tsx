import React, {Fragment, forwardRef} from 'react'
import { Transition } from "@headlessui/react";

const GenGetIn = (props, ref) => {


	 console.log({props})

	const {forwardedRef, ...rest} = props;
	return (
	<Transition
			ref={forwardedRef}
			show={props?.show || true}
			enter="transition ease-out duration-200"
			enterFrom="opacity-0 translate-y-1"
			enterTo="opacity-100 translate-y-0"
			leave="transition ease-in duration-150"
			leaveFrom="opacity-100 translate-y-0"
			leaveTo="opacity-0 translate-y-1"
			className="block w-full absolute z-20"
		>
		<div


		ref={ref} {...props}/>
		</Transition>

	)
}


export default forwardRef(GenGetIn)
