import { redirect } from "next/navigation";

import { Card, EmptyState, Table } from "@heroui/react";
import { ShieldCheck } from "lucide-react";

import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { requireApiFetch } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

import { deleteRole } from "./actions";
import { RoleFormDialog } from "./role-form-dialog";

interface PermissionOption {
  key: string;
  label: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  _count: { staff: number };
}

export default async function RolesPage() {
  const user = await getCurrentUser();
  if (user?.role !== "OWNER") {
    redirect("/unauthorized");
  }

  const [roles, catalog] = await Promise.all([
    requireApiFetch<Role[]>("/roles"),
    requireApiFetch<PermissionOption[]>("/roles/catalog"),
  ]);

  const labelByKey = new Map(catalog.map((p) => [p.key, p.label]));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">สิทธิ์การใช้งาน (Role)</h1>
          <p className="text-muted">กำหนด role ให้พนักงาน แต่ละ role เลือกได้ว่าจัดการอะไรได้บ้าง</p>
        </div>
        <RoleFormDialog catalog={catalog} />
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Role ทั้งหมด ({roles.length})</Card.Title>
        </Card.Header>
        {roles.length === 0 ? (
          <EmptyState className="border-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-default">
                <ShieldCheck className="size-4" />
              </div>
              <p className="font-medium text-sm">ยังไม่มี role</p>
              <p className="max-w-sm text-muted text-sm">
                เจ้าของร้านมีสิทธิ์เต็มอยู่แล้วเสมอ — สร้าง role เพื่อกำหนดสิทธิ์ที่จำกัดให้พนักงานคนอื่น
              </p>
            </div>
          </EmptyState>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Role ทั้งหมด">
                <Table.Header>
                  <Table.Column isRowHeader>ชื่อ Role</Table.Column>
                  <Table.Column>สิทธิ์การใช้งาน</Table.Column>
                  <Table.Column className="text-right">พนักงานที่ใช้ role นี้</Table.Column>
                  <Table.Column>จัดการ</Table.Column>
                </Table.Header>
                <Table.Body>
                  {roles.map((role) => (
                    <Table.Row key={role.id}>
                      <Table.Cell>{role.name}</Table.Cell>
                      <Table.Cell className="max-w-md">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.length === 0 ? (
                            <span className="text-muted text-xs">ไม่มีสิทธิ์</span>
                          ) : (
                            role.permissions.map((key) => (
                              <span key={key} className="rounded-md bg-default px-2 py-0.5 text-xs">
                                {labelByKey.get(key) ?? key}
                              </span>
                            ))
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-right">{role._count.staff}</Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <RoleFormDialog catalog={catalog} role={role} />
                          <DeleteConfirmButton
                            title="ลบ Role"
                            description={`ยืนยันลบ role "${role.name}"${role._count.staff > 0 ? ` — พนักงาน ${role._count.staff} คนจะไม่มี role นี้อีกต่อไป` : ""}`}
                            successMessage="ลบ role แล้ว"
                            onConfirm={deleteRole.bind(null, role.id)}
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
