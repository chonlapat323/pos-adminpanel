import { PeriodPills } from "@/components/period-pills";
import { ShopFilterSelect } from "@/components/shop-filter-select";

interface ShopOption {
  id: string;
  name: string;
}

export function DashboardFilter({ shops }: { shops: ShopOption[] }) {
  return (
    <div className="flex items-center gap-2">
      <PeriodPills />
      <ShopFilterSelect shops={shops} />
    </div>
  );
}
