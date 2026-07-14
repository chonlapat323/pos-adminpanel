import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireApiFetch } from "@/lib/api";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "OWNER" | "STAFF";
  isActive: boolean;
}

export default async function StaffPage() {
  const staff = await requireApiFetch<Staff[]>("/staff");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">พนักงาน</h1>
        <p className="text-muted-foreground">จัดการบัญชีพนักงานที่ใช้งาน POS หน้าร้าน</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>พนักงานทั้งหมด ({staff.length})</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อ</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>บทบาท</TableHead>
              <TableHead>สถานะ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Badge variant={member.role === "OWNER" ? "default" : "outline"}>{member.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={member.isActive ? "default" : "secondary"}>
                    {member.isActive ? "ใช้งานอยู่" : "ปิดใช้งาน"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
