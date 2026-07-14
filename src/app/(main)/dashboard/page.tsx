import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STAT_CARDS = [
  { label: "รายได้วันนี้", value: "-" },
  { label: "บิลวันนี้", value: "-" },
  { label: "สมาชิกใหม่เดือนนี้", value: "-" },
  { label: "Point คงเหลือในระบบ", value: "-" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">ภาพรวมร้าน</h1>
        <p className="text-muted-foreground">สรุปรายได้ บิล และสมาชิกของร้าน</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>รอเชื่อมต่อ API</CardTitle>
          <CardDescription>ตัวเลขด้านบนจะดึงจาก pos-backend เมื่อเชื่อมต่อ API เรียบร้อย</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
