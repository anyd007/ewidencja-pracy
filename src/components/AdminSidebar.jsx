import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/AdminSidebar.scss";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* BURGER */}
      <button className="burger" onClick={toggleMenu}>
        ☰
      </button>

      {/* OVERLAY */}
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={toggleMenu}
      />

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">
          Ewidencja<span>Pracy</span>
        </div>

        <nav>
          <NavLink to="/admin/dashboard" end onClick={toggleMenu}>
            📊 <span className="link-name">Panel główny</span>
          </NavLink>

          <NavLink to="/admin/dashboard/employees" onClick={toggleMenu}>
            👷 <span className="link-name">Pracownicy</span>
          </NavLink>

          <NavLink to="/admin/dashboard/workplaces" onClick={toggleMenu}>
            🏗 <span className="link-name">Miejsca pracy</span>
          </NavLink>

          <NavLink to="/admin/dashboard/time" onClick={toggleMenu}>
            ⏱ <span className="link-name">Ewidencja czasu</span>
          </NavLink>

          <NavLink to="/admin/dashboard/settings" onClick={toggleMenu}>
            ⚙ <span className="link-name">Ustawienia</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;