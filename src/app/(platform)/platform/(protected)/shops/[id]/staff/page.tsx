import Link from "next/link";

import { Card, Chip, EmptyState, Table } from "@heroui/react";
import { ArrowLeft, UserCog } from "lucide-react";

import { ListPagination } from "@/components/list-pagination";
import type { PaginatedResult } from "@/lib/api";
import { requirePlatformApiFetch } from "@/lib/platform-api";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "OWNER" | "STAFF";
  isActive: boolean;
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function PlatformShopStaffPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (sp.search) query.set("search", sp.search);
  query.set("page", String(page));
  query.set("pageSize", "10");

  const result = await requirePlatformApiFetch<PaginatedResult<Staff>>(
    `/platform/shops/${id}/staff?${query.toString()}`,
  );

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/platform/shops/${id}`} className="flex items-center gap-1 text-muted text-sm hover:underline">
        <ArrowLeft className="size-4" />
        กลับไปหน้ารายละเอียดร้าน
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">พนักงานของร้าน</h1>
        <p className="text-muted">ดูรายชื่อพนักงานของร้านนี้ (อ่านอย่างเดียว)</p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>พนักงานทั้งหมด ({result.total})</Card.Title>
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <UserCog className="size-4" />
              </div>
              <p className="font-medium text-sm">ร้านนี้ยังไม่มีพนักงาน</p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="พนักงานของร้าน">
                <Table.Header>
                  <Table.Column isRowHeader>ชื่อ</Table.Column>
                  <Table.Column>อีเมล</Table.Column>
                  <Table.Column>บทบาท</Table.Column>
                  <Table.Column>สถานะ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {result.data.map((member) => (
                    <Table.Row key={member.id}>
                      <Table.Cell>{member.name}</Table.Cell>
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
        basePath={`/platform/shops/${id}/staff`}
        searchParams={sp}
      />
    </div>
  );
}
