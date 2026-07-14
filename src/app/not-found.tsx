import Link from "next/link";

import { buttonVariants } from "@heroui/react";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center space-y-2 text-center">
      <h1 className="font-semibold text-2xl">Page not found.</h1>
      <p className="text-muted">The page you are looking for could not be found.</p>
      <Link prefetch={false} replace href="/dashboard" className={buttonVariants({ variant: "outline" })}>
        Go back home
      </Link>
    </div>
  );
}
