import { Scissors } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireApiFetch } from "@/lib/api";

import { ServiceToolbar } from "./service-toolbar";

interface ServiceCategory {
  id: string;
  name: string;
  isHidden: boolean;
}

interface Service {
  id: string;
  name: string;
  price: string;
  durationMinutes: number;
  status: "ACTIVE" | "INACTIVE" | "PROMOTION";
  category: ServiceCategory;
}

function formatBaht(value: string | number) {
  return `฿${Number(value).toLocaleString("th-TH")}`;
}

export default async function ServicesPage() {
  const [categories, services] = await Promise.all([
    requireApiFetch<ServiceCategory[]>("/service-categories"),
    requireApiFetch<Service[]>("/services"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">บริการ</h1>
          <p className="text-muted-foreground">จัดการกลุ่มบริการและบริการย่อยของร้าน</p>
        </div>
        <ServiceToolbar categories={categories} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>บริการทั้งหมด ({services.length})</CardTitle>
          <CardDescription>{categories.length} กลุ่มบริการ</CardDescription>
        </CardHeader>
        {services.length === 0 ? (
          <Empty className="border-none">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Scissors />
              </EmptyMedia>
              <EmptyTitle>{categories.length === 0 ? "ยังไม่มีกลุ่มบริการ" : "ยังไม่มีบริการ"}</EmptyTitle>
              <EmptyDescription>
                {categories.length === 0
                  ? "เริ่มจากกดปุ่ม “เพิ่มกลุ่มบริการ” ด้านบนก่อน แล้วค่อยเพิ่มบริการย่อยในกลุ่มนั้น"
                  : "กดปุ่ม “เพิ่มบริการ” ด้านบนเพื่อเพิ่มบริการแรกของร้าน"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อบริการ</TableHead>
                <TableHead>กลุ่ม</TableHead>
                <TableHead className="text-right">ราคา</TableHead>
                <TableHead className="text-right">ระยะเวลา</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.category.name}</TableCell>
                  <TableCell className="text-right">{formatBaht(service.price)}</TableCell>
                  <TableCell className="text-right">{service.durationMinutes} นาที</TableCell>
                  <TableCell>
                    <Badge variant={service.status === "ACTIVE" ? "default" : "secondary"}>{service.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
