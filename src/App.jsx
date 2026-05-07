import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import EditPost from "./components/EditPost";
import Login from "./components/Login";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import Comments from "./components/comments";
import ErrorPage from "./components/ErrorPage";
import Dashboard from "./components/Dashboard.jsx";
import Layout from "./components/Layout.jsx";
import Settings from "./components/Settings.jsx";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "posts",
          element: <Posts />,
        },
        {
          path: "posts/:id/comments",
          element: <Comments />,
        },
        {
          path: "posts/:id/edit",
          element: <EditPost />,
        },
        {
          path: "posts/new",
          element: <NewPost />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
      ],
    },
  ]);

  return <RouterProvider router={route} />;
}

export default App;
