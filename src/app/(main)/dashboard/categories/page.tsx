import { Tag } from "lucide-react";

import { ListPagination } from "@/components/list-pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
          <p className="text-muted-foreground">จัดการกลุ่มบริการของร้าน เช่น บริการเล็บ บริการผม แว็กซ์ขน</p>
        </div>
        <CategoryToolbar />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>กลุ่มบริการทั้งหมด ({result.total})</CardTitle>
          <CategoryFilter />
        </CardHeader>
        {result.data.length === 0 ? (
          <Empty className="border-none">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Tag />
              </EmptyMedia>
              <EmptyTitle>{params.search ? "ไม่พบกลุ่มบริการที่ค้นหา" : "ยังไม่มีกลุ่มบริการ"}</EmptyTitle>
              <EmptyDescription>
                {params.search ? "ลองค้นหาด้วยคำอื่น" : "กดปุ่ม “เพิ่มกลุ่มบริการ” ด้านบนเพื่อเริ่มต้น"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อกลุ่มบริการ</TableHead>
                <TableHead className="text-right">จำนวนบริการ</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-right">{category._count.services}</TableCell>
                  <TableCell>
                    <Badge variant={category.isHidden ? "secondary" : "default"}>
                      {category.isHidden ? "ซ่อน" : "แสดง"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
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
