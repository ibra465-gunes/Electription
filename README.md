# Electription – Blockchain Tabanlı Elektronik Oylama Sistemi

<p align="right">
  <strong>🇹🇷 Türkçe</strong> | <a href="README.en.md">🇬🇧 English</a>
</p>

## 📋 Proje Hakkında

Electription, blockchain teknolojisi kullanarak güvenli, şeffaf ve merkeziyetsiz bir elektronik oylama altyapısı sunan bir bitirme projesidir. Sistem; React tabanlı frontend, Node.js/Express backend, Solidity ile yazılmış akıllı sözleşmeler ve MySQL veritabanı bileşenlerinden oluşur.

📅 Proje Tarihi: Haziran 2025

---

## 🏗️ Proje Yapısı

```
electription/
├── frontend/          # React tabanlı kullanıcı arayüzü
├── backend/           # Node.js/Express API sunucusu
├── blockchain/        # Hardhat/Solidity akıllı sözleşmeler
└── database/          # MySQL veritabanı şeması
```

---

## 🛠️ Kullanılan Teknolojiler

### Frontend
- React 19.1.0
- React Router DOM 7.6.0
- Axios
- Lucide React (ikonlar)
- Tailwind CSS

### Backend
- Node.js
- Express 5.1.0
- MySQL
- JWT (kimlik doğrulama)
- bcrypt (şifreleme)

### Blockchain
- Hardhat 2.24.0
- Ethers.js 6.14.0
- Solidity 0.8.22
- OpenZeppelin Contracts 5.3.0

---

## 📦 Kurulum

### Gereksinimler
- Node.js (v16+)
- MySQL
- Git

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd electription
```

### 2. Backend Kurulumu
```bash
cd backend
npm install
```

`.env` dosyasını oluşturun ve aşağıdaki örneğe göre doldurun:

```env
# backend/edb.env örneği
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=evoting_db
JWT_SECRET=your-very-secret-jwt-key
PORT=3003
```

> ⚠️ Not: `backend/edb.env` dosyası güvenlik nedeniyle GitHub’a yüklenmemiştir.  
> Sistemi kullanacak kişi bu dosyayı kendi ortamında oluşturmalıdır.

---

### 3. Veritabanı Kurulumu
```bash
mysql -u root -p < database/edb.sql
```

### 4. Blockchain Kurulumu
```bash
cd blockchain
npm install
```

### 5. Frontend Kurulumu
```bash
cd frontend
npm install
```

---

## 🚀 Çalıştırma

### 1. Blockchain Node'unu Başlatın
```bash
cd blockchain
npx hardhat node
```

### 2. Smart Contract'ları Deploy Edin
```bash
cd blockchain
npx hardhat run scripts/deploy_VoteToken.js --network localhost
```

### 3. Backend Sunucusunu Başlatın
```bash
cd backend
node edb.js
```

### 4. Frontend Uygulamasını Başlatın
```bash
cd frontend
npm start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

---

## 🧠 Teknik Notlar

- IP adresi tanımı, bulunduğu ağ ortamındaki adresi otomatik almak için aşağıdaki yapı ile yapılır:
  ```js
  const localIP = networkInterfaces["Wi-Fi"]?.find(info => info.family === "IPv4")?.address || "localhost";
  ```
  - Bu kod **Windows sistemlerde** `"Wi-Fi"` arayüzü üzerinden çalışır.
  - **Linux sistemlerde** `"Wi-Fi"` arayüzü bulunmadığından IP elle girilmelidir.
  - Bu yapı `.env` dosyasına bağlı değildir; doğrudan kod içinde tanımlanır.

- `blockchain/scripts/deploy_VoteToken.js` dosyasındaki dağıtım kodu, `backend/edb.js` içinde de benzer şekilde yer almaktadır.  
  Bu tekrar, backend’in doğrudan blockchain ile etkileşim kurabilmesi için yapılmıştır.

---

## 🔑 Özellikler

