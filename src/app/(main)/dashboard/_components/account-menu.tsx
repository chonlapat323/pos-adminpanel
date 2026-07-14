"use client";

import { Avatar, Dropdown } from "@heroui/react";
import { LogOut } from "lucide-react";

import { logout } from "@/lib/auth";
import { getInitials } from "@/lib/utils";

interface AccountMenuProps {
  user: { name: string; role: string };
}

export function AccountMenu({ user }: AccountMenuProps) {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar className="cursor-pointer">
          <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          disabledKeys={["profile"]}
          onAction={(key) => {
            if (key === "logout") void logout();
          }}
        >
          <Dropdown.Item id="profile" textValue={user.name}>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{user.name}</span>
              <span className="text-muted text-xs capitalize">{user.role}</span>
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="logout" textValue="Log out">
            <LogOut className="size-4" />
            Log out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
