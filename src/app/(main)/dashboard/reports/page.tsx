import { Card, Table } from "@heroui/react";

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
        <p className="text-muted">รายได้ บริการขายดี และยอดขายต่อพนักงาน</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <Card.Header>
            <Card.Description>รายได้วันนี้</Card.Description>
            <Card.Title className="text-2xl">{formatBaht(summary.revenueToday)}</Card.Title>
          </Card.Header>
        </Card>
        <Card>
          <Card.Header>
            <Card.Description>รายได้ 7 วันล่าสุด</Card.Description>
            <Card.Title className="text-2xl">{formatBaht(summary.revenueWeek)}</Card.Title>
          </Card.Header>
        </Card>
        <Card>
          <Card.Header>
            <Card.Description>รายได้เดือนนี้</Card.Description>
            <Card.Title className="text-2xl">{formatBaht(summary.revenueMonth)}</Card.Title>
          </Card.Header>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>บริการขายดี</Card.Title>
        </Card.Header>
        {topServices.length === 0 ? (
          <Card.Description className="px-6 pb-6">ยังไม่มีข้อมูลการขาย</Card.Description>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="บริการขายดี">
                <Table.Header>
                  <Table.Column isRowHeader>บริการ</Table.Column>
                  <Table.Column className="text-right">จำนวนที่ขาย</Table.Column>
                  <Table.Column className="text-right">รายได้รวม</Table.Column>
                </Table.Header>
                <Table.Body>
                  {topServices.map((service) => (
                    <Table.Row key={service.serviceId}>
                      <Table.Cell>{service.name}</Table.Cell>
                      <Table.Cell className="text-right">{service.totalQuantity}</Table.Cell>
                      <Table.Cell className="text-right">{formatBaht(service.totalRevenue)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        )}
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>ยอดขายต่อพนักงาน</Card.Title>
        </Card.Header>
        {staffSales.length === 0 ? (
          <Card.Description className="px-6 pb-6">ยังไม่มีข้อมูลการขาย</Card.Description>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="ยอดขายต่อพนักงาน">
                <Table.Header>
                  <Table.Column isRowHeader>พนักงาน</Table.Column>
                  <Table.Column className="text-right">จำนวนบิล</Table.Column>
                  <Table.Column className="text-right">ยอดขายรวม</Table.Column>
                </Table.Header>
                <Table.Body>
                  {staffSales.map((staff) => (
                    <Table.Row key={staff.staffId}>
                      <Table.Cell>{staff.name}</Table.Cell>
                      <Table.Cell className="text-right">{staff.billCount}</Table.Cell>
                      <Table.Cell className="text-right">{formatBaht(staff.totalSales)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        )}
      </Card>
    </div>
  );
}
