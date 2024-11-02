import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";

function AddTodo({ addTodo, loading }) {
  const [task, setTask] = useState("");
  const { user } = useSelector((state) => ({ ...state }));

  const handleCreateTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const description = "todo";
    const completed = false;
    const userId = user.id;
    addTodo(title, description, completed, userId);
    if (task.trim()) {
      setTask("");
    }
  };

  return (
    <form
      onSubmit={handleCreateTask}
      className="flex flex-col sm:flex-row items-center rounded-lg w-full h-[54] -mt-6 mb-10 gap-2 justify-start"
    >
      <input
        type="text"
        name="title"
        placeholder="Adicione uma nova tarefa"
        className="flex-1 p-2 text-white bg-[#262626] placeholder-[#808080] rounded-md outline-none focus:ring-2 focus:ring-blue-500 h-[54px]"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex bg-[#1e6f9f]  text-white p-4 rounded-md transition duration-300  gap-x-2 text-sm font-bold items-center"
      >
        {loading? "loading": "Criar"}
        <IoIosAddCircleOutline className="h-[16px] w-[16px]" />
      </button>
    </form>
  );
}

export default AddTodo;
