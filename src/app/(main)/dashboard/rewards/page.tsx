import { Card, Chip, EmptyState, Table } from "@heroui/react";
import { Gift } from "lucide-react";

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
        <p className="text-muted">ตั้งรางวัลและบริการที่สมาชิกแลกด้วย point ได้</p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>รางวัลทั้งหมด ({rewards.length})</Card.Title>
        </Card.Header>
        {rewards.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Gift className="size-4" />
              </div>
              <p className="font-medium text-sm">ยังไม่มีรางวัล</p>
              <p className="max-w-sm text-muted text-sm">
                ตั้งรางวัลที่สมาชิกแลกด้วย point ได้ เช่น &quot;สระผมฟรี = 20 point&quot;
              </p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="รางวัลทั้งหมด">
                <Table.Header>
                  <Table.Column isRowHeader>ชื่อรางวัล</Table.Column>
                  <Table.Column className="text-right">ใช้ point</Table.Column>
                  <Table.Column>สถานะ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {rewards.map((reward) => (
                    <Table.Row key={reward.id}>
                      <Table.Cell>{reward.name}</Table.Cell>
                      <Table.Cell className="text-right">{reward.pointCost.toLocaleString("th-TH")}</Table.Cell>
                      <Table.Cell>
                        <Chip color={reward.isActive ? "success" : "default"} variant="soft">
                          <Chip.Label>{reward.isActive ? "เปิดใช้งาน" : "ปิด"}</Chip.Label>
                        </Chip>
                      </Table.Cell>
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
