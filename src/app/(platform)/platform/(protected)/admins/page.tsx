import { redirect } from "next/navigation";

import { Card, Chip, EmptyState, Table } from "@heroui/react";
import { UserCog } from "lucide-react";

import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { requirePlatformApiFetch } from "@/lib/platform-api";
import { getCurrentPlatformAdminFull } from "@/lib/platform-auth";

import { deletePlatformAdminAccount } from "./actions";
import { AdminFormDialog } from "./admin-form-dialog";

interface Role {
  id: string;
  name: string;
}

interface PlatformAdminAccount {
  id: string;
  name: string;
  email: string;
  isSuperAdmin: boolean;
  roleId: string | null;
  roleRef: Role | null;
}

export default async function PlatformAdminsPage() {
  const currentAdmin = await getCurrentPlatformAdminFull();
  if (!currentAdmin?.isSuperAdmin) {
    redirect("/unauthorized");
  }

  const [admins, roles] = await Promise.all([
    requirePlatformApiFetch<PlatformAdminAccount[]>("/platform/admins"),
    requirePlatformApiFetch<Role[]>("/platform/roles"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Platform Admin</h1>
          <p className="text-muted">จัดการบัญชีทีมงานกลางที่เข้าดูแลแพลตฟอร์ม</p>
        </div>
        <AdminFormDialog roles={roles} />
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Admin ทั้งหมด ({admins.length})</Card.Title>
        </Card.Header>
        {admins.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <UserCog className="size-4" />
              </div>
              <p className="font-medium text-sm">ยังไม่มี admin</p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Admin ทั้งหมด">
                <Table.Header>
                  <Table.Column isRowHeader>ชื่อ</Table.Column>
                  <Table.Column>อีเมล</Table.Column>
                  <Table.Column>Role</Table.Column>
                  <Table.Column>สถานะ</Table.Column>
                  <Table.Column>จัดการ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {admins.map((account) => (
                    <Table.Row key={account.id}>
                      <Table.Cell>{account.name}</Table.Cell>
                      <Table.Cell>{account.email}</Table.Cell>
                      <Table.Cell>{account.roleRef?.name ?? "-"}</Table.Cell>
                      <Table.Cell>
                        <Chip color={account.isSuperAdmin ? "accent" : "default"} variant="soft">
                          <Chip.Label>{account.isSuperAdmin ? "Super-admin" : "จำกัดสิทธิ์"}</Chip.Label>
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <AdminFormDialog roles={roles} admin={account} />
                          <DeleteConfirmButton
                            title="ลบ Admin"
                            description={`ยืนยันลบบัญชี admin "${account.name}"`}
                            successMessage="ลบ admin แล้ว"
                            onConfirm={deletePlatformAdminAccount.bind(null, account.id)}
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
    </div>
  );
}
