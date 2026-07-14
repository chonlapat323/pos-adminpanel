import { Card } from "@heroui/react";

import { requireApiFetch } from "@/lib/api";

interface Shop {
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  openTime: string | null;
  closeTime: string | null;
  shopType: string;
  bahtPerPoint: number;
}

const FIELD_LABELS: { key: keyof Shop; label: string }[] = [
  { key: "name", label: "ชื่อร้าน" },
  { key: "shopType", label: "ประเภทร้าน" },
  { key: "address", label: "ที่อยู่" },
  { key: "phone", label: "เบอร์โทร" },
  { key: "openTime", label: "เวลาเปิด" },
  { key: "closeTime", label: "เวลาปิด" },
  { key: "bahtPerPoint", label: "อัตราสะสม point (บาทต่อ 1 point)" },
];

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
        <Card.Content className="grid gap-3 sm:grid-cols-2">
          {FIELD_LABELS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-muted text-xs">{label}</span>
              <span className="font-medium text-sm">{shop[key] ?? "-"}</span>
            </div>
          ))}
        </Card.Content>
      </Card>
    </div>
  );
}
