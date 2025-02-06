import React from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import User from "./pages/User";
import Login from "./pages/Login";
import Recipient from "./pages/Recipient";
import AppPage from "./pages/App";
import Template from "./pages/Template";
import Log from "./pages/Log";
import Group from "./pages/Group";
import NewMessage from "./pages/NewMessage";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import axiosInstance from "./utils/axiosInstance";
import ErrorBoundary from "./components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const authLoader = async () => {
  try {
    const { data: user } = await axiosInstance.get('/me');
    return { user }
  } catch (error: unknown) {
    console.error(error);
    return redirect('/login');
  }
}

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,
    loader: authLoader,
    children: [
      { index: true, element: <Home /> },
      { path: "new-message", element: <NewMessage /> },
      { path: "groups", element: <Group /> },
      { path: "recipients", element: <Recipient /> },
      { path: "apps", element: <AppPage /> },
      { path: "users", element: <User /> },
      { path: "templates", element: <Template /> },
      { path: "logs", element: <Log /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
};

export default App;