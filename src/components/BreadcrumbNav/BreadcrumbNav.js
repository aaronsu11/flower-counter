import React from "react";

const checkStage = (stage, tag) => {
  if (stage === tag) {
    return "breadcrumb-counter-nav-item current";
  } else {
    return "breadcrumb-counter-nav-item";
  }
};

export const BreadcrumbNav = ({ stage }) => {
  // console.log(state);
  return (
    <ul className="breadcrumb-counter-nav">
      <li className={checkStage(stage, 1)}>Dataset Info</li>
      <li className={checkStage(stage, 2)}>Choose Images</li>
      <li className={checkStage(stage, 3)}>Progress</li>
      <li className={checkStage(stage, 4)}>Report</li>
    </ul>
  );
};
