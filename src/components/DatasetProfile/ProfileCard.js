import React from "react";
import "./DatasetProfile.css";

export const ProfileCard = ({ state }) => {
  // console.log(state);
  return (
    <div className="profile tl">
      <label htmlFor="name">Name: {state.name}</label>
      <label htmlFor="email">Email: {state.email}</label>
      <label htmlFor="date">Date: {state.date}</label>
      <label htmlFor="variety">Variety: {state.variety}</label>
      <label htmlFor="EL_stage">EL Stage: {state.EL_stage}</label>
      <label htmlFor="vineyard">Vineyard: {state.vineyard}</label>
      <label htmlFor="block_id">Block ID: {state.block_id}</label>
    </div>
  );
};
