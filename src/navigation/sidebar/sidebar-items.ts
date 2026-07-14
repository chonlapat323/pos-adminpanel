import {
  Fingerprint,
  Gift,
  LayoutDashboard,
  type LucideIcon,
  ReceiptText,
  Scissors,
  Settings,
  UserCog,
  Users,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "ภาพรวม",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "reports",
        title: "รายงาน",
        url: "/dashboard/reports",
        icon: ReceiptText,
      },
    ],
  },
  {
    id: 2,
    label: "จัดการร้าน",
    items: [
      {
        id: "services",
        title: "บริการ",
        url: "/dashboard/services",
        icon: Scissors,
      },
      {
        id: "members",
        title: "สมาชิก",
        url: "/dashboard/members",
        icon: Users,
      },
      {
        id: "rewards",
        title: "แลก Point / รางวัล",
        url: "/dashboard/rewards",
        icon: Gift,
      },
      {
        id: "staff",
        title: "พนักงาน",
        url: "/dashboard/staff",
        icon: UserCog,
      },
      {
        id: "settings",
        title: "ตั้งค่าร้าน",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
  {
    id: 3,
    label: "Authentication",
    items: [
      {
        id: "authentication",
        title: "Authentication",
        icon: Fingerprint,
        subItems: [
          { id: "auth-login-v1", title: "Login v1", url: "/auth/v1/login", newTab: true },
          { id: "auth-login-v2", title: "Login v2", url: "/auth/v2/login", newTab: true },
          { id: "auth-register-v1", title: "Register v1", url: "/auth/v1/register", newTab: true },
          { id: "auth-register-v2", title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
    ],
  },
];
