import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/AdminSidebar.scss";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">

      {/* LOGO */}
      <div className="logo">
        Ewidencja<span>Pracy</span>
      </div>

      {/* NAWIGACJA */}
      <nav>
        <NavLink to="/admin/dashboard" end>
          📊 Panel główny
        </NavLink>

        <NavLink to="/admin/employees">
          👷 Pracownicy
        </NavLink>

        <NavLink to="/admin/workplaces">
          🏗 Miejsca pracy
        </NavLink>

        <NavLink to="/admin/time">
          ⏱ Ewidencja czasu
        </NavLink>

        <NavLink to="/admin/settings">
          ⚙ Ustawienia
        </NavLink>
      </nav>

    </aside>
  );
};

export default AdminSidebar;