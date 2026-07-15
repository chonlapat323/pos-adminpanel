import { Card, Chip, EmptyState, Table } from "@heroui/react";
import { Scissors } from "lucide-react";

import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { ListPagination } from "@/components/list-pagination";
import { type PaginatedResult, requireApiFetch } from "@/lib/api";

import { deleteService } from "./actions";
import { ServiceFormDialog } from "./service-form-dialog";
import { ServicesFilter } from "./services-filter";

interface Category {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
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
          <p className="text-muted">จัดการบริการย่อยของร้าน</p>
        </div>
        <ServiceFormDialog categories={categories} />
      </div>

      <Card>
        <Card.Header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Card.Title>บริการทั้งหมด ({result.total})</Card.Title>
          <ServicesFilter categories={categories} />
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Scissors className="size-4" />
              </div>
              <p className="font-medium text-sm">{hasFilter ? "ไม่พบบริการที่ค้นหา" : "ยังไม่มีบริการ"}</p>
              <p className="max-w-sm text-muted text-sm">{emptyDescription}</p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="บริการทั้งหมด">
                <Table.Header>
                  <Table.Column isRowHeader>ชื่อบริการ</Table.Column>
                  <Table.Column>กลุ่ม</Table.Column>
                  <Table.Column className="text-right">ราคา</Table.Column>
                  <Table.Column className="text-right">ระยะเวลา</Table.Column>
                  <Table.Column>สถานะ</Table.Column>
                  <Table.Column>จัดการ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {result.data.map((service) => (
                    <Table.Row key={service.id}>
                      <Table.Cell>{service.name}</Table.Cell>
                      <Table.Cell>{service.category.name}</Table.Cell>
                      <Table.Cell className="text-right">{formatBaht(service.price)}</Table.Cell>
                      <Table.Cell className="text-right">{service.durationMinutes} นาที</Table.Cell>
                      <Table.Cell>
                        <Chip color={service.status === "ACTIVE" ? "success" : "default"} variant="soft">
                          <Chip.Label>{service.status}</Chip.Label>
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <ServiceFormDialog categories={categories} service={service} />
                          <DeleteConfirmButton
                            title="ลบบริการ"
                            description={`ยืนยันลบบริการ "${service.name}"`}
                            successMessage="ลบบริการแล้ว"
                            onConfirm={() => deleteService(service.id)}
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
        basePath="/dashboard/services"
        searchParams={params}
      />
    </div>
  );
}
