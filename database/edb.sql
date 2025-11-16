


CREATE DATABASE IF NOT EXISTS evoting_db;
USE evoting_db;

-- Seçmen tablosu
CREATE TABLE IF NOT EXISTS secmenler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    isim VARCHAR(50) NOT NULL,
    soyisim VARCHAR(50) NOT NULL,
    tc_no VARCHAR(11) NOT NULL UNIQUE,  -- TC kimlik no (11 haneli)
    sifre VARCHAR(255) NOT NULL,        -- Hash'lenmiş şifre
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tc_no (tc_no)             -- TC no için indeks
);

-- Admin tablosu
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_adi VARCHAR(50) NOT NULL UNIQUE,
    sifre VARCHAR(255) NOT NULL         -- Hash'lenmiş şifre
);
INSERT INTO admin (kullanici_adi, sifre) VALUES ('admin', '$2y$10$8MNzKgd.J6F0z3bh5xNZEOgbJVW3XWrKm1gVXXWb.ciRWW9yZJ65.');

-- Mevcut tabloya ek alanlar
ALTER TABLE secmenler
ADD COLUMN blockchain_adres VARCHAR(42) DEFAULT NULL,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD INDEX idx_blockchain_adres (blockchain_adres);

ALTER TABLE admin
ADD COLUMN blockchain_adres VARCHAR(255) NULL;
