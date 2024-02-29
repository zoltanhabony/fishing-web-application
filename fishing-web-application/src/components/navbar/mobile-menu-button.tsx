import React from "react";
import { useSidebarContext } from "../layout/layout-context";
import { StyledBurgerButton } from "@/styles/navbar-styles";

export const BurguerButton = () => {
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <div
      className={StyledBurgerButton()}
      onClick={setCollapsed}
    >
      <div className="bg-[#323232] h-[3px] rounded-lg"/>
      <div className="bg-[#323232] h-[3px] rounded-lg"/>
      <div className="bg-[#323232] h-[3px] rounded-lg"/>
    </div>
  );
};