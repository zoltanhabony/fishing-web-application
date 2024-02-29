import {Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import React from "react";
import { BurguerButton } from "./mobile-menu-button";
import { UserProfile } from "../auth/user";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="w-full "
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="md:hidden" justify="start">
          <NavbarItem>
          <BurguerButton />
          </NavbarItem>
        </NavbarContent>
        <NavbarContent
          justify="end"
        >
          <NavbarItem>
           <UserProfile/>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
