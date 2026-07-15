import { Card, EmptyState, Table } from "@heroui/react";
import { Users } from "lucide-react";

import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { ListPagination } from "@/components/list-pagination";
import type { PaginatedResult } from "@/lib/api";
import { requirePlatformApiFetch } from "@/lib/platform-api";

import { deletePlatformMember } from "./actions";
import { MemberFilter } from "./member-filter";
import { MemberFormDialog } from "./member-form-dialog";

interface Shop {
  id: string;
  name: string;
}

interface Member {
  id: string;
  name: string;
  phone: string;
  pointBalance: number;
  birthday: string | null;
  address: string | null;
  photoUrl: string | null;
  note: string | null;
  createdAt: string;
  shop: Shop;
}

interface PageProps {
  searchParams: Promise<{ search?: string; shopId?: string; page?: string }>;
}

export default async function PlatformMembersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.shopId) query.set("shopId", params.shopId);
  query.set("page", String(page));
  query.set("pageSize", "10");

  const [result, shops] = await Promise.all([
    requirePlatformApiFetch<PaginatedResult<Member>>(`/platform/members?${query.toString()}`),
    requirePlatformApiFetch<Shop[]>("/platform/shops/select"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">สมาชิก (ทุกร้าน)</h1>
          <p className="text-muted">ดูและจัดการสมาชิกของทุกร้านบนแพลตฟอร์ม</p>
        </div>
        <MemberFormDialog shops={shops} />
      </div>

      <Card>
        <Card.Header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Card.Title>สมาชิกทั้งหมด ({result.total})</Card.Title>
          <MemberFilter shops={shops} />
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Users className="size-4" />
              </div>
              <p className="font-medium text-sm">ไม่พบสมาชิก</p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="สมาชิกทั้งหมด">
                <Table.Header>
                  <Table.Column>รูป</Table.Column>
                  <Table.Column isRowHeader>ชื่อ</Table.Column>
                  <Table.Column>ร้าน</Table.Column>
                  <Table.Column>เบอร์โทร</Table.Column>
                  <Table.Column className="text-right">Point คงเหลือ</Table.Column>
                  <Table.Column>จัดการ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {result.data.map((member) => (
                    <Table.Row key={member.id}>
                      <Table.Cell>
                        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-border bg-default">
                          {member.photoUrl ? (
                            // biome-ignore lint/performance/noImgElement: local dev image server, next/image remote-pattern config not worth it yet
                            <img src={member.photoUrl} alt="" className="size-full object-cover" />
                          ) : (
                            <Users className="size-4 text-muted" />
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>{member.name}</Table.Cell>
                      <Table.Cell>{member.shop.name}</Table.Cell>
                      <Table.Cell>{member.phone}</Table.Cell>
                      <Table.Cell className="text-right">{member.pointBalance.toLocaleString("th-TH")}</Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <MemberFormDialog shops={shops} member={member} />
                          <DeleteConfirmButton
                            title="ลบสมาชิก"
                            description={`ยืนยันลบสมาชิก "${member.name}" ของร้าน ${member.shop.name}`}
                            successMessage="ลบสมาชิกแล้ว"
                            onConfirm={deletePlatformMember.bind(null, member.id)}
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
        basePath="/platform/members"
        searchParams={params}
      />
    </div>
  );
}
