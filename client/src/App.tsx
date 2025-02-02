import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import User from "./pages/User";
import Login from "./pages/Login";
import Recipient from "./pages/Recipient";
import AppPage from "./pages/App";
import Template from "./pages/Template";
import Log from "./pages/Log";
// import PrivateRoute from "./components/PrivateRoute";
import Group from "./pages/Group";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />} >
            <Route index element={<Home />} />
            <Route path="groups" element={<Group />} />
            <Route path="recipients" element={<Recipient />} />
            <Route path="apps" element={<AppPage />} />
            <Route path="users" element={<User />} />
            <Route path="templates" element={<Template />} />
            <Route path="logs" element={<Log />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;