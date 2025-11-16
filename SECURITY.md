<p align="right">
  <strong>🇹🇷 Türkçe</strong> | <a href="#-english-version">🇬🇧 English</a>
</p>

# 🇹🇷 Türkçe Versiyon

## ⚠️ Önemli Güvenlik Notları

### 1. Environment Değişkenleri
- `.env`, `*.env`, `backend/edb.env` gibi dosyaları **asla commit etmeyin**
- Gerçek şifre veya API anahtarı içeren dosyaları versiyonlamayın

### 2. Veritabanı
- `backend/edb.env` örnek dosyadır, **gerçek şifre içermemelidir**
- Üretim ortamında güçlü şifreler kullanın
- Veritabanı kullanıcılarına sadece gerekli yetkileri verin

### 3. JWT Secret
- `JWT_SECRET` değerini mutlaka değiştirin
- En az 32 karakter, rastgele ve tahmin edilemez olmalı
- Örnek: `openssl rand -base64 32`

### 4. Admin Hesabı
- Varsayılan admin şifresini hemen değiştirin
- Güçlü şifre kullanın (12+ karakter, özel karakter, sayı)
- Mümkünse 2FA (İki Faktörlü Doğrulama) ekleyin

### 5. Production Öncesi Kontrol Listesi
- [ ] Tüm `.env` dosyaları güncellendi  
- [ ] Güçlü `JWT_SECRET` tanımlandı  
- [ ] Admin şifresi değiştirildi  
- [ ] Veritabanı şifreleri güvenli  
- [ ] `.gitignore` hassas dosyaları dışarıda tutuyor  
- [ ] HTTPS aktif  
- [ ] CORS ayarları yapılandırıldı  
- [ ] Rate limiting eklendi  
- [ ] Input validation kontrolü yapılıyor

---

## 📧 Güvenlik Açığı Bildirimi

Bir güvenlik açığı bulursanız, lütfen herkese açık issue açmak yerine doğrudan proje sahipleriyle iletişime geçin.

---
<p align="right">
  <a href="#-turkce-versiyon">🇹🇷 Türkçe</a> | <strong>🇬🇧 English</strong>
</p>

# 🇬🇧 English Version
---
## ⚠️ Critical Security Notes

### 1. Environment Variables
- Never commit `.env`, `*.env`, or `backend/edb.env` files
- Do not version files containing real passwords or API keys

### 2. Database
- `backend/edb.env` is an example file — **must not contain real credentials**
- Use strong passwords in production
- Limit database user privileges to only what's necessary

### 3. JWT Secret
- Always change `JWT_SECRET` before deployment
- Minimum 32 characters, random and unpredictable
- Example: `openssl rand -base64 32`

### 4. Admin Account
- Change default admin password immediately
- Use strong passwords (12+ characters, symbols, numbers)
- Enable 2FA if possible

### 5. Pre-Deployment Checklist
- [ ] All `.env` secrets updated  
- [ ] Strong `JWT_SECRET` set  
- [ ] Admin password changed  
- [ ] Database credentials secured  
- [ ] `.gitignore` excludes sensitive files  
- [ ] HTTPS enabled in production  
- [ ] CORS configured for production  
- [ ] Rate limiting applied  
- [ ] Input validation in place

---

## 📧 Reporting Vulnerabilities

If you discover a security issue, **do not open a public issue**.  
Please contact the project maintainers directly.

_Last updated: 2025-11-16_

---

Bu dosyayı doğrudan `SECURITY.md` olarak proje kök dizinine ekleyebilirsin.  
İstersen şimdi sana tüm dosya yapısını ve commit adımlarını da gösterebilirim. Hazırsan devam edelim.
