import { Scissors } from "lucide-react";

import { ListPagination } from "@/components/list-pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type PaginatedResult, requireApiFetch } from "@/lib/api";

import { ServiceToolbar } from "./service-toolbar";
import { ServicesFilter } from "./services-filter";

interface Category {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  price: string;
  durationMinutes: number;
  status: "ACTIVE" | "INACTIVE" | "PROMOTION";
  category: Category;
}

interface PageProps {
  searchParams: Promise<{ search?: string; categoryId?: string; status?: string; page?: string }>;
}

function formatBaht(value: string | number) {
  return `฿${Number(value).toLocaleString("th-TH")}`;
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.status) query.set("status", params.status);
  query.set("page", String(page));
  query.set("pageSize", "10");

  const [result, categories] = await Promise.all([
    requireApiFetch<PaginatedResult<Service>>(`/services?${query.toString()}`),
    requireApiFetch<Category[]>("/service-categories/select"),
  ]);

  const hasFilter = Boolean(params.search || params.categoryId || params.status);

  let emptyDescription: string;
  if (hasFilter) {
    emptyDescription = "ลองเปลี่ยนคำค้นหาหรือตัวกรอง";
  } else if (categories.length === 0) {
    emptyDescription = "ไปที่เมนู “กลุ่มบริการ” เพื่อเพิ่มกลุ่มก่อน แล้วค่อยกลับมาเพิ่มบริการ";
  } else {
    emptyDescription = "กดปุ่ม “เพิ่มบริการ” ด้านบนเพื่อเพิ่มบริการแรกของร้าน";
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">บริการ</h1>
          <p className="text-muted-foreground">จัดการบริการย่อยของร้าน</p>
        </div>
        <ServiceToolbar categories={categories} />
      </div>

      <Card>
        <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>บริการทั้งหมด ({result.total})</CardTitle>
          <ServicesFilter categories={categories} />
        </CardHeader>
        {result.data.length === 0 ? (
          <Empty className="border-none">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Scissors />
              </EmptyMedia>
              <EmptyTitle>{hasFilter ? "ไม่พบบริการที่ค้นหา" : "ยังไม่มีบริการ"}</EmptyTitle>
              <EmptyDescription>{emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อบริการ</TableHead>
                <TableHead>กลุ่ม</TableHead>
                <TableHead className="text-right">ราคา</TableHead>
                <TableHead className="text-right">ระยะเวลา</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.category.name}</TableCell>
                  <TableCell className="text-right">{formatBaht(service.price)}</TableCell>
                  <TableCell className="text-right">{service.durationMinutes} นาที</TableCell>
                  <TableCell>
                    <Badge variant={service.status === "ACTIVE" ? "default" : "secondary"}>{service.status}</Badge>
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
        basePath="/dashboard/services"
        searchParams={params}
      />
    </div>
  );
}
