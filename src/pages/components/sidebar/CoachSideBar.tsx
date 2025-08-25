import React, { useState } from "react";
import "./sidebar.css";
import Logo from "../../../images/logo.png";
import { SidebarData } from "../../../data/data";

const CoachSidebar = () => {
  const [selected, setSelected] = useState(0); // useState INSIDE the component

  return (
    <section className="sidebar">
      <div className="logo">
        <img src={Logo} alt="Logo" width={50} height={50} />
        <span>
          Supa<span>Stats</span>
        </span>
      </div>

      <section className="menu">
        {SidebarData.map((item, index) => (
          <div
            className={selected === index ? "menuItem active" : "menuItem"}
            key={index}
            onClick={() => setSelected(index)} // optional: to change selection
          >
            <item.icon />
            <span>{item.text}</span>
          </div>
        ))}
      </section>
    </section>
  );
};

export default CoachSidebar;
