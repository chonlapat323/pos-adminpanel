import { Card, Chip, EmptyState, Table } from "@heroui/react";
import { Scissors } from "lucide-react";

import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { ListPagination } from "@/components/list-pagination";
import type { PaginatedResult } from "@/lib/api";
import { requirePlatformApiFetch } from "@/lib/platform-api";

import { deletePlatformService } from "./actions";
import { ServiceFormDialog } from "./service-form-dialog";
import { ServicesFilter } from "./services-filter";

interface Shop {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  shopId: string;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: string;
  durationMinutes: number;
  status: "ACTIVE" | "INACTIVE" | "PROMOTION";
  imageUrl: string | null;
  shop: Shop;
  category: { id: string; name: string };
}

interface PageProps {
  searchParams: Promise<{ search?: string; shopId?: string; page?: string }>;
}

function formatBaht(value: string | number) {
  return `฿${Number(value).toLocaleString("th-TH")}`;
}

export default async function PlatformServicesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.shopId) query.set("shopId", params.shopId);
  query.set("page", String(page));
  query.set("pageSize", "10");

  const [result, shops, categories] = await Promise.all([
    requirePlatformApiFetch<PaginatedResult<Service>>(`/platform/services?${query.toString()}`),
    requirePlatformApiFetch<Shop[]>("/platform/shops/select"),
    requirePlatformApiFetch<Category[]>("/platform/service-categories/select"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">บริการ (ทุกร้าน)</h1>
          <p className="text-muted">จัดการบริการของทุกร้านบนแพลตฟอร์ม</p>
        </div>
        <ServiceFormDialog shops={shops} categories={categories} />
      </div>

      <Card>
        <Card.Header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Card.Title>บริการทั้งหมด ({result.total})</Card.Title>
          <ServicesFilter shops={shops} />
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Scissors className="size-4" />
              </div>
              <p className="font-medium text-sm">ไม่พบบริการ</p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="บริการทั้งหมด">
                <Table.Header>
                  <Table.Column>รูป</Table.Column>
                  <Table.Column isRowHeader>ชื่อบริการ</Table.Column>
                  <Table.Column>ร้าน</Table.Column>
                  <Table.Column>กลุ่ม</Table.Column>
                  <Table.Column className="text-right">ราคา</Table.Column>
                  <Table.Column>สถานะ</Table.Column>
                  <Table.Column>จัดการ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {result.data.map((service) => (
                    <Table.Row key={service.id}>
                      <Table.Cell>
                        <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-default">
                          {service.imageUrl ? (
                            // biome-ignore lint/performance/noImgElement: local dev image server, next/image remote-pattern config not worth it yet
                            <img src={service.imageUrl} alt="" className="size-full object-cover" />
                          ) : (
                            <Scissors className="size-4 text-muted" />
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>{service.name}</Table.Cell>
                      <Table.Cell>{service.shop.name}</Table.Cell>
                      <Table.Cell>{service.category.name}</Table.Cell>
                      <Table.Cell className="text-right">{formatBaht(service.price)}</Table.Cell>
                      <Table.Cell>
                        <Chip color={service.status === "ACTIVE" ? "success" : "default"} variant="soft">
                          <Chip.Label>{service.status}</Chip.Label>
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <ServiceFormDialog shops={shops} categories={categories} service={service} />
                          <DeleteConfirmButton
                            title="ลบบริการ"
                            description={`ยืนยันลบบริการ "${service.name}" ของร้าน ${service.shop.name}`}
                            successMessage="ลบบริการแล้ว"
                            onConfirm={deletePlatformService.bind(null, service.id)}
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
        basePath="/platform/services"
        searchParams={params}
      />
    </div>
  );
}
