"use client";

import { logOut } from "@/actions/auth-actions/credential-logout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutIcon } from "@/icons/logout-icon";
import { UserIcon } from "@/icons/user-icon";
import { User } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const logOutHandler = async () => {
  await logOut();
};


export const UserProfile = () => {
  const router = useRouter()
  const user = useCurrentUser();
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          name={user?.name}
          description={user?.email}
          avatarProps={{
            src: user?.image,
            size: "sm",
          }}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem
          key="profile"
          textValue="Profile"
          className=" gap-2 text-[#969696]"
          color="primary"
          startContent={<UserIcon />}
          onClick={() => router.push('/profile')}
        >
          Profile
        </DropdownItem>
        <DropdownItem
          key="logout"
          className=" gap-2 text-danger"
          color="danger"
          onClick={logOutHandler}
          startContent={<LogoutIcon />}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
