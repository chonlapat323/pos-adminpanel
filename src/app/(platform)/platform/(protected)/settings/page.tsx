import { Card } from "@heroui/react";

import { requirePlatformApiFetch } from "@/lib/platform-api";

import { SettingsForm } from "./settings-form";

interface PlatformSettings {
  OMISE_PUBLIC_KEY: string | null;
}

export default async function PlatformSettingsPage() {
  const settings = await requirePlatformApiFetch<PlatformSettings>("/platform/settings");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">ตั้งค่าระบบ</h1>
        <p className="text-muted">ค่าคอนฟิกที่แอปมือถือ/หน้าเว็บดึงไปใช้ตอนรันจริง</p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Omise</Card.Title>
          <Card.Description>ใช้สำหรับรับชำระเงินด้วยบัตรเครดิต/เดบิตในแอป POS</Card.Description>
        </Card.Header>
        <Card.Content>
          <SettingsForm omisePublicKey={settings.OMISE_PUBLIC_KEY} />
        </Card.Content>
      </Card>
    </div>
  );
}
