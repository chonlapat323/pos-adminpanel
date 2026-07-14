import { ShieldCheck } from "lucide-react";

import { LoginForm } from "./login-form";

export default function PlatformLoginPage() {
  return (
    <div className="flex h-dvh">
      <div className="hidden bg-default lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <ShieldCheck className="mx-auto size-12" />
            <div className="space-y-2">
              <h1 className="font-light text-5xl">Platform Admin</h1>
              <p className="text-xl">จัดการร้านทั้งหมดบนแพลตฟอร์ม</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="font-medium text-2xl tracking-tight">Platform Admin เข้าสู่ระบบ</div>
            <div className="mx-auto max-w-xl text-muted">สำหรับผู้ดูแลแพลตฟอร์มเท่านั้น</div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
