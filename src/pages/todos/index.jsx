import { useEffect, useState } from "react";
import TodoTile from "../../components/TodoTile";
import AddTodo from "../../components/AddTodo";
import logo from "../../assets/logo.svg";
import logoText from "../../assets/logotext.svg";
import EmptyTodos from "../../components/EmptyTodos";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { updateTodoStatus, deleteTodo, addTodo } from "../../dbFunctions";
import TodoTileSkeleton from "../../components/TodoTileSkeleton";
import { motion, AnimatePresence } from "framer-motion";
const skeletons = [1, 2, 3];

const Todos = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //fetch user's todos in firestore
  const fetchTodos = async () => {
    setLoading(true);
    const db = getFirestore();
    const q = query(collection(db, "todos"), where("userId", "==", user.id));
    try {
      const querySnapshot = await getDocs(q);
      const userTodos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Todos--->", userTodos);
      setTodos(userTodos);
    } catch (error) {
      console.log("Error fetching todos", error);
      toast.error("Error fetching Todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleFirebaseLogout = async () => {
    setLoading(true);
    const auth = getAuth();
    try {
      await signOut(auth);
      dispatch({
        type: "LOGOUT",
        payload: null,
      });
      toast.success("Successfully logged out");
      navigate("/");
    } catch (error) {
      console.error("Error logging out", error);
      toast.error("Error logging out");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCompletedCount((prev) => todos?.filter((todo) => todo.completed).length);
  }, [todos]);

  const handleUpdateTodo = async (userId, todoId, isCompleted) => {
    setUpdateLoading(true);
    try {
      await updateTodoStatus(userId, todoId, isCompleted);
      toast.success("Todo successfully updated!");

      setTodos((prev) => {
        const index = prev.findIndex((item) => item.id === todoId);
        const todo = prev.find((t) => t.id === todoId);
        return prev.with(index, { ...todo, completed: isCompleted });
      });
    } catch (error) {
      console.error("Error updating todo", error);
      toast.error("Error updating todo");
    } finally {
      setUpdateLoading(false);
    }
  };
  const handleDeleteTodo = async (todoId) => {
    if (window.confirm("Are you sure you want to delete todo?")) {
      setDeleteLoading(true);
      try {
        await deleteTodo(todoId);
        toast.success("Todo successfully deleted");
        setTodos((prev) => prev.filter((item) => item.id !== todoId));
      } catch (error) {
        console.error("Error deleting todo", error);
        toast.error("Error deleting todo");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleTodoAdd = async (
    title,
    description,
    completed,
    userId,
    deadline
  ) => {
    setAddLoading(true);
    try {
      await addTodo(title, description, completed, userId, deadline);
      toast.success("Todo added successfully");
      // const newTodos = todos;
      // newTodos.unshift({ title, description, completed, userId, deadline });
      // setTodos(newTodos);
      await fetchTodos();
    } catch (error) {
      console.error("Error adding todo", error);
      toast.error("Error adding todo");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header section */}
      <div className="flex justify-between bg-[#0d0d0d] items-center p-4 sm:pt-5 sm:px-5">
        <div className="flex items-center gap-2 px-3 py-2 text-white rounded-md hover:bg-[#555] text-sm sm:px-4 sm:py-2">
          <FaUser />
          {user.name}
        </div>
        <button
          onClick={handleFirebaseLogout}
          className="flex items-center gap-2 px-3 py-2 bg-[#333] text-white rounded-md hover:bg-[#555] text-sm sm:px-4 sm:py-2"
          disabled={loading}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Logo section */}
      <div className="h-[150px] w-full bg-[#0d0d0d] flex justify-center items-center gap-3 sm:h-[200px]">
        <img src={logo} alt="Logo" className="sm:w-auto" />
        <img src={logoText} alt="Logo Text" className=" sm:w-auto" />
      </div>

      {/* Main content area */}
      <div className="w-full px-4 max-w-[736px] sm:mx-auto">
        <AddTodo addTodo={handleTodoAdd} loading={addLoading} />

        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Todos Summary */}
          <div className="flex justify-between text-xs font-bold sm:text-sm">
            <div className="flex gap-2 items-center">
              <h4 className="text-[#4ea8de]">Tarefas criadas</h4>
              <span className="bg-[#333] px-2 py-[2px] text-white font-bold text-xs rounded-full">
                {todos.length}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <h4 className="text-[#7b7dec]">Concluídas</h4>
              <span className="bg-[#333] px-2 py-[2px] text-white font-bold text-xs rounded-full">
                {completedCount}
              </span>
            </div>
          </div>

          {/* Todos List */}
          <div className="py-8 border-t border-t-[#333] flex flex-col w-full gap-3 sm:py-16">
            {loading ? (
              skeletons.map((s, i) => <TodoTileSkeleton key={i} />)
            ) : todos && todos.length ? (
              <AnimatePresence>
                {todos.map((todo, index) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TodoTile
                      key={index}
                      todo={todo}
                      updateTodoStatus={handleUpdateTodo}
                      deleteTodo={handleDeleteTodo}
                      updateLoading={updateLoading}
                      deleteLoading={deleteLoading}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <EmptyTodos />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todos;
