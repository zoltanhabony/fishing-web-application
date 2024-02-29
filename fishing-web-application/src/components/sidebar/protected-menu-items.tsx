import { SidebarItem } from "@/components/sidebar/sidebar-item";
import { UserRole } from "@prisma/client";


type User = {
  name: string;
  image: string;
  email: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
} | undefined;

type RouteType = {
  href: string;
  title: string;
  icon: React.JSX.ElementType;
  role: UserRole[];
  access: { [index: string]: any };
};

interface ProtectedMenuItemsProps {
  arrayOfRoutes: RouteType[];
  user: User;
  currentAccess: { [index: string]: any };
  pathname: string;
}

export const ProtectedMenuItems = ({
  arrayOfRoutes,
  user,
  currentAccess,
  pathname,
}: ProtectedMenuItemsProps) => {
  return (
    <>
      {arrayOfRoutes.map((item) => {
        if (item.role.includes(user?.role as UserRole)) {
          let countOfAccess = 0;
          for (let a in item.access) {
            if (currentAccess[a]) {
              countOfAccess++;
            }
          }
          if (countOfAccess === Object.keys(item.access).length) {
            return (
              <SidebarItem
                key={item.title}
                isActive={pathname === item.href}
                title={item.title}
                icon=<item.icon></item.icon>
                href={item.href}
              />
            );
          }
          return "";
        }
      })}
    </>
  );
};
