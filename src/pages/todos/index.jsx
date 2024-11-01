import React from 'react'
import TodoTile from '../../components/TodoTile'
import AddTodo from '../../components/AddTodo'

const Todos = () => {
  return (
    <div>
      <AddTodo />
      <TodoTile />
    </div>
  )
}

export default Todos