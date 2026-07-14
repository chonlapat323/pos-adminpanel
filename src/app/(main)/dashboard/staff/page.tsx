import { Card, Chip, Table } from "@heroui/react";

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
        <p className="text-muted">จัดการบัญชีพนักงานที่ใช้งาน POS หน้าร้าน</p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>พนักงานทั้งหมด ({staff.length})</Card.Title>
        </Card.Header>
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="พนักงานทั้งหมด">
              <Table.Header>
                <Table.Column isRowHeader>ชื่อ</Table.Column>
                <Table.Column>อีเมล</Table.Column>
                <Table.Column>บทบาท</Table.Column>
                <Table.Column>สถานะ</Table.Column>
              </Table.Header>
              <Table.Body>
                {staff.map((member) => (
                  <Table.Row key={member.id}>
                    <Table.Cell>{member.name}</Table.Cell>
                    <Table.Cell>{member.email}</Table.Cell>
                    <Table.Cell>
                      <Chip color={member.role === "OWNER" ? "accent" : "default"} variant="soft">
                        <Chip.Label>{member.role}</Chip.Label>
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <Chip color={member.isActive ? "success" : "default"} variant="soft">
                        <Chip.Label>{member.isActive ? "ใช้งานอยู่" : "ปิดใช้งาน"}</Chip.Label>
                      </Chip>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Card>
    </div>
  );
}