- ✅ Blockchain tabanlı güvenli oylama
- ✅ Seçmen kayıt ve doğrulama sistemi
- ✅ Admin paneli
- ✅ Aday yönetimi
- ✅ Gerçek zamanlı oy sayımı
- ✅ JWT tabanlı kimlik doğrulama
- ✅ Şeffaf ve değiştirilemez oy kayıtları

---

## 🔐 Güvenlik

- Şifreler bcrypt ile hash'lenir  
- JWT token'ları ile güvenli oturum yönetimi  
- Blockchain üzerinde değiştirilemez kayıtlar  
- TC kimlik numarası ile seçmen doğrulama

---

## 📝 Varsayılan Admin Bilgileri

**⚠️ ÜRETİMDE MUTLAKA DEĞİŞTİRİN!**

- Kullanıcı Adı: `admin`  
- Şifre: (database/edb.sql dosyasında hash'lenmiş hali mevcut)

---

## 👥 Katkı Sağlayanlar

- [İbrahim GÜNEŞ](https://github.com/ibra465-gunes)
- [İshak DURAN](https://github.com/dr-isosan)
- [Cuma TALJİBİNİ](https://github.com/Ctaljibini)
---
## 🤝 Katkıda Bulunma Rehberi

Bu proje bir bitirme projesidir. Yine de katkılarınızı memnuniyetle karşılıyoruz!

### 1. Fork ve Klonla
```bash
# Projeyi GitHub üzerinden fork edin
git clone https://github.com/YOUR_USERNAME/e-vote.git
cd e-vote
```

### 2. Branch Oluşturun
```bash
git checkout -b feature/yeni-ozellik
# veya
git checkout -b fix/hata-duzeltme
```

### 3. Değişikliklerinizi Yapın
- Kodun mevcut stiline uygun yazın  
- Gerekli yerlerde yorum satırları ekleyin  
- Değişikliklerinizi test edin

### 4. Commit
```bash
git add .
git commit -m "feat: yeni özellik eklendi"
```

#### Commit Mesaj Formatı
```
<tip>: <kısa açıklama>

[opsiyonel detaylı açıklama]
```

**Tipler:**
- `feat`: Yeni özellik  
- `fix`: Hata düzeltme  
- `docs`: Dokümantasyon  
- `style`: Kod formatı  
- `refactor`: Kod iyileştirme  
- `test`: Test ekleme  
- `chore`: Genel işler

### 5. Push ve Pull Request
```bash
git push origin feature/yeni-ozellik
```
GitHub üzerinden bir Pull Request (PR) oluşturun.

---

## 📋 Kodlama Standartları

- **JavaScript**: ESLint kurallarına uyun  
- **React**: Fonksiyonel bileşenler kullanın  
- **Solidity**: OpenZeppelin standartlarını takip edin  
- **Yorumlar**: Karmaşık kod bloklarını açıklayın

---

## 🐛 Hata Bildirimi

Issue açarken:

- Hatanın ne olduğunu açıkça belirtin  
- Tekrar etme adımlarını yazın  
- Beklenen ve gerçekleşen davranışı açıklayın  
- Varsa ekran görüntüsü ekleyin

---

## 💡 Özellik Önerisi

- Özelliği detaylı açıklayın  
- Neden gerekli olduğunu belirtin  
- Kullanım senaryosu paylaşın

---

## ✅ Pull Request Kontrol Listesi

- [ ] Kod çalışıyor ve test edildi  
- [ ] Yeni özellikler dokümante edildi  
- [ ] Commit mesajları açıklayıcı  
- [ ] Çakışma (conflict) yok  
- [ ] `.gitignore` hassas dosyaları içeriyor
---
## 🔐 Güvenlik Notları

- `.env`, `backend/edb.env` gibi dosyaları **asla commit etmeyin**
- `JWT_SECRET` ve admin şifresini **üretim ortamında mutlaka değiştirin**
- `.gitignore` dosyasının hassas verileri dışarıda tuttuğundan emin olun
- Detaylı güvenlik rehberi için `SECURITY.md` dosyasına bakabilirsiniz
---
## 📄 Lisans

Bu proje [MIT lisansı](LICENSE) ile lisanslanmıştır.  
Kodun yeniden kullanımı, değiştirilmesi ve dağıtımı serbesttir.
