import React from 'react'
import {atom, PrimitiveAtom, WritableAtom, useAtom } from 'jotai'
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
    <div className="flex items-center justify-beclassNameeen my-4 font-bold text-lg w-3/4">
      <div className="flex items-baseline">
        <div className="w-8 cursor-pointer hover:text-red-500" onClick={() => handleSlicePrev()}>
          <ChevronLeft/>
        </div>
        <div className="w-8 cursor-pointer hover:text-red-500" onClick={() => handleSliceNext()}>
          <ChevronRight/>
        </div>
      </div>
        <div className="font-normal text-sm">{`${displayed()} / ${count}`}</div>
    </div>
  )
}

export default Paginator
