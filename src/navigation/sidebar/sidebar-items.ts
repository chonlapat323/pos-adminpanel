import {
  Gift,
  LayoutDashboard,
  type LucideIcon,
  ReceiptText,
  Scissors,
  Settings,
  ShieldCheck,
  Tag,
  UserCog,
  Users,
} from "lucide-react";

export interface NavItem {
  id: string;
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavGroup {
  id: number;
  label: string;
  items: NavItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "ภาพรวม",
    items: [
      { id: "dashboard", title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { id: "reports", title: "รายงาน", url: "/dashboard/reports", icon: ReceiptText },
    ],
  },
  {
    id: 2,
    label: "จัดการร้าน",
    items: [
      { id: "categories", title: "กลุ่มบริการ", url: "/dashboard/categories", icon: Tag },
      { id: "services", title: "บริการ", url: "/dashboard/services", icon: Scissors },
      { id: "members", title: "สมาชิก", url: "/dashboard/members", icon: Users },
      { id: "rewards", title: "แลก Point / รางวัล", url: "/dashboard/rewards", icon: Gift },
      { id: "staff", title: "พนักงาน", url: "/dashboard/staff", icon: UserCog },
      { id: "roles", title: "สิทธิ์การใช้งาน (Role)", url: "/dashboard/roles", icon: ShieldCheck },
      { id: "settings", title: "ตั้งค่าร้าน", url: "/dashboard/settings", icon: Settings },
    ],
  },
];
