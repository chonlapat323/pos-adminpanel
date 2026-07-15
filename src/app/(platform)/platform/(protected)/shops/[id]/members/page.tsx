import Link from "next/link";

import { Card, EmptyState, Table } from "@heroui/react";
import { ArrowLeft, Users } from "lucide-react";

import { ListPagination } from "@/components/list-pagination";
import type { PaginatedResult } from "@/lib/api";
import { requirePlatformApiFetch } from "@/lib/platform-api";

interface Member {
  id: string;
  name: string;
  phone: string;
  pointBalance: number;
  createdAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function PlatformShopMembersPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (sp.search) query.set("search", sp.search);
  query.set("page", String(page));
  query.set("pageSize", "10");

  const result = await requirePlatformApiFetch<PaginatedResult<Member>>(
    `/platform/shops/${id}/members?${query.toString()}`,
  );

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/platform/shops/${id}`} className="flex items-center gap-1 text-muted text-sm hover:underline">
        <ArrowLeft className="size-4" />
        กลับไปหน้ารายละเอียดร้าน
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">สมาชิกของร้าน</h1>
        <p className="text-muted">ดูรายชื่อสมาชิกของร้านนี้ (อ่านอย่างเดียว)</p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>สมาชิกทั้งหมด ({result.total})</Card.Title>
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Users className="size-4" />
              </div>
              <p className="font-medium text-sm">ร้านนี้ยังไม่มีสมาชิก</p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="สมาชิกของร้าน">
                <Table.Header>
                  <Table.Column isRowHeader>ชื่อ</Table.Column>
                  <Table.Column>เบอร์โทร</Table.Column>
                  <Table.Column className="text-right">Point คงเหลือ</Table.Column>
                  <Table.Column>สมัครเมื่อ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {result.data.map((member) => (
                    <Table.Row key={member.id}>
                      <Table.Cell>{member.name}</Table.Cell>
                      <Table.Cell>{member.phone}</Table.Cell>
                      <Table.Cell className="text-right">{member.pointBalance.toLocaleString("th-TH")}</Table.Cell>
                      <Table.Cell>{new Date(member.createdAt).toLocaleDateString("th-TH")}</Table.Cell>
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
        basePath={`/platform/shops/${id}/members`}
        searchParams={sp}
      />
    </div>
  );
}
