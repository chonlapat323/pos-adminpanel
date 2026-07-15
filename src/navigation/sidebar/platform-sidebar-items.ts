import { Building2, LayoutDashboard } from "lucide-react";

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
];
