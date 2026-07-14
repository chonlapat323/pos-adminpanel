import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiHealth } from "@/lib/api";

const STAT_CARDS = [
  { label: "รายได้วันนี้", value: "-" },
  { label: "บิลวันนี้", value: "-" },
  { label: "สมาชิกใหม่เดือนนี้", value: "-" },
  { label: "Point คงเหลือในระบบ", value: "-" },
];

export default async function DashboardPage() {
  const health = await getApiHealth();

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
          <CardTitle>{health ? "เชื่อมต่อ pos-backend สำเร็จ" : "ยังเชื่อมต่อ pos-backend ไม่ได้"}</CardTitle>
          <CardDescription>
            {health
              ? `${health.service} ตอบกลับปกติ — ตัวเลขด้านบนจะดึงข้อมูลจริงเมื่อเพิ่ม endpoint แล้ว`
              : "ตรวจสอบว่า pos-backend รันอยู่ที่พอร์ต 3010"}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
