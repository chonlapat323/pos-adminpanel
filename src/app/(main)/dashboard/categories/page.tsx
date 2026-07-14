import { Card, Chip, EmptyState, Table } from "@heroui/react";
import { Tag } from "lucide-react";

import { ListPagination } from "@/components/list-pagination";
import { type PaginatedResult, requireApiFetch } from "@/lib/api";

import { CategoryFilter } from "./category-filter";
import { CategoryToolbar } from "./category-toolbar";

interface Category {
  id: string;
  name: string;
  isHidden: boolean;
  _count: { services: number };
}

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  query.set("page", String(page));
  query.set("pageSize", "10");

  const result = await requireApiFetch<PaginatedResult<Category>>(`/service-categories?${query.toString()}`);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">กลุ่มบริการ</h1>
          <p className="text-muted">จัดการกลุ่มบริการของร้าน เช่น บริการเล็บ บริการผม แว็กซ์ขน</p>
        </div>
        <CategoryToolbar />
      </div>

      <Card>
        <Card.Header className="flex flex-row items-center justify-between gap-4">
          <Card.Title>กลุ่มบริการทั้งหมด ({result.total})</Card.Title>
          <CategoryFilter />
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Tag className="size-4" />
              </div>
              <p className="font-medium text-sm">{params.search ? "ไม่พบกลุ่มบริการที่ค้นหา" : "ยังไม่มีกลุ่มบริการ"}</p>
              <p className="max-w-sm text-muted text-sm">
                {params.search ? "ลองค้นหาด้วยคำอื่น" : "กดปุ่ม “เพิ่มกลุ่มบริการ” ด้านบนเพื่อเริ่มต้น"}
              </p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="กลุ่มบริการทั้งหมด">
                <Table.Header>
                  <Table.Column isRowHeader>ชื่อกลุ่มบริการ</Table.Column>
                  <Table.Column className="text-right">จำนวนบริการ</Table.Column>
                  <Table.Column>สถานะ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {result.data.map((category) => (
                    <Table.Row key={category.id}>
                      <Table.Cell>{category.name}</Table.Cell>
                      <Table.Cell className="text-right">{category._count.services}</Table.Cell>
                      <Table.Cell>
                        <Chip color={category.isHidden ? "default" : "success"} variant="soft">
                          <Chip.Label>{category.isHidden ? "ซ่อน" : "แสดง"}</Chip.Label>
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

      <ListPagination
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        basePath="/dashboard/categories"
        searchParams={params}
      />
    </div>
  );
}
