import { div } from 'framer-motion/client'
import React from 'react'
import { HiOutlineTrash } from "react-icons/hi";
import { useSelector } from 'react-redux';

const TodoTile = ({ todo, updateTodoStatus, deleteTodo }) => {
  const { user } = useSelector((state) => ({ ...state }));
  return (
    <div>
      <div className='h-[72px] bg-[#262626] flex gap-x-[12px] px-[16px] py-[16px] justify-between items-start'>
        <div className='flex items-start gap-x-[12px]'>
          <input
            onChange={(e) => updateTodoStatus(user.id, todo.id, e.target.checked)}
            checked={todo.completed}
            type="checkbox"
            className="w-[24px] h-[24px] appearance-none rounded-full border-2 border-blue-500 bg-transparent checked:bg-blue-500 checked:border-transparent focus:outline-none transition-all duration-200 "
          />

          <h3 className={`text-gray-100 ${todo.checked && underline}`} >
            {todo.title}
          </h3>

        </div>
       <button onClick={() => deleteTodo(todo.id)}> <HiOutlineTrash className='w-[24px] h-[24px] stroke-gray-500' /></button>
      </div>
    </div >
  )
}

export default TodoTile