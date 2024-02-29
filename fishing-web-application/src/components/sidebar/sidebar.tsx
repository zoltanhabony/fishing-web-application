import React from "react";
import { Sidebar } from "@/styles/sidebar-styles";
import { useSidebarContext } from "../layout/layout-context";
import { ApplicationInfo } from "./application-dropdown";
import { defaultRoutes, mainMenuRoutes } from "@/helpers/route/dasboard-route";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ProtectedMenuItems } from "@/components/sidebar/protected-menu-items";
import { SidebarMenu } from "./sidebar-menu";

interface SidebarWrapperProps {
  currentAccess: {[index: string]:any};
}

export const SidebarWrapper = ({ currentAccess }: SidebarWrapperProps) => {
  const { collapsed, setCollapsed } = useSidebarContext();
  const pathname = usePathname();
  const user = useCurrentUser();
  return (
    <aside className="h-screen z-[202] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <ApplicationInfo />
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>       
            <ProtectedMenuItems arrayOfRoutes={defaultRoutes} user={user} currentAccess={currentAccess} pathname={pathname}/>     
            <SidebarMenu title="Main Menu">
            <ProtectedMenuItems arrayOfRoutes={mainMenuRoutes} user={user} currentAccess={currentAccess} pathname={pathname}/>     
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}></div>
        </div>
      </div>
    </aside>
  );
};
