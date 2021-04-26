import React from 'react'
import { RoughNotation } from 'react-rough-notation'

const RoughTitle = ({title, roughProps}) =>
	<RoughNotation
		strokeWidth={roughProps?.strokeWidth || 2}
		type="underline"
		color={'#fc8e5f'}
		show={true}
		animationDuration={500}
		iterations={1}
>
			<h2 className="my-8 text-3xl font-bold">{title}</h2>
		</RoughNotation>

export default RoughTitle
