import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireApiFetch } from "@/lib/api";

interface Reward {
  id: string;
  name: string;
  description: string | null;
  pointCost: number;
  isActive: boolean;
}

export default async function RewardsPage() {
  const rewards = await requireApiFetch<Reward[]>("/rewards");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">แลก Point / รางวัล</h1>
        <p className="text-muted-foreground">ตั้งรางวัลและบริการที่สมาชิกแลกด้วย point ได้</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รางวัลทั้งหมด ({rewards.length})</CardTitle>
        </CardHeader>
        {rewards.length === 0 ? (
          <CardDescription className="px-6 pb-6">ยังไม่มีรางวัล</CardDescription>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อรางวัล</TableHead>
                <TableHead className="text-right">ใช้ point</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>{reward.name}</TableCell>
                  <TableCell className="text-right">{reward.pointCost.toLocaleString("th-TH")}</TableCell>
                  <TableCell>
                    <Badge variant={reward.isActive ? "default" : "secondary"}>
                      {reward.isActive ? "เปิดใช้งาน" : "ปิด"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
