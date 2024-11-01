import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login";
import UserRoute from "./routes/UserRoute";
import Todos from "./pages/todos";

function App() {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/todos",
      element: (
        <UserRoute>
          <Todos />
        </UserRoute>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
