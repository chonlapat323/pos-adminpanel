import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">ตั้งค่าร้าน</h1>
        <p className="text-muted-foreground">ชื่อร้าน โลโก้ ที่อยู่ เวลาเปิด-ปิด และอัตราแลก point</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>รอเชื่อมต่อ API</CardTitle>
          <CardDescription>หน้านี้จะแก้ไขข้อมูล Shop จาก pos-backend เมื่อเชื่อมต่อ API เรียบร้อย</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
