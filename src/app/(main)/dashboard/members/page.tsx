import { Card, EmptyState, Table } from "@heroui/react";
import { Users } from "lucide-react";

import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { ListPagination } from "@/components/list-pagination";
import { type PaginatedResult, requireApiFetch } from "@/lib/api";

import { deleteMember } from "./actions";
import { MemberFilter } from "./member-filter";
import { MemberFormDialog } from "./member-form-dialog";
import { VisitPhotosDialog } from "./visit-photos-dialog";

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
}

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function MembersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  query.set("page", String(page));
  query.set("pageSize", "10");

  const result = await requireApiFetch<PaginatedResult<Member>>(`/members?${query.toString()}`);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">สมาชิก</h1>
          <p className="text-muted">ค้นหาสมาชิก ดู point คงเหลือ และประวัติการใช้บริการ</p>
        </div>
        <MemberFormDialog />
      </div>

      <Card>
        <Card.Header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Card.Title>สมาชิกทั้งหมด ({result.total})</Card.Title>
          <MemberFilter />
        </Card.Header>
        {result.data.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <Users className="size-4" />
              </div>
              <p className="font-medium text-sm">{params.search ? "ไม่พบสมาชิกที่ค้นหา" : "ยังไม่มีสมาชิก"}</p>
              <p className="max-w-sm text-muted text-sm">
                {params.search ? "ลองค้นหาด้วยคำอื่น" : "กดปุ่ม “เพิ่มสมาชิก” ด้านบนเพื่อเริ่มต้น"}
              </p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="สมาชิกทั้งหมด">
                <Table.Header>
                  <Table.Column>รูป</Table.Column>
                  <Table.Column isRowHeader>ชื่อ</Table.Column>
                  <Table.Column>เบอร์โทร</Table.Column>
                  <Table.Column className="text-right">Point คงเหลือ</Table.Column>
                  <Table.Column>สมัครเมื่อ</Table.Column>
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
                      <Table.Cell>{member.phone}</Table.Cell>
                      <Table.Cell className="text-right">{member.pointBalance.toLocaleString("th-TH")}</Table.Cell>
                      <Table.Cell>{new Date(member.createdAt).toLocaleDateString("th-TH")}</Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <VisitPhotosDialog memberId={member.id} memberName={member.name} />
                          <MemberFormDialog member={member} />
                          <DeleteConfirmButton
                            title="ลบสมาชิก"
                            description={`ยืนยันลบสมาชิก "${member.name}" — ประวัติ point และการใช้บริการของสมาชิกนี้จะหายไปด้วย`}
                            successMessage="ลบสมาชิกแล้ว"
                            onConfirm={deleteMember.bind(null, member.id)}
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
        basePath="/dashboard/members"
        searchParams={params}
      />
    </div>
  );
}
