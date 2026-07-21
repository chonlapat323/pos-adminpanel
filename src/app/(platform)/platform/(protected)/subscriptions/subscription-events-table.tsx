"use client";

import { useRouter } from "next/navigation";

import { Chip, Table } from "@heroui/react";

import { SUBSCRIPTION_EVENT_COLORS, SUBSCRIPTION_EVENT_LABELS } from "@/lib/subscription-status";

interface SubscriptionEvent {
  id: string;
  createdAt: string;
  startAt: string;
  endAt: string;
  status: "PENDING" | "TRIALING" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  eventType: "TRIAL_STARTED" | "PURCHASED" | "ADMIN_GRANTED";
  shop: { id: string; name: string; slug: string };
  package: { name: string };
  payments: { amountThb: number; status: "PENDING" | "PAID" | "FAILED" }[];
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "รอชำระเงิน",
  PAID: "ชำระแล้ว",
  FAILED: "ไม่สำเร็จ",
};

export function SubscriptionEventsTable({ events }: { events: SubscriptionEvent[] }) {
  const router = useRouter();

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="เหตุการณ์ subscription ทั้งหมด"
          onRowAction={(key) => {
            const event = events.find((e) => e.id === key);
            if (event) router.push(`/platform/shops/${event.shop.id}`);
          }}
        >
          <Table.Header>
            <Table.Column>เวลา</Table.Column>
            <Table.Column isRowHeader>ร้าน</Table.Column>
            <Table.Column>เหตุการณ์</Table.Column>
            <Table.Column>แพ็กเกจ</Table.Column>
            <Table.Column>ช่วงเวลาใช้งาน</Table.Column>
            <Table.Column className="text-right">ยอดชำระ</Table.Column>
          </Table.Header>
          <Table.Body>
            {events.map((event) => {
              const payment = event.payments[0];
              return (
                <Table.Row key={event.id} id={event.id} className="cursor-pointer">
                  <Table.Cell>
                    {new Date(event.createdAt).toLocaleString("th-TH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </Table.Cell>
                  <Table.Cell>{event.shop.name}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Chip color={SUBSCRIPTION_EVENT_COLORS[event.eventType]} variant="soft">
                        <Chip.Label>{SUBSCRIPTION_EVENT_LABELS[event.eventType]}</Chip.Label>
                      </Chip>
                      {event.status === "CANCELLED" && (
                        <Chip color="danger" variant="soft">
                          <Chip.Label>ยกเลิกแล้ว</Chip.Label>
                        </Chip>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{event.package.name}</Table.Cell>
                  <Table.Cell>
                    {new Date(event.startAt).toLocaleDateString("th-TH")} -{" "}
                    {new Date(event.endAt).toLocaleDateString("th-TH")}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {payment
                      ? `฿${payment.amountThb.toLocaleString("th-TH")} (${PAYMENT_STATUS_LABELS[payment.status] ?? payment.status})`
                      : "-"}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
