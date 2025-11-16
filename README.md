# 🔍 DC Lookup

Discord kullanıcı ve sunucularını ID üzerinden çözüp; avatar, banner, rozetler, durum mesajı ve sunucu widget verilerini tek sayfada gösteren modern lookup uygulaması.

> ⚡ **Gerçek zamanlı Discord REST / Widget API entegrasyonu**  
> 📚 **Kalıcı arama geçmişi + Keşfet (Discovery) listesi**  
> 🌓 **Dark mode + DarkReader ile otomatik tema filtresi**

---

## ✨ Öne Çıkanlar

- 🔎 **Kullanıcı ID Arama:** Avatar, banner, global username, rozetler ve aktivite bilgileri.
- 🏷️ **Sunucu Çözümleme:** Widget/i davet verileriyle üye sayıları, doğrulama seviyeleri ve açıklamalar.
- 🗂️ **Keşfet (kesfet.tsx):** Widget’ı açık sunucular kalıcı olarak `data/discovery-guilds.json` dosyasında tutulur ve UI’de kartlar halinde listelenir.
- 📜 **Arama Geçmişi:** `historyStore.ts` ile son bakılan kullanıcı/sunucu kayıtları gösterilir.
- 🌙 **Tema Senkronizasyonu:** Light/dark tercihi LocalStorage’da saklanır, DarkReader karanlık modda otomatik aktif olur.
- 🛡️ **Hata Yönetimi:** Discord ve japi.rest istekleri için anlamlı mesajlar, rate-limit kontrollü istek akışı.

---

## 🧱 Teknoloji Yığını

| Teknoloji | Açıklama |
|-----------|----------|
| **Next.js 14 (Pages Router)** | API routes + React bileşenleri aynı projede |
| **React 18 & TypeScript** | Tip güvenli modern UI |
| **Tailwind CSS** | Tasarım sistemi ve hızlı stiller |
| **Axios** | Discord REST çağrıları |
| **DarkReader** | Karanlık tema için dinamik filtre |
| **Discord REST & Widget API** | Kullanıcı ve sunucu verileri |

---

## 📁 Proje Yapısı (özet)

```txt
dc-lookup/
├─ data/
│  └─ discovery-guilds.json        # Keşfet listesi kalıcı deposu
├─ public/
│  └─ png/boosts/...               # Statik varlıklar
├─ src/
│  ├─ pages/
│  │  ├─ index.tsx                 # Ana lookup arayüzü
│  │  ├─ history.tsx               # Geçmiş sayfası
│  │  ├─ kesfet.tsx                # Sunucu keşfet sayfası
│  │  └─ api/
│  │      ├─ user/[id].tsx         # Kullanıcı/sunucu lookup API’si
│  │      └─ discovery.ts          # Keşfet verilerini dönen API
│  └─ styles/globals.css           # Temel stiller
├─ discoveryStore.ts               # Keşfet depolama yardımcıları
├─ historyStore.ts                 # Arama geçmişi yardımı
├─ project.config.ts               # Discord bot token yükleyicisi
├─ tailwind.config.ts
├─ next.config.mjs
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
```

### 3️⃣ Ortam değişkenini ayarla

Kök dizinde bir `.env` dosyası oluşturup bot token’ınızı girin:

```env
DISCORD_BOT_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Bu değer `project.config.ts` üzerinden otomatik okunur; tanımlı değilse uygulama çalışırken hata verir.

### 4️⃣ Geliştirme sunucusunu başlat

```bash
npm run dev
```

Tarayıcı: <http://localhost:3000>

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

## 🔐 Güvenlik Notları

- `.env` varsayılan olarak `.gitignore` içinde; token’ınızı repo dışına taşımayın.
- Keşfet ve geçmiş verileri `data/` dizinindeki JSON dosyalarında tutulur. Paylaşmadan önce içeriği temizleyebilirsiniz.
- Dark mode’da DarkReader tüm sitenin renk paletini filtreler; özel durumlar için `_app.tsx` içindeki `darkreader.enable` ayarlarını değiştirebilirsiniz.

---

## 🗺️ Roadmap

- [ ] Keşfet kartlarında sunucu badge/bot ikonlarını gösterme  
- [ ] Lookup sonuçlarını export edebilme  
- [ ] Rate limit ve hata metriklerini UI’da vurgulama  
- [ ] Mobil deneyim için ek düzenlemeler  

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
Detay: `LICENSE`

---

## 👤 İletişim

**@TMBilalTM**  
GitHub: <https://github.com/TMBilalTM>

---

