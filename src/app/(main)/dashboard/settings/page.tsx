import { Card } from "@heroui/react";

import { requireApiFetch } from "@/lib/api";

import { ShopSettingsForm } from "./shop-settings-form";

interface Shop {
  name: string;
  slug: string;
  logoUrl: string | null;
  address: string | null;
  phone: string | null;
  openTime: string | null;
  closeTime: string | null;
  shopType: "NAIL" | "HAIR" | "WAX" | "MULTI";
  bahtPerPoint: number;
  signupBonusPoints: number;
}

export default async function SettingsPage() {
  const shop = await requireApiFetch<Shop>("/shop");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">ตั้งค่าร้าน</h1>
        <p className="text-muted">ชื่อร้าน โลโก้ ที่อยู่ เวลาเปิด-ปิด และอัตราแลก point</p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>{shop.name}</Card.Title>
          <Card.Description>slug: {shop.slug}</Card.Description>
        </Card.Header>
        <Card.Content>
          <ShopSettingsForm shop={shop} />
        </Card.Content>
      </Card>
    </div>
  );
}
