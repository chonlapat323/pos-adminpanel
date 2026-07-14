import { Scissors } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex h-dvh">
      <div className="hidden bg-accent lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <Scissors className="mx-auto size-12 text-accent-foreground" />
            <div className="space-y-2">
              <h1 className="font-light text-5xl text-accent-foreground">{APP_CONFIG.name}</h1>
              <p className="text-accent-foreground/80 text-xl">ระบบจัดการร้านบริการ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="font-medium text-2xl tracking-tight">เข้าสู่ระบบ</div>
            <div className="mx-auto max-w-xl text-muted">สำหรับเจ้าของร้านและพนักงาน</div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
