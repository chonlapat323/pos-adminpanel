# Step: Clone → รันจริง (admin panel)

## 0. สิ่งที่ต้องมีก่อน
- Node.js (เวอร์ชันเดียวกับตอน dev)
- PM2 (`npm install -g pm2`) ถ้ายังไม่มี
- **backend ต้อง deploy และรันอยู่แล้วก่อน** (ดู `step.md` ของ backend)

## 1. Clone + ติดตั้ง
```
git clone <repo-url> pos-admin
cd pos-admin
npm install
```

## 2. เช็คไฟล์ `.env.production`
ไฟล์นี้อยู่ใน repo แล้ว ไม่ต้องสร้างเอง — แต่เช็คว่า URL ตรงกับที่ backend deploy จริง:
```
NEXT_PUBLIC_API_URL="https://pos-api.beautyup-enterprise.com"
```
**สำคัญ**: ค่านี้ถูกฝังเข้าไปในไฟล์ตอน build เลย (ไม่ใช่ตอนรัน) ถ้าจะเปลี่ยน URL ทีหลังต้องแก้ไฟล์นี้แล้ว `npm run build` ใหม่เสมอ แก้แค่ `ecosystem.config.js` ไม่มีผลอะไรกับค่านี้

## 3. Build
```
npm run build
```

## 4. รันด้วย PM2
```
pm2 start ecosystem.config.js
pm2 save
```
รันที่ port 3011 (ตั้งใจเลี่ยง port 3001 ที่โปรเจกต์อื่นในเครื่องนี้ใช้อยู่แล้ว) เช็ค log: `pm2 logs pos-admin`

## 5. ต่อ reverse proxy (Caddy)
เพิ่มใน Caddyfile:
```
pos-admin.beautyup-enterprise.com {
    reverse_proxy localhost:3011
}
```
แล้ว reload Caddy

## 6. Login ครั้งแรก
เข้า `https://pos-admin.beautyup-enterprise.com` แล้ว login ด้วยบัญชีที่ backend seed ไว้ให้:
- email: `platform@possystem.local`
- password: `platform1234`

**ต้องเปลี่ยนรหัสผ่านบัญชีนี้ทันที** (ผ่านหน้า "จัดการบัญชี platform admin" ในระบบ) ก่อนเปิดให้คนอื่นใช้งานจริง เพราะรหัสผ่านนี้เป็นค่าตั้งต้นที่รู้กันทั่วไปจากตอน dev
