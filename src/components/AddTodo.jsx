import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";

function AddTodo({ addTodo, loading }) {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState(""); // New state for deadline
  const { user } = useSelector((state) => ({ ...state }));

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (task.trim() && deadline) {
      // Ensure deadline is set
      const title = task;
      const description = "todo";
      const completed = false;
      const userId = user.id;
      addTodo(title, description, completed, userId, deadline);
      setTask(""); // Clear task input
      setDeadline(""); // Clear deadline input
    }
  };

  return (
    <form
      onSubmit={handleCreateTask}
      className="flex items-center rounded-lg w-full h-[54] -mt-6 mb-10 gap-2 justify-start"
    >
      <input
        type="text"
        name="title"
        placeholder="Adicione uma nova tarefa"
        value={task} // Bind input to task state
        onChange={(e) => setTask(e.target.value)} // Update task state on input change
        className="flex-1 p-2 text-white bg-[#262626] placeholder-[#808080] rounded-md outline-none focus:ring-2 focus:ring-blue-500 h-[54px]"
      />
      <input
        type="datetime-local" // Input type for date and time
        name="deadline"
        value={deadline} // Bind input to deadline state
        onChange={(e) => setDeadline(e.target.value)} // Update deadline state on input change
        className="p-2 text-white bg-[#262626] placeholder-[#808080] rounded-md outline-none focus:ring-2 focus:ring-blue-500 h-[54px]"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex bg-[#1e6f9f] text-white p-4 rounded-md transition duration-300 gap-x-2 text-sm font-bold items-center"
      >
        {loading ? "loading" : "Criar"}
        <IoIosAddCircleOutline className="h-[16px] w-[16px]" />
      </button>
    </form>
  );
}

export default AddTodo;
