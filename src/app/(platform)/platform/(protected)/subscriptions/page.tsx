import { Card, EmptyState } from "@heroui/react";
import { Receipt } from "lucide-react";

import { ListPagination } from "@/components/list-pagination";
import type { PaginatedResult } from "@/lib/api";
import { requirePlatformApiFetch } from "@/lib/platform-api";

import { SubscriptionEventsFilter } from "./subscription-events-filter";
import { SubscriptionEventsTable } from "./subscription-events-table";

interface SubscriptionEvent {
  id: string;
  createdAt: string;
  startAt: string;
  endAt: string;
  eventType: "TRIAL_STARTED" | "PURCHASED" | "ADMIN_GRANTED";
  shop: { id: string; name: string; slug: string };
  package: { name: string };
  payments: { amountThb: number; status: "PENDING" | "PAID" | "FAILED" }[];
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    eventType?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
  }>;
}

export default async function PlatformSubscriptionEventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.eventType) query.set("eventType", params.eventType);
  if (params.dateFrom) query.set("dateFrom", params.dateFrom);
  if (params.dateTo) query.set("dateTo", params.dateTo);
  query.set("page", String(page));
  query.set("pageSize", "20");

  const result = await requirePlatformApiFetch<PaginatedResult<SubscriptionEvent>>(
    `/platform/shops/subscriptions?${query.toString()}`,
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">ประวัติ Subscription</h1>
        <p className="text-muted">เหตุการณ์เริ่มทดลองใช้ฟรี/ซื้อแพ็กเกจ/แอดมินให้แพ็กเกจ ของทุกร้าน เรียงตามเวลาล่าสุด</p>
      </div>

      <Card>
        <Card.Header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Card.Title>เหตุการณ์ทั้งหมด ({result.total})</Card.Title>
          <SubscriptionEventsFilter />
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Receipt className="size-4" />
              </div>
              <p className="font-medium text-sm">
                {params.search || params.eventType || params.dateFrom || params.dateTo
                  ? "ไม่พบเหตุการณ์ที่ตรงกับตัวกรอง"
                  : "ยังไม่มีเหตุการณ์"}
              </p>
            </div>
          </EmptyState>
        ) : (
          <SubscriptionEventsTable events={result.data} />
        )}
      </Card>

      <ListPagination
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        basePath="/platform/subscriptions"
        searchParams={params}
      />
    </div>
  );
}
