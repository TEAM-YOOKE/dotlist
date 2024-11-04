import { div } from 'framer-motion/client'
import React from 'react'
import { HiOutlineTrash } from "react-icons/hi";
import { useSelector } from 'react-redux';

const TodoTile = ({ todo, updateTodoStatus, deleteTodo }) => {
  const { user } = useSelector((state) => ({ ...state }));
  return (
    <div>
      <div className=' rounded-lg bg-[#262626] flex items-center gap-x-[12px] p-[16px] justify-between'>
        <div className='flex align-top  gap-x-[12px]'>
        <input
  onChange={(e) => updateTodoStatus(user.id, todo.id, e.target.checked)}
  checked={todo.completed}
  type="checkbox"
  className="w-[17px] h-[17px] appearance-none rounded-full border-2 border-[#585abd] bg-transparent checked:bg-[#585abd] checked:border-transparent focus:outline-none transition-all duration-200 relative
             checked:after:content-['\2713'] checked:after:text-white checked:after:text-[10px] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
/>



         


          <h3 className={`text-gray-100 text-sm ${todo.checked ? "underlined": ""}`} >
            {todo.title}
          </h3>

        </div>
        <button onClick={() => deleteTodo(todo.id)}> <HiOutlineTrash className='w-[14px] h-[14px] stroke-gray-500' /></button>
      </div>
    </div >
  )
}

export default TodoTile