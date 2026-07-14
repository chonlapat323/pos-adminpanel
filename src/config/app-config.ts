import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "POS Services",
  version: packageJson.version,
  copyright: `© ${currentYear}, POS Services.`,
  meta: {
    title: "POS Services — Admin Panel",
    description: "ระบบจัดการร้านบริการ — Admin panel สำหรับเจ้าของร้าน",
  },
};
