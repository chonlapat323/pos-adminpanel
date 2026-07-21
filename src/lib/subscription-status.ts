export type SubscriptionStatus = "PENDING" | "TRIALING" | "ACTIVE" | "EXPIRED";

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  PENDING: "รอชำระเงิน",
  TRIALING: "ทดลองใช้ฟรี",
  ACTIVE: "ใช้งานอยู่",
  EXPIRED: "หมดอายุแล้ว",
};

export const SUBSCRIPTION_STATUS_COLORS: Record<SubscriptionStatus, "success" | "warning" | "danger"> = {
  PENDING: "warning",
  TRIALING: "warning",
  ACTIVE: "success",
  EXPIRED: "danger",
};

export type SubscriptionEventType = "TRIAL_STARTED" | "PURCHASED" | "ADMIN_GRANTED";

export const SUBSCRIPTION_EVENT_LABELS: Record<SubscriptionEventType, string> = {
  TRIAL_STARTED: "เริ่มทดลองใช้ฟรี",
  PURCHASED: "ซื้อแพ็กเกจ (Omise)",
  ADMIN_GRANTED: "แอดมินให้/ต่ออายุ",
};

export const SUBSCRIPTION_EVENT_COLORS: Record<SubscriptionEventType, "warning" | "success" | "accent"> = {
  TRIAL_STARTED: "warning",
  PURCHASED: "success",
  ADMIN_GRANTED: "accent",
};
