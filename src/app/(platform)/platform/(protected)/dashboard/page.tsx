import { Card } from "@heroui/react";
import { Cake, DollarSign, ImageIcon, Store, TrendingDown, TrendingUp, UserCog, Users } from "lucide-react";

import { requirePlatformApiFetch } from "@/lib/platform-api";
import { cn } from "@/lib/utils";

import { DashboardFilter } from "./dashboard-filter";

interface Shop {
  id: string;
  name: string;
}

interface RevenueBucket {
  label: string;
  value: number;
}

interface TopServiceItem {
  serviceId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface StaffSaleItem {
  staffId: string;
  name: string;
  shopName: string;
  totalSales: number;
  billCount: number;
}

interface NewMemberItem {
  id: string;
  name: string;
  phone: string;
  shopName: string;
  createdAt: string;
}

interface BirthdayItem {
  name: string;
  shopName: string;
  pointBalance: number;
  date: string;
}

interface VisitPhotoGroup {
  member: string;
  service: string | null;
  when: string;
  before?: string;
  after?: string;
}

interface PlatformDashboardStats {
  totalShops: number;
  activeShops: number;
  suspendedShops: number;
  totalMembers: number;
  newMembersCount: number;
  totalStaff: number;
  revenue: number;
  revenueDelta: { percent: number; up: boolean } | null;
  revenueSeries: RevenueBucket[];
  revenueByShop: { name: string; revenue: number }[] | null;
  topServices: TopServiceItem[];
  staffSales: StaffSaleItem[];
  newMembers: NewMemberItem[];
  birthdays: BirthdayItem[];
  recentVisitPhotos: VisitPhotoGroup[];
  period: "today" | "week" | "month" | "all";
}

interface PageProps {
  searchParams: Promise<{ period?: string; shopId?: string }>;
}

const PERIOD_LABELS: Record<string, string> = {
  today: "วันนี้",
  week: "สัปดาห์นี้",
  month: "เดือนนี้",
  all: "ทั้งหมด",
};

const CHART_SUBTITLES: Record<string, string> = {
  today: "รายชั่วโมง · วันนี้",
  week: "รายวัน · 7 วันล่าสุด",
  month: "รายสัปดาห์ · เดือนนี้",
  all: "รายเดือน · 6 เดือนล่าสุด",
};

function formatBaht(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

function initials(name: string) {
  return name.trim().charAt(0);
}

function formatRelative(dateString: string) {
  const date = new Date(dateString);
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "วันนี้";
  if (days === 1) return "เมื่อวาน";
  return `${days} วันก่อน`;
}

function percentOf(value: number, max: number) {
  return Math.round((value / max) * 100);
}

function KpiIcon({ icon: Icon }: { icon: typeof DollarSign }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/[0.06] text-accent">
      <Icon className="size-4" />
    </span>
  );
}

export default async function PlatformDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = new URLSearchParams();
  if (params.period) query.set("period", params.period);
  if (params.shopId) query.set("shopId", params.shopId);

  const [stats, shops] = await Promise.all([
    requirePlatformApiFetch<PlatformDashboardStats>(`/platform/shops/dashboard?${query.toString()}`),
    requirePlatformApiFetch<Shop[]>("/platform/shops/select"),
  ]);

