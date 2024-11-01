import React, { useEffect, useState } from "react";
import TodoTile from "../../components/TodoTile";
import AddTodo from "../../components/AddTodo";
import logo from "../../assets/logo.svg";
import logoText from "../../assets/logotext.svg";
import { TODOS } from "../../constants";
import EmptyTodos from "../../components/EmptyTodos";

const Todos = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    setTodos(TODOS);
  }, []);

  return (
    <div>
      <div className="header h-[200px] bg-[#0d0d0d] flex justify-center align-middle items-center gap-3">
        <img src={logo} alt="Logo" />
        <img src={logoText} alt="Logo" />
      </div>
      <div className="w-[736px] mx-auto">
        <AddTodo />
        <div className=" flex flex-col gap-6">
          <div className="flex w-full justify-between text-sm font-bold">
            <div className="flex gap-2 items-center">
              <h4 className="text-[#4ea8de] ">Tarefas criadas</h4>
              <span className="bg-[#333] px-2 py-[2px] text-white font-bold text-xs rounded-full">
                0
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <h4 className="text-[#7b7dec] ">Concluídas</h4>
              <span className="bg-[#333] px-2 py-[2px] text-white font-bold text-xs rounded-full">
                0
              </span>
            </div>
          </div>
          <div className="py-16 border-t border-t-[#333]">
            {todos && todos.length
              ? todos.map((todo, index) => {
                  return <TodoTile key={index} todo={todo} />;
                })
              : <EmptyTodos />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todos;
