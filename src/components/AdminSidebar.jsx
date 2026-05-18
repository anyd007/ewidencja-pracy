import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/AdminSidebar.scss";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">

      <div className="logo">
        Ewidencja<span>Pracy</span>
      </div>

      <nav>
       <NavLink to="/admin/dashboard" end>
  📊 Panel główny
</NavLink>

<NavLink to="/admin/dashboard/employees">
  👷 Pracownicy
</NavLink>

<NavLink to="/admin/dashboard/workplaces">
  🏗 Miejsca pracy
</NavLink>

<NavLink to="/admin/dashboard/time">
  ⏱ Ewidencja czasu
</NavLink>

<NavLink to="/admin/dashboard/settings">
  ⚙ Ustawienia
</NavLink>
      </nav>

    </aside>
  );
};

export default AdminSidebar;