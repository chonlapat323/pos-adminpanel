import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireApiFetch } from "@/lib/api";

interface Member {
  id: string;
  name: string;
  phone: string;
  pointBalance: number;
  createdAt: string;
}

export default async function MembersPage() {
  const members = await requireApiFetch<Member[]>("/members");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">สมาชิก</h1>
        <p className="text-muted-foreground">ค้นหาสมาชิก ดู point คงเหลือ และประวัติการใช้บริการ</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>สมาชิกทั้งหมด ({members.length})</CardTitle>
        </CardHeader>
        {members.length === 0 ? (
          <CardDescription className="px-6 pb-6">ยังไม่มีสมาชิก</CardDescription>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ</TableHead>
                <TableHead>เบอร์โทร</TableHead>
                <TableHead className="text-right">Point คงเหลือ</TableHead>
                <TableHead>สมัครเมื่อ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell className="text-right">{member.pointBalance.toLocaleString("th-TH")}</TableCell>
                  <TableCell>{new Date(member.createdAt).toLocaleDateString("th-TH")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
