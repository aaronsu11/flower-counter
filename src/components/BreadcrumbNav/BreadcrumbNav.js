import React from "react";

export const BreadcrumbNav = ({ state }) => {
  // console.log(state);
  return (
    <ul className="breadcrumb-counter-nav">
      <li className="breadcrumb-counter-nav-item">Setup</li>
      <li className="breadcrumb-counter-nav-item current">Sample Analysis</li>
      <li className="breadcrumb-counter-nav-item">Sort Layout</li>
      <li className="breadcrumb-counter-nav-item">Sort</li>
      <li className="breadcrumb-counter-nav-item">Reporting</li>
    </ul>
  );
};
