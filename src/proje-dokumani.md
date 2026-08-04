# Galerim — Oto Galeri Yönetimi

> **Paket Adı:** `com.bulutgrup.galerim`
> **Alt Yapı Tipi:** SaaS — Multi-tenant
> **Uygulama Türü:** Google Play & Apple Store
> **Domain:** [galerim.app](http://galerim.app)

---

## 📌 Marka Varlıkları

| Varlık | Dosya |
|---|---|
| **Uygulama İkonu** | [galerim_icon.png](file:///Users/fatihakyildiz/Projeler/14-Galerim/src/galerim_icon.png) |
| **Logo & Açılış Resmi** | [galerim_logo.png](file:///Users/fatihakyildiz/Projeler/14-Galerim/src/galerim_logo.png) |
| **Kapak Görseli** | [galerim_kapak.png](file:///Users/fatihakyildiz/Projeler/14-Galerim/src/galerim_kapak.png) |
| **iyzico Logosu** | [iyzico.png](file:///Users/fatihakyildiz/Projeler/14-Galerim/src/iyzico.png) (Footer'a eklenecek) |

---

## 📐 Tasarım Dosyaları

Tüm UI/UX tasarımları `src/design/` klasöründe yer almaktadır:

| Tasarım | Dosya |
|---|---|
| Landing Page | [Galerim Landing.html](file:///Users/fatihakyildiz/Projeler/14-Galerim/src/design/Galerim%20Landing.html) |
| Mobil Uygulama | [Galerim Mobil.html](file:///Users/fatihakyildiz/Projeler/14-Galerim/src/design/Galerim%20Mobil.html) |
| Super Admin Panel | [Galerim Super Admin.html](file:///Users/fatihakyildiz/Projeler/14-Galerim/src/design/Galerim%20Super%20Admin.html) |
| Tenant Panel | [Galerim Tenant Panel.html](file:///Users/fatihakyildiz/Projeler/14-Galerim/src/design/Galerim%20Tenant%20Panel.html) |

---

## 💳 Abonelik ve Ödeme Sistemi

| Özellik | Detay |
|---|---|
| **Ödeme Altyapısı** | iyzico |
| **Paket Yapısı** | Tek paket — Aylık & Yıllık |
| **Aylık Fiyat** | **6.490 ₺** |
| **Yıllık Fiyat** | **48.000 ₺** |
| **Satın Alma Noktası** | Landing sayfası (web arayüzü) üzerinden |
| **Süre Kontrolü** | Paket süre bitişleri otomatik kontrol edilecek |

---

## 🗄️ Veritabanı ve Arka Uç (Backend)

**Altyapı:** Supabase (PostgreSQL, Edge Functions, SQL Triggers)

| Parametre | Değer |
|---|---|
| **URL** | `https://outepnfkeitrlauzpzme.supabase.co` |
| **ANON_PUBLIC** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dGVwbmZrZWl0cmxhdXpwem1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4ODkwNDQsImV4cCI6MjA5OTQ2NTA0NH0.boPaNJvxWZh7tc9V9rryMh6KChAXEqqWyNNqabgrb_M` |
| **SERVICE_ROLE** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dGVwbmZrZWl0cmxhdXpwem1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzg4OTA0NCwiZXhwIjoyMDk5NDY1MDQ0fQ.LMzk7lTn0dVhjP_bmTIs4uwYxIoADEAj8xPx-kFdmbE` |

---

## 🏗️ Teknoloji Yığını

| Bileşen | Teknoloji |
|---|---|
| **Landing Page** | Web (HTML/CSS/JS) |
| **Mobil POS Uygulaması** | React Native, Expo Router |
| **SuperAdmin Kontrol Paneli (CP)** | React, Vite |
| **Tenant Web Panel** | React, Vite |
| **Backend** | Supabase (PostgreSQL, Edge Functions, SQL Triggers) |
| **Ödeme Entegrasyonu** | iyzico |

---

## 🌐 Sayfa Yapıları & Adresler

### 1. Ana Web Sitesi (Landing Page)

| Özellik | Detay |
|---|---|
| **Adres** | [http://galerim.app](http://galerim.app) |
| **Amaç** | Tanıtım, paket satın alma, kurumsal sayfalar |

**İçerik:**
- Sistemin özellikleri ve tanıtımı
- Abonelik paketleri ve iyzico üzerinden satın alma
- İletişim
- Hakkımızda
- Mesafeli Satış Sözleşmesi
- Gizlilik Politikası
- Teslimat ve İade Şartları

> **Not:** Sabit içerikler [sabit-icerik.txt](file:///Users/fatihakyildiz/Projeler/14-Galerim/src/sabit-icerik.txt) dosyasında yer almaktadır.
> Footer kısmına [iyzico.png](file:///Users/fatihakyildiz/Projeler/14-Galerim/src/iyzico.png) logosu eklenecek.

---

### 2. Yönetim Paneli (Tenant Web Panel)

| Özellik | Detay |
|---|---|
| **Adres** | `http://galeriadi.galerim.app` (her üyeye özel subdomain) |
| **Amaç** | Galeri sahiplerinin tüm işlemlerini yapacağı panel |

**Açıklama:**
- Her üye işletmeye özel subdomain atanacak
- Galeriler bu adresten kendi panellerine ulaşacak
- Buradaki değişiklikler mobil uygulamada da yansıyacak
- Araç listesi **satış fiyatları** ile yayımlanacak (alış fiyatı dış görünümde gizli)
- Yönetici şifresi ile giriş yapıldığında tüm işlemler yapılabilecek

---

### 3. Süper Admin Kontrol Paneli (Control Panel — CP)

| Özellik | Detay |
|---|---|
| **Adres** | [http://cpgm.galerim.app](http://cpgm.galerim.app) |
| **Amaç** | Platform sahibinin (BulutGrup) yönetim ekranı |

**Erişim Yetkileri:**
- **Sadece** `admin@bulutgrup.tr` ve `root@bulutgrup.tr` adresleri giriş yapabilecek
- Başka hiçbir kullanıcı giriş yapamayacak

**Özellikler:**
- Tüm galerilerin araç listesi (alış + satış fiyatları dahil)
- Yeni üye kaydı geldiğinde `admin@bulutgrup.tr` ve `root@bulutgrup.tr` adreslerine bildirim maili
- Üye olan kullanıcıların kontrolü:
  - Üyelik başlangıç / bitiş tarihi
  - Paket satın almaları
  - **30 / 60 / 90 / 365 gün hediye verme** yetkisi
- Üye işletme detay sayfası:
  - Toplam araç sayısı
  - Araç detay bilgileri
  - Alış fiyatı, satış fiyatı
  - Aylık kâr marjı

---

### 4. Mobil Uygulama (Web Sürümü)

| Özellik | Detay |
|---|---|
| **Adres** | `http://galeriadi.galerim.app` |
| **Amaç** | Web panelin mobil uygulaması |
| **Teknoloji** | React Native, Expo Router |

**Açıklama:** Tenant Web Panel'deki tüm özellikler mobilden de kontrol edilecek.

---

### 5. Üye Web Sitesi (Dış Görünüm)

| Özellik | Detay |
|---|---|
| **Adres** | `https://isletmeadi.galerim.app` |
| **Amaç** | Müşterilerin galeri araç listesini görebileceği dış site |

**Açıklama:**
- Üye olan tüm işletmelere kendilerine ait subdomain verilecek
- Dışarıdan ziyaret eden müşteriler:
  - Araç listesini görecek
  - Araçların detaylı bilgilerini görecek
  - **Satış fiyatlarını** görecek (alış fiyatı gizli)
  - İşletmenin iletişim bilgilerini görecek

---

## 📱 Mobil Navigasyon

**Menü Yapısı:** Hamburger Menü

**Tab Bar:**

| Sıra | Tab |
|---|---|
| 1 | Genel |
| 2 | Araçlar |
| 3 | Müşteriler |
| 4 | Banka |

---

## 📧 Admin Bilgilendirme Sistemi

| Olay | Aksiyon |
|---|---|
| Yeni üyelik kaydı | Anında mail gönderimi |
| **Alıcı** | `admin@bulutgrup.tr` ve `root@bulutgrup.tr` |
| **Mail İçeriği** | Yetkili kişi, telefon, e-posta, slug linki |

---

## 📄 Sayfa Detayları — Modüller

### 🔷 Süper Admin (CP) Sayfaları

| Sayfa | Açıklama |
|---|---|
| **Genel Bakış** | Dashboard — genel durum özeti |
| **İşletmeler** | Üye işletme listesi; hediye gün verme, üyelik başlangıç/bitiş tarihi, aldığı paket, kalan gün sayısı, detay sayfası (araç sayısı, alış/satış fiyatları, kâr marjı) |
| **İşlem Kaydı** | iyzico üzerinden gelen ödeme kayıtları |
| **Analitik** | Sistem verilerinin raporları |
| **Ayarlar** | Sistem ayarları |

---

### 🔷 Tenant Web Panel Sayfaları

#### Genel Bakış
Dashboard — işletmenin genel durumu

#### Araç Listesi
- Mevcut araçlar
- Satılan araçlar (ayrı kategoride)

#### Araç Alış (Yeni Araç Ekleme)

**Temel Bilgiler:**

| Alan | Açıklama |
|---|---|
| Araç Resmi | Fotoğraf yükleme |
| Alış Fiyatı | Satın alma bedeli |
| Satış Fiyatı | Hedef satış bedeli |
| Alınan Kişi Adı Soyadı | Araç sahibi bilgisi |
| Telefonu | İletişim |
| Marka | Araç markası |
| Model | Araç modeli |
| Plaka | Araç plakası |
| KM | Kilometre bilgisi |
| Model Yılı | Üretim yılı |
| Yakıt Tipi | Benzin / Dizel / LPG / Elektrik / Hibrit |
| Vites Tipi | Manuel / Otomatik / Yarı Otomatik |
| Şase No | Şasi numarası |
| Motor No | Motor numarası |
| Renk | Araç rengi |
| Alış Tarihi | Satın alma tarihi |

**Doküman & Durum Bilgileri:**

| Alan | Seçenekler |
|---|---|
| Kasko | Var / Yok |
| Trafik Sigortası | Var / Yok |
| Garanti | Var / Yok |
| Yedek Anahtar | Var / Yok |
| Ruhsat | Var / Yok |
| Fatura | Var / Yok |
| Tramer | Tutar girişi |
| Ağır Hasar Var Mı | Evet / Hayır |
| Araç Konsinye Mi | Evet / Hayır |
| Açıklama | Serbest metin |

**Ekspertiz Raporu:**

Aşağıdaki her parça için durum seçilecek: **Orijinal / Lokal Boya / Boyalı / Değişen**

| Parça |
|---|
| Sağ Ön Çamurluk |
| Sol Ön Çamurluk |
| Sağ Ön Kapı |
| Sol Ön Kapı |
| Sağ Arka Kapı |
| Sol Arka Kapı |
| Sağ Arka Çamurluk |
| Sol Arka Çamurluk |
| Motor Kaputu |
| Tavan |
| Bagaj Kapağı |

---

#### Masraf Ekle

| Alan | Açıklama |
|---|---|
| Araç Seçin | Dropdown — mevcut araçlardan seçim |
| Masraf Tipi | Yakıt, Bakım, Sigorta, Vergisi, Muayene, Lastik, Yıkama, Noter, Diğer |
| Tutar | Masraf tutarı |
| Tarih | Masraf tarihi |
| Hesap | Hangi banka hesabından ödeneceği |

---

#### Araç Satış

- Araç seçimi
- Son satış rakamı
- Noter masrafı
- Alış – Satış – Masraflar sonrası **kâr hesaplaması**

---

#### Müşteriler

- Araç alımında müşteri verisi girişi
- Araç satışında müşteri verisi girişi
- Müşteri listesi ve detayları

---

#### Bankalar

| Özellik | Açıklama |
|---|---|
| Banka Tanımlama | Banka hesaplarının sisteme eklenmesi |
| Çek Ekle | Çek kayıtlarının eklenmesi |
| Senet Ekle | Senet kayıtlarının eklenmesi |
| Vade Tanımla | Vadeli ödeme planlarının tanımlanması |
| Hareket Takibi | Masraf ve ödemelerin hangi bankada olduğunun kontrolü |

---

#### Personel

| Özellik | Açıklama |
|---|---|
| Personel Listesi | Mevcut personel listesi |
| Yeni Personel Ekleme | Yeni personel kaydı |
| Personele Ödeme Ekleme | Maaş / prim / avans girişi |

---

#### Raporlar

- Araç bazlı kâr/zarar raporları
- Genel finansal raporlar
- Masraf analizleri

---

## 📋 Sabit İçerikler

Aşağıdaki sabit içerikler landing sayfasında kullanılacaktır. Kaynak dosya: [sabit-icerik.txt](file:///Users/fatihakyildiz/Projeler/14-Galerim/src/sabit-icerik.txt)

### Hakkımızda
Bulut Grup Yazılım olarak temelleri 1999 yılına dayanan bir yazılım geliştirme serüvenine sahibiz. Özellikle web tasarım ve web yazılım konusunda kendisini geliştiren ekibimiz ile çok özel projeler üzerinden çalıştık yıllarca. Gelişen teknolojiler ile artık mobil tarafa geçiş yapan yazılım ekibimiz başta kendi projelerimizin mobilize edilmesi, farklı sektör ve müşterilerimizin özel isteklerini yerine getirmekle meşgulüz.

**Yıllara Yayılan Tecrübe:**
- **1999** — Web Tasarım Başlangıç: F2Ajans olarak Web Tasarım hizmetleri
- **2007** — E-Ticaret yazılımları
- **2015** — Mobil Destekli Yazılımlar
- **2024** — Tamamen mobil uygulama olarak hizmet

### Teslimat ve İade Şartları
- galerim.app bulut tabanlı SaaS yazılımıdır, fiziki kargo teslimatı yoktur
- Ödeme tamamlandıktan sonra erişim bilgileri anında otomatik gönderilir
- Dijital ürün istisnası kapsamında cayma hakkı geçerli değildir
- Teknik kusur durumunda iade süreci değerlendirilir

### Gizlilik Sözleşmesi
- Kullanıcı verileri (ad, soyad, şirket, e-posta, telefon) hizmet sunumu için işlenir
- Galeri, araç ve müşteri verileri tamamen kullanıcının mülkiyetindedir
- Kredi kartı bilgileri şirket sunucularında tutulmaz (iyzico 256-bit SSL)
- KVKK uyumlu veri güvenliği

### Mesafeli Satış Sözleşmesi
- **Satıcı:** Bulut Grup Bilişim Elektrik ve Elektronik ve Yazılım Hizmetleri Ltd. Şti.
- **Adres:** Mustafa Kemal Mh. Maidan İş Merkezi 4C Blok No:140 Çankaya / ANKARA
- **Vergi Dairesi / No:** Maltepe V.D. / 1901323607
- **E-posta:** admin@galerim.app
- **Yetkili Mahkeme:** Satıcının yerleşim yerindeki Tüketici Mahkemeleri

---

## 🏛️ Mimari Genel Bakış

```
┌─────────────────────────────────────────────────────────────────┐
│                        galerim.app                              │
│                     (Landing Page)                              │
│              Tanıtım + iyzico Ödeme Sayfası                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼───────────────────┐
        ▼                  ▼                   ▼
┌───────────────┐ ┌────────────────┐ ┌─────────────────┐
│ cpgm.         │ │ galeriadi.     │ │ Mobil Uygulama  │
│ galerim.app   │ │ galerim.app   │ │ (React Native)  │
│               │ │                │ │ Google Play &   │
│ Super Admin   │ │ Tenant Panel   │ │ Apple Store     │
│ (React/Vite)  │ │ + Dış Görünüm  │ │ (Expo Router)   │
└───────┬───────┘ └───────┬────────┘ └────────┬────────┘
        │                 │                    │
        └─────────────────┼────────────────────┘
                          ▼
              ┌───────────────────────┐
              │      Supabase         │
              │  ┌─────────────────┐  │
              │  │   PostgreSQL    │  │
              │  │   Edge Funcs    │  │
              │  │   SQL Triggers  │  │
              │  │   Auth          │  │
              │  │   Storage       │  │
              │  └─────────────────┘  │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   iyzico Ödeme API    │
              └───────────────────────┘
```

---

## 📝 Notlar

- Tüm mobil menüler **hamburger menü** formatında olacak
- Tab Bar: **Genel**, **Araçlar**, **Müşteriler**, **Banka**
- Tema ve UI/UX tasarımları `src/design/` klasöründeki dosyalar esas alınacak
- Her üye işletmeye özel subdomain (`isletmeadi.galerim.app`) açılacak
- Dış görünümde yalnızca **satış fiyatları** gösterilecek, alış fiyatı gizli kalacak
- Yönetici girişi ile panel içindeki tüm işlemler erişilebilir olacak
