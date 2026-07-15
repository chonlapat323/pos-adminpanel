import { Card, Chip, EmptyState, Table } from "@heroui/react";
import { UserCog } from "lucide-react";

import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { ListPagination } from "@/components/list-pagination";
import type { PaginatedResult } from "@/lib/api";
import { requirePlatformApiFetch } from "@/lib/platform-api";

import { deletePlatformStaff } from "./actions";
import { StaffFilter } from "./staff-filter";
import { StaffFormDialog } from "./staff-form-dialog";

interface Shop {
  id: string;
  name: string;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "OWNER" | "STAFF";
  isActive: boolean;
  shop: Shop;
}

interface PageProps {
  searchParams: Promise<{ search?: string; shopId?: string; page?: string }>;
}

export default async function PlatformStaffPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.shopId) query.set("shopId", params.shopId);
  query.set("page", String(page));
  query.set("pageSize", "10");

  const [result, shops] = await Promise.all([
    requirePlatformApiFetch<PaginatedResult<Staff>>(`/platform/staff?${query.toString()}`),
    requirePlatformApiFetch<Shop[]>("/platform/shops/select"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">พนักงาน (ทุกร้าน)</h1>
          <p className="text-muted">ดูและจัดการบัญชีพนักงานของทุกร้านบนแพลตฟอร์ม</p>
        </div>
        <StaffFormDialog shops={shops} />
      </div>

      <Card>
        <Card.Header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Card.Title>พนักงานทั้งหมด ({result.total})</Card.Title>
          <StaffFilter shops={shops} />
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <UserCog className="size-4" />
              </div>
              <p className="font-medium text-sm">ไม่พบพนักงาน</p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="พนักงานทั้งหมด">
                <Table.Header>
                  <Table.Column isRowHeader>ชื่อ</Table.Column>
                  <Table.Column>ร้าน</Table.Column>
                  <Table.Column>อีเมล</Table.Column>
                  <Table.Column>บทบาท</Table.Column>
                  <Table.Column>สถานะ</Table.Column>
                  <Table.Column>จัดการ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {result.data.map((member) => (
                    <Table.Row key={member.id}>
                      <Table.Cell>{member.name}</Table.Cell>
                      <Table.Cell>{member.shop.name}</Table.Cell>
                      <Table.Cell>{member.email}</Table.Cell>
                      <Table.Cell>
                        <Chip color={member.role === "OWNER" ? "accent" : "default"} variant="soft">
                          <Chip.Label>{member.role}</Chip.Label>
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <Chip color={member.isActive ? "success" : "default"} variant="soft">
                          <Chip.Label>{member.isActive ? "ใช้งานอยู่" : "ปิดใช้งาน"}</Chip.Label>
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <StaffFormDialog shops={shops} staff={member} />
                          <DeleteConfirmButton
                            title="ลบพนักงาน"
                            description={`ยืนยันลบบัญชีพนักงาน "${member.name}" ของร้าน ${member.shop.name}`}
                            successMessage="ลบพนักงานแล้ว"
                            onConfirm={deletePlatformStaff.bind(null, member.id)}
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
        basePath="/platform/staff"
        searchParams={params}
      />
    </div>
  );
}
