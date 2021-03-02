import React from 'react'
import "twin.macro"
import {atom, PrimitiveAtom, WritableAtom, useAtom, get, set} from 'jotai'
import type {ISliceRange} from 'src/models/UiTypes'
import ChevronLeft from '../../svgs/ChevronLeft'
import ChevronRight from '../../svgs/ChevronRight'


export const SliceRange = atom<ISliceRange>({from: 0, to:5})

const Paginator:React.FC<{count:number, atomRef:WritableAtom<any, any>}> = ({count, atomRef}) => {
  const [sliced, setSlice] = useAtom(atomRef)

  const handleSlicePrev = () => 
    sliced.from >= 5 && 
      setSlice({
        from: sliced.from-5,
        to:sliced.to-5
      })

  const handleSliceNext = () => 
    sliced.to <= count && 
      setSlice({
        from: sliced.from+5,
        to: sliced.to+5
      })

  const displayed = () => sliced.to < count ? sliced.to : count

  return (
    <div tw="flex items-center justify-between my-4 font-bold text-lg w-3/4">
      <div tw="flex items-baseline">
        <div tw="w-8 cursor-pointer hover:text-red-500" onClick={() => handleSlicePrev()}>
          <ChevronLeft/>
        </div>
        <div tw="w-8 cursor-pointer hover:text-red-500" onClick={() => handleSliceNext()}>
          <ChevronRight/>
        </div>
      </div>
        <div tw="font-normal text-sm">{`${displayed()} / ${count}`}</div>
    </div>
  )
}

export default Paginator
