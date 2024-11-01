import React from 'react'
import Clipboard from '../assets/clipboard.svg'

const EmptyTodos = () => {
  return (
    <div className='h-full flex flex-col justify-center align-middle items-center gap-4'>
        <img src={Clipboard} alt="clipboard" className="size-[56px]"/>
        <div>
            <p className='text-[#808080] font-bold'>Você ainda não tem tarefas cadastradas</p>
            <p className='text-[#808080] '>Crie tarefas e organize seus itens a fazer</p>
        </div>
    </div>
  )
}

export default EmptyTodos