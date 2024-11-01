import { div } from 'framer-motion/client'
import React from 'react'
import { HiOutlineTrash } from "react-icons/hi";

const TodoTile = ({todo}) => {
  return (
    <div>
      <div className='h-[72px] bg-[#262626] flex gap-x-[12px] px-[16px] py-[16px]'>
        < input type="checkbox" className='rounded-full'/>
        <h3>
        Integer urna interdum massa libero auctor neque turpis turpis semper. Duis vel sed fames integer.
          </h3>
        <HiOutlineTrash />
      </div>
    </div>
  )
}

export default TodoTile