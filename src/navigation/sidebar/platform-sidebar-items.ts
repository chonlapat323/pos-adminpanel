import { Building2, Gift, LayoutDashboard, Scissors, ShieldCheck, Tag, UserCog, Users } from "lucide-react";

import type { NavGroup } from "./sidebar-items";

export const platformSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "แพลตฟอร์ม",
    items: [
      { id: "dashboard", title: "ภาพรวม", url: "/platform/dashboard", icon: LayoutDashboard },
      { id: "shops", title: "ร้านทั้งหมด", url: "/platform/shops", icon: Building2 },
    ],
  },
  {
    id: 2,
    label: "จัดการทุกร้าน",
    items: [
      { id: "categories", title: "กลุ่มบริการ", url: "/platform/categories", icon: Tag },
      { id: "services", title: "บริการ", url: "/platform/services", icon: Scissors },
      { id: "members", title: "สมาชิก", url: "/platform/members", icon: Users },
      { id: "rewards", title: "แลก Point / รางวัล", url: "/platform/rewards", icon: Gift },
      { id: "staff", title: "พนักงาน", url: "/platform/staff", icon: UserCog },
    ],
  },
  {
    id: 3,
    label: "จัดการระบบ",
    items: [
      { id: "admins", title: "Platform Admin", url: "/platform/admins", icon: UserCog },
      { id: "roles", title: "สิทธิ์การใช้งาน (Role)", url: "/platform/roles", icon: ShieldCheck },
    ],
  },
];
