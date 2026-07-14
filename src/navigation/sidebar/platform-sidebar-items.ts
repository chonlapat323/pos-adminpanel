import { Building2 } from "lucide-react";

import type { NavGroup } from "./sidebar-items";

export const platformSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "แพลตฟอร์ม",
    items: [{ id: "shops", title: "ร้านทั้งหมด", url: "/platform/shops", icon: Building2 }],
  },
];
