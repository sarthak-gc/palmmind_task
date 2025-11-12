import { createBrowserRouter, RouterProvider } from "react-router";
import { Messages } from "./components/Message.tsx";
import { ProtectedRoute } from "./components/ProtectedRoutes.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { Login } from "./pages/Login.tsx";
import { Signup } from "./pages/Signup.tsx";

const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  {
    path: "/dashboard",
    element: <ProtectedRoute children={<Dashboard />} />,
    children: [
      {
        path: ":otherUserId",
        element: <Messages />,
      },
    ],
  },
  {
    path: "/*",
    element: <ProtectedRoute children={<>Page not found</>} />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
