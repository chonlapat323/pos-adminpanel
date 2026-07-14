"use client";

import { useRouter } from "next/navigation";

import { Pagination } from "@heroui/react";

interface ListPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

function buildHref(basePath: string, searchParams: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") params.set(key, value);
  }
  params.set("page", String(page));
  return `${basePath}?${params.toString()}`;
}

export function ListPagination({ page, pageSize, total, basePath, searchParams }: ListPaginationProps) {
  const router = useRouter();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <Pagination>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={isFirst}
            onPress={() => router.push(buildHref(basePath, searchParams, Math.max(1, page - 1)))}
          >
            ก่อนหน้า
          </Pagination.Previous>
        </Pagination.Item>
        <Pagination.Item>
          <span className="px-3 text-muted text-sm">
            หน้า {page} จาก {totalPages} ({total} รายการ)
          </span>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next
            isDisabled={isLast}
            onPress={() => router.push(buildHref(basePath, searchParams, Math.min(totalPages, page + 1)))}
          >
            ถัดไป
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
