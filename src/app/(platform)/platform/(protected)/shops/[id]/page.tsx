import Link from "next/link";

import { Card, Chip } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

import { requirePlatformApiFetch } from "@/lib/platform-api";

import { ShopStatusToggle } from "../shop-status-toggle";
import { ShopEditDialog } from "./shop-edit-dialog";
import { ShopSlugEditor } from "./shop-slug-editor";

interface ShopDetail {
  id: string;
  name: string;
  slug: string;
  shopType: "NAIL" | "HAIR" | "WAX" | "MULTI";
  address: string | null;
  phone: string | null;
  isActive: boolean;
  bahtPerPoint: number;
  createdAt: string;
  revenueThisMonth: number;
  _count: { members: number; staff: number; services: number };
}

function formatBaht(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

function StatCard({ label, value, href }: { label: string; value: string; href?: string }) {
  const card = (
    <Card className={href ? "transition-colors hover:bg-default" : undefined}>
      <Card.Header>
        <Card.Description>{label}</Card.Description>
        <Card.Title className="text-2xl">{value}</Card.Title>
      </Card.Header>
    </Card>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

export default async function PlatformShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await requirePlatformApiFetch<ShopDetail>(`/platform/shops/${id}`);

  const statCards: { label: string; value: string; href?: string }[] = [
    { label: "รายได้เดือนนี้", value: formatBaht(shop.revenueThisMonth) },
    { label: "สมาชิก", value: shop._count.members.toLocaleString("th-TH"), href: `/platform/members?shopId=${id}` },
    { label: "พนักงาน", value: shop._count.staff.toLocaleString("th-TH"), href: `/platform/staff?shopId=${id}` },
    { label: "บริการ", value: shop._count.services.toLocaleString("th-TH"), href: `/platform/services?shopId=${id}` },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Link href="/platform/shops" className="flex items-center gap-1 text-muted text-sm hover:underline">
        <ArrowLeft className="size-4" />
        กลับไปหน้ารายชื่อร้าน
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{shop.name}</h1>
          <div className="flex items-center gap-2">
            <p className="text-muted">slug: {shop.slug}</p>
            <ShopSlugEditor shopId={shop.id} slug={shop.slug} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Chip color={shop.isActive ? "success" : "danger"} variant="soft">
            <Chip.Label>{shop.isActive ? "ใช้งานอยู่" : "ถูกระงับ"}</Chip.Label>
          </Chip>
          <ShopEditDialog shop={shop} />
          <ShopStatusToggle shopId={shop.id} isActive={shop.isActive} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} href={stat.href} />
        ))}
      </div>

      <Card>
        <Card.Header>
          <Card.Title>ข้อมูลร้าน</Card.Title>
        </Card.Header>
        <Card.Content className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="text-muted text-xs">ประเภทร้าน</span>
            <span className="font-medium text-sm">{shop.shopType}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted text-xs">ที่อยู่</span>
            <span className="font-medium text-sm">{shop.address ?? "-"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted text-xs">เบอร์โทร</span>
            <span className="font-medium text-sm">{shop.phone ?? "-"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted text-xs">อัตราสะสม point (บาทต่อ 1 point)</span>
            <span className="font-medium text-sm">{shop.bahtPerPoint}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted text-xs">สมัครเมื่อ</span>
            <span className="font-medium text-sm">{new Date(shop.createdAt).toLocaleDateString("th-TH")}</span>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
