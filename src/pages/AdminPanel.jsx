import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminEmployees from "./AdminEmployees";
import AdminWorkplaces from "./AdminWorkplaces";
import AdminTimeEntries from "./AdminTimeEntries";
import AdminSettings from "./AdminSettings";

import "../styles/AdminPanel.scss";

const AdminPanel = ({ user }) => {

  
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-content">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="workplaces" element={<AdminWorkplaces />} />
          <Route path="time" element={<AdminTimeEntries />} />
          <Route path="settings" element={<AdminSettings user={user}/>} />
        </Routes>
      </div>

    </div>
  );
};

export default AdminPanel;