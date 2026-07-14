import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">รายงาน</h1>
        <p className="text-muted-foreground">รายได้ บริการขายดี และยอดขายต่อพนักงาน</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>รอเชื่อมต่อ API</CardTitle>
          <CardDescription>หน้านี้จะแสดงรายงานสรุปจาก pos-backend เมื่อเชื่อมต่อ API เรียบร้อย</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
