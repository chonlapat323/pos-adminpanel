import { Card } from "@heroui/react";

import { requirePlatformApiFetch } from "@/lib/platform-api";

interface PlatformDashboardStats {
  totalShops: number;
  activeShops: number;
  suspendedShops: number;
  totalMembers: number;
  totalStaff: number;
  revenueThisMonth: number;
}

function formatBaht(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

export default async function PlatformDashboardPage() {
  const stats = await requirePlatformApiFetch<PlatformDashboardStats>("/platform/shops/dashboard");

  const statCards = [
    { label: "รายได้เดือนนี้ (ทุกร้าน)", value: formatBaht(stats.revenueThisMonth) },
    { label: "ร้านทั้งหมด", value: stats.totalShops.toLocaleString("th-TH") },
    { label: "ร้านที่ใช้งานอยู่", value: stats.activeShops.toLocaleString("th-TH") },
    { label: "ร้านที่ถูกระงับ", value: stats.suspendedShops.toLocaleString("th-TH") },
    { label: "สมาชิกทั้งหมด (ทุกร้าน)", value: stats.totalMembers.toLocaleString("th-TH") },
    { label: "พนักงานทั้งหมด (ทุกร้าน)", value: stats.totalStaff.toLocaleString("th-TH") },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">ภาพรวมแพลตฟอร์ม</h1>
        <p className="text-muted">สรุปข้อมูลรวมทุกร้านบนแพลตฟอร์ม</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <Card.Header>
              <Card.Description>{stat.label}</Card.Description>
              <Card.Title className="text-2xl">{stat.value}</Card.Title>
            </Card.Header>
          </Card>
        ))}
      </div>
    </div>
  );
}
