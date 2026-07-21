"use client";

import { useRouter } from "next/navigation";

import { Chip, Table } from "@heroui/react";

import {
  SUBSCRIPTION_EVENT_COLORS,
  SUBSCRIPTION_EVENT_LABELS,
  SUBSCRIPTION_STATUS_COLORS,
  SUBSCRIPTION_STATUS_LABELS,
} from "@/lib/subscription-status";

import { ShopStatusToggle } from "./shop-status-toggle";

interface LatestSubscriptionEvent {
  id: string;
  createdAt: string;
  status: "PENDING" | "TRIALING" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  eventType: "TRIAL_STARTED" | "PURCHASED" | "ADMIN_GRANTED";
  package: { name: string };
}

interface Shop {
  id: string;
  name: string;
  slug: string;
  shopType: string;
  isActive: boolean;
  subscriptionStatus: "PENDING" | "TRIALING" | "ACTIVE" | "EXPIRED";
  subscriptionEndsAt: string | null;
  latestSubscriptionEvent: LatestSubscriptionEvent | null;
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
            <Table.Column>Subscription</Table.Column>
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
                  <div className="flex flex-col items-start gap-1">
                    <Chip color={SUBSCRIPTION_STATUS_COLORS[shop.subscriptionStatus]} variant="soft">
                      <Chip.Label>{SUBSCRIPTION_STATUS_LABELS[shop.subscriptionStatus]}</Chip.Label>
                    </Chip>
                    {shop.latestSubscriptionEvent && (
                      <div className="flex flex-wrap items-center gap-1">
                        <Chip color={SUBSCRIPTION_EVENT_COLORS[shop.latestSubscriptionEvent.eventType]} variant="soft">
                          <Chip.Label>
                            {SUBSCRIPTION_EVENT_LABELS[shop.latestSubscriptionEvent.eventType]} ·{" "}
                            {shop.latestSubscriptionEvent.package.name}
                          </Chip.Label>
                        </Chip>
                        {shop.latestSubscriptionEvent.status === "CANCELLED" && (
                          <Chip color="danger" variant="soft">
                            <Chip.Label>ยกเลิกแล้ว</Chip.Label>
                          </Chip>
                        )}
                      </div>
                    )}
                  </div>
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
