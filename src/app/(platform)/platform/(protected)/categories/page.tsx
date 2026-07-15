import { Card, Chip, EmptyState, Table } from "@heroui/react";
import { Tag } from "lucide-react";

import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { ListPagination } from "@/components/list-pagination";
import type { PaginatedResult } from "@/lib/api";
import { requirePlatformApiFetch } from "@/lib/platform-api";

import { deletePlatformCategory } from "./actions";
import { CategoryFilter } from "./category-filter";
import { CategoryFormDialog } from "./category-form-dialog";

interface Shop {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  isHidden: boolean;
  imageUrl: string | null;
  shop: Shop;
  _count: { services: number };
}

interface PageProps {
  searchParams: Promise<{ search?: string; shopId?: string; page?: string }>;
}

export default async function PlatformCategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.shopId) query.set("shopId", params.shopId);
  query.set("page", String(page));
  query.set("pageSize", "10");

  const [result, shops] = await Promise.all([
    requirePlatformApiFetch<PaginatedResult<Category>>(`/platform/service-categories?${query.toString()}`),
    requirePlatformApiFetch<Shop[]>("/platform/shops/select"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">กลุ่มบริการ (ทุกร้าน)</h1>
          <p className="text-muted">จัดการกลุ่มบริการของทุกร้านบนแพลตฟอร์ม</p>
        </div>
        <CategoryFormDialog shops={shops} />
      </div>

      <Card>
        <Card.Header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Card.Title>กลุ่มบริการทั้งหมด ({result.total})</Card.Title>
          <CategoryFilter shops={shops} />
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Tag className="size-4" />
              </div>
              <p className="font-medium text-sm">ไม่พบกลุ่มบริการ</p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="กลุ่มบริการทั้งหมด">
                <Table.Header>
                  <Table.Column>รูป</Table.Column>
                  <Table.Column isRowHeader>ชื่อกลุ่มบริการ</Table.Column>
                  <Table.Column>ร้าน</Table.Column>
                  <Table.Column className="text-right">จำนวนบริการ</Table.Column>
                  <Table.Column>สถานะ</Table.Column>
                  <Table.Column>จัดการ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {result.data.map((category) => (
                    <Table.Row key={category.id}>
                      <Table.Cell>
                        <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-default">
                          {category.imageUrl ? (
                            // biome-ignore lint/performance/noImgElement: local dev image server, next/image remote-pattern config not worth it yet
                            <img src={category.imageUrl} alt="" className="size-full object-cover" />
                          ) : (
                            <Tag className="size-4 text-muted" />
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>{category.name}</Table.Cell>
                      <Table.Cell>{category.shop.name}</Table.Cell>
                      <Table.Cell className="text-right">{category._count.services}</Table.Cell>
                      <Table.Cell>
                        <Chip color={category.isHidden ? "default" : "success"} variant="soft">
                          <Chip.Label>{category.isHidden ? "ซ่อน" : "แสดง"}</Chip.Label>
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <CategoryFormDialog shops={shops} category={category} />
                          <DeleteConfirmButton
                            title="ลบกลุ่มบริการ"
                            description={`ยืนยันลบกลุ่มบริการ "${category.name}" ของร้าน ${category.shop.name}`}
                            successMessage="ลบกลุ่มบริการแล้ว"
                            onConfirm={deletePlatformCategory.bind(null, category.id)}
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
        basePath="/platform/categories"
        searchParams={params}
      />
    </div>
  );
}
