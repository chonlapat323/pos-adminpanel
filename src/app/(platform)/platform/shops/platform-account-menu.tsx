"use client";

import { Avatar, Dropdown } from "@heroui/react";
import { LogOut } from "lucide-react";

import { platformLogout } from "@/lib/platform-auth";
import { getInitials } from "@/lib/utils";

export function PlatformAccountMenu({ admin }: { admin: { name: string } }) {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar className="cursor-pointer">
          <Avatar.Fallback>{getInitials(admin.name)}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          disabledKeys={["profile"]}
          onAction={(key) => {
            if (key === "logout") void platformLogout();
          }}
        >
          <Dropdown.Item id="profile" textValue={admin.name}>
            <span className="font-semibold text-sm">{admin.name}</span>
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
