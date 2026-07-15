import { Card, EmptyState } from "@heroui/react";
import { Building2 } from "lucide-react";

import { ListPagination } from "@/components/list-pagination";
import type { PaginatedResult } from "@/lib/api";
import { requirePlatformApiFetch } from "@/lib/platform-api";

import { ShopFilter } from "./shop-filter";
import { ShopToolbar } from "./shop-toolbar";
import { ShopsTable } from "./shops-table";

interface Shop {
  id: string;
  name: string;
  slug: string;
  shopType: string;
  isActive: boolean;
  _count: { members: number; staff: number };
}

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function PlatformShopsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  query.set("page", String(page));
  query.set("pageSize", "10");

  const result = await requirePlatformApiFetch<PaginatedResult<Shop>>(`/platform/shops?${query.toString()}`);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">ร้านทั้งหมด</h1>
          <p className="text-muted">จัดการร้านทั้งหมดบนแพลตฟอร์ม</p>
        </div>
        <ShopToolbar />
      </div>

      <Card>
        <Card.Header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Card.Title>ร้านทั้งหมด ({result.total})</Card.Title>
          <ShopFilter />
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Building2 className="size-4" />
              </div>
              <p className="font-medium text-sm">{params.search ? "ไม่พบร้านที่ค้นหา" : "ยังไม่มีร้าน"}</p>
              <p className="max-w-sm text-muted text-sm">
                {params.search ? "ลองค้นหาด้วยคำอื่น" : "กดปุ่ม “เพิ่มร้าน” ด้านบนเพื่อเริ่มต้น"}
              </p>
            </div>
          </EmptyState>
        ) : (
          <ShopsTable shops={result.data} />
        )}
      </Card>

      <ListPagination
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        basePath="/platform/shops"
        searchParams={params}
      />
    </div>
  );
}
