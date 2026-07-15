"use client";

import { useRouter } from "next/navigation";

import { Chip, Table } from "@heroui/react";

import { ShopStatusToggle } from "./shop-status-toggle";

interface Shop {
  id: string;
  name: string;
  slug: string;
  shopType: string;
  isActive: boolean;
  _count: { members: number; staff: number };
}

export function ShopsTable({ shops }: { shops: Shop[] }) {
  const router = useRouter();

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="ร้านทั้งหมด" onRowAction={(key) => router.push(`/platform/shops/${key}`)}>
          <Table.Header>
            <Table.Column isRowHeader>ชื่อร้าน</Table.Column>
            <Table.Column>ประเภท</Table.Column>
            <Table.Column className="text-right">สมาชิก</Table.Column>
            <Table.Column className="text-right">พนักงาน</Table.Column>
            <Table.Column>สถานะ</Table.Column>
            <Table.Column>จัดการ</Table.Column>
          </Table.Header>
          <Table.Body>
            {shops.map((shop) => (
              <Table.Row key={shop.id} id={shop.id} className="cursor-pointer">
                <Table.Cell>{shop.name}</Table.Cell>
                <Table.Cell>{shop.shopType}</Table.Cell>
                <Table.Cell className="text-right">{shop._count.members}</Table.Cell>
                <Table.Cell className="text-right">{shop._count.staff}</Table.Cell>
                <Table.Cell>
                  <Chip color={shop.isActive ? "success" : "danger"} variant="soft">
                    <Chip.Label>{shop.isActive ? "ใช้งานอยู่" : "ถูกระงับ"}</Chip.Label>
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <ShopStatusToggle shopId={shop.id} isActive={shop.isActive} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
