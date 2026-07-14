import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireApiFetch } from "@/lib/api";

interface ReportSummary {
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  billsToday: number;
  newMembersThisMonth: number;
  totalPointsInSystem: number;
}

interface TopService {
  serviceId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface StaffSale {
  staffId: string;
  name: string;
  totalSales: number;
  billCount: number;
}

function formatBaht(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

export default async function ReportsPage() {
  const [summary, topServices, staffSales] = await Promise.all([
    requireApiFetch<ReportSummary>("/reports/summary"),
    requireApiFetch<TopService[]>("/reports/top-services"),
    requireApiFetch<StaffSale[]>("/reports/staff-sales"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">รายงาน</h1>
        <p className="text-muted-foreground">รายได้ บริการขายดี และยอดขายต่อพนักงาน</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>รายได้วันนี้</CardDescription>
            <CardTitle className="text-2xl">{formatBaht(summary.revenueToday)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>รายได้ 7 วันล่าสุด</CardDescription>
            <CardTitle className="text-2xl">{formatBaht(summary.revenueWeek)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>รายได้เดือนนี้</CardDescription>
            <CardTitle className="text-2xl">{formatBaht(summary.revenueMonth)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>บริการขายดี</CardTitle>
        </CardHeader>
        {topServices.length === 0 ? (
          <CardDescription className="px-6 pb-6">ยังไม่มีข้อมูลการขาย</CardDescription>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>บริการ</TableHead>
                <TableHead className="text-right">จำนวนที่ขาย</TableHead>
                <TableHead className="text-right">รายได้รวม</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topServices.map((service) => (
                <TableRow key={service.serviceId}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell className="text-right">{service.totalQuantity}</TableCell>
                  <TableCell className="text-right">{formatBaht(service.totalRevenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ยอดขายต่อพนักงาน</CardTitle>
        </CardHeader>
        {staffSales.length === 0 ? (
          <CardDescription className="px-6 pb-6">ยังไม่มีข้อมูลการขาย</CardDescription>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>พนักงาน</TableHead>
                <TableHead className="text-right">จำนวนบิล</TableHead>
                <TableHead className="text-right">ยอดขายรวม</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffSales.map((staff) => (
                <TableRow key={staff.staffId}>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell className="text-right">{staff.billCount}</TableCell>
                  <TableCell className="text-right">{formatBaht(staff.totalSales)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
