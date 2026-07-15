import { Card, Chip, EmptyState, Table } from "@heroui/react";
import { Gift } from "lucide-react";

import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { ListPagination } from "@/components/list-pagination";
import type { PaginatedResult } from "@/lib/api";
import { requirePlatformApiFetch } from "@/lib/platform-api";

import { deletePlatformReward } from "./actions";
import { RewardFilter } from "./reward-filter";
import { RewardFormDialog } from "./reward-form-dialog";

interface Shop {
  id: string;
  name: string;
}

interface Reward {
  id: string;
  name: string;
  description: string | null;
  pointCost: number;
  isActive: boolean;
  shop: Shop;
}

interface PageProps {
  searchParams: Promise<{ search?: string; shopId?: string; page?: string }>;
}

export default async function PlatformRewardsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.shopId) query.set("shopId", params.shopId);
  query.set("page", String(page));
  query.set("pageSize", "10");

  const [result, shops] = await Promise.all([
    requirePlatformApiFetch<PaginatedResult<Reward>>(`/platform/rewards?${query.toString()}`),
    requirePlatformApiFetch<Shop[]>("/platform/shops/select"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">แลก Point / รางวัล (ทุกร้าน)</h1>
          <p className="text-muted">จัดการรางวัลของทุกร้านบนแพลตฟอร์ม</p>
        </div>
        <RewardFormDialog shops={shops} />
      </div>

      <Card>
        <Card.Header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Card.Title>รางวัลทั้งหมด ({result.total})</Card.Title>
          <RewardFilter shops={shops} />
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Gift className="size-4" />
              </div>
              <p className="font-medium text-sm">ไม่พบรางวัล</p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="รางวัลทั้งหมด">
                <Table.Header>
                  <Table.Column isRowHeader>ชื่อรางวัล</Table.Column>
                  <Table.Column>ร้าน</Table.Column>
                  <Table.Column className="text-right">ใช้ point</Table.Column>
                  <Table.Column>สถานะ</Table.Column>
                  <Table.Column>จัดการ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {result.data.map((reward) => (
                    <Table.Row key={reward.id}>
                      <Table.Cell>{reward.name}</Table.Cell>
                      <Table.Cell>{reward.shop.name}</Table.Cell>
                      <Table.Cell className="text-right">{reward.pointCost.toLocaleString("th-TH")}</Table.Cell>
                      <Table.Cell>
                        <Chip color={reward.isActive ? "success" : "default"} variant="soft">
                          <Chip.Label>{reward.isActive ? "เปิดใช้งาน" : "ปิด"}</Chip.Label>
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <RewardFormDialog shops={shops} reward={reward} />
                          <DeleteConfirmButton
                            title="ลบรางวัล"
                            description={`ยืนยันลบรางวัล "${reward.name}" ของร้าน ${reward.shop.name}`}
                            successMessage="ลบรางวัลแล้ว"
                            onConfirm={deletePlatformReward.bind(null, reward.id)}
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        )}
      </Card>

      <ListPagination
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        basePath="/platform/rewards"
        searchParams={params}
      />
    </div>
  );
}
