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

const skeletons = [1, 2, 3];

const Todos = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
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

  // Count Completed Todos
  const completedCount = todos.filter((todo) => todo.completed).length;

  const handleUpdateTodo = async (userId, todoId, isCompleted) => {
    setUpdateLoading(true);
    try {
      const updatedTodo = await updateTodoStatus(userId, todoId, isCompleted);
      toast.success("Todo successfully updated!");
      console.log(updatedTodo);
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
      setLoading(true);
      try {
        await deleteTodo(todoId);
        toast.success("Todo successfully deleted");
        await fetchTodos();
      } catch (error) {
        console.error("Error deleting todo", error);
        toast.error("Error deleting todo");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTodoAdd = async (title, description, completed, userId) => {
    setLoading(true);
    try {
      await addTodo(title, description, completed, userId);
      toast.success("Todo added successfully");
      await fetchTodos();
    } catch (error) {
      console.error("Error adding todo", error);
      toast.error("Error adding todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen">
      <div className="flex justify-between  bg-[#0d0d0d] align-middle items-center pt-5 px-5">
        <div className="flex items-center gap-2 px-4 py-2  text-white rounded-md hover:bg-[#555]">
          <FaUser />
          {user.name || user.name}
        </div>
        <button
          onClick={handleFirebaseLogout}
          className="flex items-center gap-2 px-4 py-2 bg-[#333] text-white rounded-md hover:bg-[#555]"
          disabled={loading}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
      <div className=" h-[200px] w-screen bg-[#0d0d0d] flex  justify-center align-middle items-center gap-3">
        <img src={logo} alt="Logo" />
        <img src={logoText} alt="Logo" />
      </div>
      <div className="w-[736px] mx-auto">
        <AddTodo addTodo={handleTodoAdd} />
        <div className=" flex flex-col gap-6">
          <div className="flex w-full justify-between text-sm font-bold">
            <div className="flex gap-2 items-center">
              <h4 className="text-[#4ea8de] ">Tarefas criadas</h4>
              <span className="bg-[#333] px-2 py-[2px] text-white font-bold text-xs rounded-full">
                {todos.length}
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <h4 className="text-[#7b7dec] ">Concluídas</h4>
              <span className="bg-[#333] px-2 py-[2px] text-white font-bold text-xs rounded-full">
                {completedCount}
              </span>
            </div>
          </div>
          <div className="py-16 border-t border-t-[#333] flex flex-col w-full gap-3">
            {loading ? (
              skeletons.map((s, i) => {
                return <TodoTileSkeleton key={i} />;
              })
            ) : todos && todos.length ? (
              todos.map((todo, index) => {
                return (
                  <TodoTile
                    key={index}
                    todo={todo}
                    updateTodoStatus={handleUpdateTodo}
                    deleteTodo={handleDeleteTodo}
                    updateLoading={updateLoading}
                  />
                );
              })
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