  const maxBar = Math.max(...stats.revenueSeries.map((b) => b.value), 1);
  const maxBreakdown = stats.revenueByShop ? Math.max(...stats.revenueByShop.map((s) => s.revenue), 1) : 1;
  const maxTopService = Math.max(...stats.topServices.map((s) => s.totalRevenue), 1);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">ภาพรวมแพลตฟอร์ม</h1>
          <p className="text-muted">สรุปข้อมูลรวมทุกร้านบนแพลตฟอร์ม</p>
        </div>
        <DashboardFilter shops={shops} />
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Description>
                รายได้{params.shopId ? "" : "ทุกร้าน"} · {PERIOD_LABELS[stats.period]}
              </Card.Description>
              <KpiIcon icon={DollarSign} />
            </div>
            <Card.Title className="text-2xl">{formatBaht(stats.revenue)}</Card.Title>
          </Card.Header>
          <Card.Content>
            {stats.revenueDelta ? (
              <p
                className={cn(
                  "flex items-center gap-1 text-xs font-semibold",
                  stats.revenueDelta.up ? "text-success" : "text-danger",
                )}
              >
                {stats.revenueDelta.up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                {Math.abs(stats.revenueDelta.percent)}%<span className="font-normal text-muted">เทียบช่วงก่อน</span>
              </p>
            ) : (
              <p className="text-muted text-xs">เทียบช่วงก่อน · —</p>
            )}
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Description>ร้านทั้งหมด</Card.Description>
              <KpiIcon icon={Store} />
            </div>
            <Card.Title className="text-2xl">{stats.totalShops.toLocaleString("th-TH")}</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-muted text-xs">
              {stats.activeShops} ใช้งาน · {stats.suspendedShops} ระงับ
            </p>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Description>สมาชิกทั้งหมด</Card.Description>
              <KpiIcon icon={Users} />
            </div>
            <Card.Title className="text-2xl">{stats.totalMembers.toLocaleString("th-TH")}</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-xs font-semibold text-success">
              +{stats.newMembersCount} <span className="font-normal text-muted">เดือนนี้</span>
            </p>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Description>พนักงานทั้งหมด</Card.Description>
              <KpiIcon icon={UserCog} />
            </div>
            <Card.Title className="text-2xl">{stats.totalStaff.toLocaleString("th-TH")}</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-muted text-xs">ทั้ง {stats.totalShops} ร้าน</p>
          </Card.Content>
        </Card>
      </div>

      {/* revenue chart + breakdown */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>รายได้ทุกร้าน</Card.Title>
            <Card.Description>{CHART_SUBTITLES[stats.period]}</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="flex h-56 items-end gap-2 border-border border-b pb-7">
              {stats.revenueSeries.map((bucket) => {
                const height = percentOf(bucket.value, maxBar);
                return (
                  <div key={bucket.label} className="relative flex h-full flex-1 flex-col items-center justify-end">
                    <div
                      title={formatBaht(bucket.value)}
                      className={cn(
                        "w-full max-w-10 rounded-t-md transition-all",
                        height >= 100 ? "bg-accent" : "bg-border-secondary",
                      )}
                      style={{ height: `${height}%` }}
                    />
                    <span className="absolute -bottom-6 whitespace-nowrap text-[11px] text-muted">{bucket.label}</span>
                  </div>
                );
              })}
            </div>
          </Card.Content>
        </Card>

        {stats.revenueByShop && (
          <Card>
            <Card.Header>
              <Card.Title>รายได้ตามร้าน</Card.Title>
              <Card.Description>สัดส่วน{PERIOD_LABELS[stats.period]}</Card.Description>
            </Card.Header>
            <Card.Content className="flex flex-col gap-4">
              {stats.revenueByShop.map((s) => (
                <div key={s.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted text-xs">{formatBaht(s.revenue)}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-default">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${percentOf(s.revenue, maxBreakdown)}%` }}
                    />
                  </div>
                </div>
              ))}
            </Card.Content>
          </Card>
        )}
      </div>

      {/* top services + staff leaderboard */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title>บริการขายดี</Card.Title>
            <Card.Description>จัดอันดับตามรายได้รวม</Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-4">
            {stats.topServices.length === 0 ? (
              <p className="text-muted text-sm">ยังไม่มีข้อมูลการขาย</p>
            ) : (
              stats.topServices.map((s, i) => (
                <div key={s.serviceId} className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-default font-semibold text-muted text-xs">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                      <span className="truncate font-medium text-sm">{s.name}</span>
                      <span className="shrink-0 font-semibold text-sm">{formatBaht(s.totalRevenue)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-default">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${percentOf(s.totalRevenue, maxTopService)}%` }}
                        />
                      </div>
                      <span className="shrink-0 whitespace-nowrap text-[11px] text-muted">{s.totalQuantity} ครั้ง</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>ยอดขายต่อพนักงาน</Card.Title>
            <Card.Description>รวมทุกร้าน</Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col">
            {stats.staffSales.length === 0 ? (
              <p className="text-muted text-sm">ยังไม่มีข้อมูลการขาย</p>
            ) : (
              stats.staffSales.map((s, i) => (
                <div key={s.staffId} className="flex items-center gap-3 border-border border-b py-2.5 last:border-0">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full font-bold text-[11px]",
                      i < 3 ? "bg-accent text-accent-foreground" : "bg-default text-muted",
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{s.name}</p>
                    <p className="text-[11px] text-muted">
                      {s.shopName} · {s.billCount} บิล
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-sm">{formatBaht(s.totalSales)}</span>
                </div>
              ))
            )}
          </Card.Content>
        </Card>
      </div>

      {/* new members / birthdays / before-after */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <Card.Header>
            <Card.Title>สมาชิกใหม่ล่าสุด</Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3.5">
            {stats.newMembers.length === 0 ? (
              <p className="text-muted text-sm">ยังไม่มีสมาชิกใหม่</p>
            ) : (
              stats.newMembers.map((m) => (
                <div key={m.id} className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-default font-semibold text-xs">
                    {initials(m.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{m.name}</p>
                    <p className="truncate text-[11px] text-muted">{m.shopName}</p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap text-[11px] text-muted">
                    {formatRelative(m.createdAt)}
                  </span>
                </div>
              ))
            )}
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Card.Title>วันเกิดใกล้ถึง</Card.Title>
              <span className="rounded-full bg-warning-soft px-2 py-0.5 font-semibold text-[11px] text-warning">
                7 วัน
              </span>
            </div>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3.5">
            {stats.birthdays.length === 0 ? (
              <p className="text-muted text-sm">ไม่มีวันเกิดใน 7 วันนี้</p>
            ) : (
              stats.birthdays.map((b) => (
                <div key={`${b.name}-${b.date}`} className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning">
                    <Cake className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{b.name}</p>
                    <p className="truncate text-[11px] text-muted">{b.shopName}</p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap font-semibold text-warning text-xs">{b.date}</span>
                </div>
              ))
            )}
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>รูปก่อน-หลังล่าสุด</Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3.5">
            {stats.recentVisitPhotos.length === 0 ? (
              <p className="text-muted text-sm">ยังไม่มีรูปก่อน-หลัง</p>
            ) : (
              stats.recentVisitPhotos.map((p, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: rows have no stable id from the API
                <div key={i} className="flex items-center gap-2.5">
                  <div className="flex shrink-0 gap-0.5">
                    <div className="flex size-9 items-center justify-center overflow-hidden rounded-l-lg bg-default text-muted">
                      {p.before ? (
                        // biome-ignore lint/performance/noImgElement: local dev image server, next/image remote-pattern config not worth it yet
                        <img src={p.before} alt="" className="size-full object-cover" />
                      ) : (
                        <ImageIcon className="size-4" />
                      )}
                    </div>
                    <div className="flex size-9 items-center justify-center overflow-hidden rounded-r-lg bg-default text-muted">
                      {p.after ? (
                        // biome-ignore lint/performance/noImgElement: local dev image server, next/image remote-pattern config not worth it yet
                        <img src={p.after} alt="" className="size-full object-cover" />
                      ) : (
                        <ImageIcon className="size-4" />
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-xs">{p.service ?? p.member}</p>
                    <p className="truncate text-[11px] text-muted">{p.member}</p>
                  </div>
                </div>
              ))
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
