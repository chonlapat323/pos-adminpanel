import { Card, EmptyState, Table } from "@heroui/react";
import { Users } from "lucide-react";

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
        <p className="text-muted">ค้นหาสมาชิก ดู point คงเหลือ และประวัติการใช้บริการ</p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>สมาชิกทั้งหมด ({members.length})</Card.Title>
        </Card.Header>
        {members.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Users className="size-4" />
              </div>
              <p className="font-medium text-sm">ยังไม่มีสมาชิก</p>
              <p className="max-w-sm text-muted text-sm">สมาชิกจะถูกเพิ่มเมื่อเปิดบิลครั้งแรกที่ POS หน้าร้าน</p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="สมาชิกทั้งหมด">
                <Table.Header>
                  <Table.Column isRowHeader>ชื่อ</Table.Column>
                  <Table.Column>เบอร์โทร</Table.Column>
                  <Table.Column className="text-right">Point คงเหลือ</Table.Column>
                  <Table.Column>สมัครเมื่อ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {members.map((member) => (
                    <Table.Row key={member.id}>
                      <Table.Cell>{member.name}</Table.Cell>
                      <Table.Cell>{member.phone}</Table.Cell>
                      <Table.Cell className="text-right">{member.pointBalance.toLocaleString("th-TH")}</Table.Cell>
                      <Table.Cell>{new Date(member.createdAt).toLocaleDateString("th-TH")}</Table.Cell>
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
