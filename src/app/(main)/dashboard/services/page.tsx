import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">บริการ</h1>
        <p className="text-muted-foreground">จัดการกลุ่มบริการและบริการย่อยของร้าน</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>รอเชื่อมต่อ API</CardTitle>
          <CardDescription>
            หน้านี้จะแสดงและจัดการ ServiceCategory / Service จาก pos-backend เมื่อเชื่อมต่อ API เรียบร้อย
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
