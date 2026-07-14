import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MembersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">สมาชิก</h1>
        <p className="text-muted-foreground">ค้นหาสมาชิก ดู point คงเหลือ และประวัติการใช้บริการ</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>รอเชื่อมต่อ API</CardTitle>
          <CardDescription>หน้านี้จะแสดงรายชื่อ Member จาก pos-backend เมื่อเชื่อมต่อ API เรียบร้อย</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
