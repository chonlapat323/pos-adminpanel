import { Card } from "@heroui/react";

import { requireApiFetch } from "@/lib/api";

interface ReportSummary {
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  billsToday: number;
  newMembersThisMonth: number;
  totalPointsInSystem: number;
}

function formatBaht(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

export default async function DashboardPage() {
  const summary = await requireApiFetch<ReportSummary>("/reports/summary");

  const statCards = [
    { label: "รายได้วันนี้", value: formatBaht(summary.revenueToday) },
    { label: "บิลวันนี้", value: summary.billsToday.toLocaleString("th-TH") },
    { label: "สมาชิกใหม่เดือนนี้", value: summary.newMembersThisMonth.toLocaleString("th-TH") },
    { label: "Point คงเหลือในระบบ", value: summary.totalPointsInSystem.toLocaleString("th-TH") },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">ภาพรวมร้าน</h1>
        <p className="text-muted">สรุปรายได้ บิล และสมาชิกของร้าน</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
