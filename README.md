# 🔍 DC Lookup

Discord kullanıcılarını ID üzerinden arayıp; kullanıcı adı, avatar, banner ve profil bilgilerini hızlı bir şekilde görüntüleyen modern bir lookup uygulaması.

> ⚡ **Gerçek zamanlı Discord API** entegrasyonu  
> 🎨 Next.js + Tailwind ile modern ve responsive UI  
> 🔐 Rate-limit korumalı istek yapısı

---

## ✨ Özellikler

- 🔎 **Discord ID ile kullanıcı arama**
- 🖼️ **Avatar & Banner otomatik çekme**
- 🪪 **Kullanıcı adı / global username gösterimi**
- ⚡ **Gerçek zamanlı Discord REST API bağlantısı**
- 🎨 **Modern tasarım & responsive arayüz**
- 🚫 **Hata yönetimi & geçersiz ID uyarıları**
- 🔐 **Rate limit dostu lightweight API istekleri**

---

## 🧱 Teknoloji Yığını

| Teknoloji | Açıklama |
|----------|----------|
| **Next.js 14+** | App Router ile modern full-stack yapı |
| **TypeScript** | Tip güvenli geliştirme |
| **Tailwind CSS** | Hızlı ve modern stil altyapısı |
| **Discord REST API** | Kullanıcı verilerini almak için |
| **shadcn/ui** (opsiyonel) | Modern component seti |

---

## 📁 Proje Yapısı

```txt
dc-lookup/
├─ public/              # Statik dosyalar
├─ src/
│  ├─ app/              # Next.js App Router sayfaları
│  ├─ components/       # UI bileşenleri
│  ├─ lib/              # API helper'ları, araç fonksiyonları
│  └─ styles/           # Global stiller
├─ tailwind.config.ts
├─ next.config.mjs
├─ package.json
└─ README.md
```

---

## 🚀 Kurulum

### 1️⃣ Depoyu klonla

```bash
git clone https://github.com/TMBilalTM/dc-lookup.git
cd dc-lookup
```

### 2️⃣ Bağımlılıkları yükle

```bash
npm install
# veya
yarn
# veya
pnpm install
```

### 3️⃣ Çalıştır

```bash
npm run dev
```

Tarayıcıda aç:  
👉 http://localhost:3000

---

## ⚙️ Ortam Değişkenleri

Discord API kullanımında aşağıdaki değişkene ihtiyaç duyulabilir:

```env
DISCORD_TOKEN=your_bot_or_user_token
```

> Not: Bazı endpoint’ler token istemese de rate limit ve gelişmiş profil verileri için önerilir.

---

## 🧪 Script’ler

```jsonc
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🗺️ Roadmap

- [ ] Kullanıcı banner URL fallback sistemi  
- [ ] Bot hesaplarını özel şekilde işaretleme  
- [ ] Badge görüntüleme (HypeSquad, Nitro, Boost vb.)  
- [ ] UI animasyonları & skeleton yükleme  
- [ ] API cache sistemi  
- [ ] Mobil daha optimize arayüz  

---

## 🤝 Katkıda Bulunma

1. Forkla  
2. Branch aç  
   ```bash
   git checkout -b feature/yeni-ozellik
   ```
3. Commit et  
   ```bash
   git commit -m "feat: yeni özellik eklendi"
   ```
4. Push et  
5. PR aç

---

## 📄 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır.  
Detaylı bilgi için → `LICENSE`

---

## 👤 İletişim

**@TMBilalTM**  
GitHub: https://github.com/TMBilalTM  

---

