import { Card } from "@heroui/react";

import { requirePlatformApiFetch } from "@/lib/platform-api";

import { DashboardFilter } from "./dashboard-filter";

interface Shop {
  id: string;
  name: string;
}

interface PlatformDashboardStats {
  totalShops: number;
  activeShops: number;
  suspendedShops: number;
  totalMembers: number;
  totalStaff: number;
  revenue: number;
  period: "today" | "week" | "month" | "all";
}

interface PageProps {
  searchParams: Promise<{ period?: string; shopId?: string }>;
}

const PERIOD_LABELS: Record<string, string> = {
  today: "วันนี้",
  week: "สัปดาห์นี้",
  month: "เดือนนี้",
  all: "ทั้งหมด",
};

function formatBaht(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

export default async function PlatformDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = new URLSearchParams();
  if (params.period) query.set("period", params.period);
  if (params.shopId) query.set("shopId", params.shopId);

  const [stats, shops] = await Promise.all([
    requirePlatformApiFetch<PlatformDashboardStats>(`/platform/shops/dashboard?${query.toString()}`),
    requirePlatformApiFetch<Shop[]>("/platform/shops/select"),
  ]);

  const revenueLabel = `รายได้${params.shopId ? "" : "ทุกร้าน "}(${PERIOD_LABELS[stats.period]})`;

  const statCards = [
    { label: revenueLabel, value: formatBaht(stats.revenue) },
    { label: "ร้านทั้งหมด", value: stats.totalShops.toLocaleString("th-TH") },
    { label: "ร้านที่ใช้งานอยู่", value: stats.activeShops.toLocaleString("th-TH") },
    { label: "ร้านที่ถูกระงับ", value: stats.suspendedShops.toLocaleString("th-TH") },
    { label: "สมาชิกทั้งหมด", value: stats.totalMembers.toLocaleString("th-TH") },
    { label: "พนักงานทั้งหมด", value: stats.totalStaff.toLocaleString("th-TH") },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">ภาพรวมแพลตฟอร์ม</h1>
          <p className="text-muted">สรุปข้อมูลรวมทุกร้านบนแพลตฟอร์ม</p>
        </div>
        <DashboardFilter shops={shops} />
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
