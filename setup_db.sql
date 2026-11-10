-- Skrip Pembuatan Basis Data dan Tabel 3NF Kasus Perpustakaan
DROP DATABASE IF EXISTS db_perpustakaan_normalisasi;
CREATE DATABASE db_perpustakaan_normalisasi;
USE db_perpustakaan_normalisasi;

-- 1. Tabel Anggota
CREATE TABLE Anggota (
    IDAnggota VARCHAR(10) PRIMARY KEY,
    NamaAnggota VARCHAR(50) NOT NULL,
    Kelas VARCHAR(20) NOT NULL
);

-- 2. Tabel Penerbit
CREATE TABLE Penerbit (
    KodePenerbit VARCHAR(10) PRIMARY KEY,
    NamaPenerbit VARCHAR(50) NOT NULL
);

-- 3. Tabel Buku
CREATE TABLE Buku (
    KodeBuku VARCHAR(10) PRIMARY KEY,
    JudulBuku VARCHAR(100) NOT NULL,
    KodePenerbit VARCHAR(10) NOT NULL,
    FOREIGN KEY (KodePenerbit) REFERENCES Penerbit(KodePenerbit) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 4. Tabel Peminjaman
CREATE TABLE Peminjaman (
    NoPinjam VARCHAR(10) PRIMARY KEY,
    TanggalPinjam DATE NOT NULL,
    IDAnggota VARCHAR(10) NOT NULL,
    BatasKembali DATE NOT NULL,
    FOREIGN KEY (IDAnggota) REFERENCES Anggota(IDAnggota) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 5. Tabel DetailPeminjaman
CREATE TABLE DetailPeminjaman (
    NoPinjam VARCHAR(10) NOT NULL,
    KodeBuku VARCHAR(10) NOT NULL,
    PRIMARY KEY (NoPinjam, KodeBuku),
    FOREIGN KEY (NoPinjam) REFERENCES Peminjaman(NoPinjam) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (KodeBuku) REFERENCES Buku(KodeBuku) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Insert Data Anggota
INSERT INTO Anggota (IDAnggota, NamaAnggota, Kelas) VALUES
('A01', 'Nadia', 'XI RPL 1'),
('A02', 'Raka', 'XI RPL 2');

-- Insert Data Penerbit
INSERT INTO Penerbit (KodePenerbit, NamaPenerbit) VALUES
('PN01', 'Cakrawala'),
('PN02', 'Pelita');

-- Insert Data Buku
INSERT INTO Buku (KodeBuku, JudulBuku, KodePenerbit) VALUES
('B01', 'Dasar SQL', 'PN01'),
('B02', 'Logika Algoritma', 'PN02'),
('B03', 'Desain Web', 'PN01');

-- Insert Data Peminjaman
INSERT INTO Peminjaman (NoPinjam, TanggalPinjam, IDAnggota, BatasKembali) VALUES
('PB01', '2026-11-03', 'A01', '2026-11-10'),
('PB02', '2026-11-04', 'A02', '2026-11-11'),
('PB03', '2026-11-05', 'A01', '2026-11-12');

-- Insert Data DetailPeminjaman
INSERT INTO DetailPeminjaman (NoPinjam, KodeBuku) VALUES
('PB01', 'B01'),
('PB01', 'B02'),
('PB02', 'B03'),
('PB03', 'B03'),
('PB03', 'B02');

-- Query Rekonstruksi Data (JOIN 5 Tabel)
SELECT 
    p.NoPinjam,
    p.TanggalPinjam,
    a.IDAnggota,
    a.NamaAnggota,
    a.Kelas,
    p.BatasKembali,
    b.KodeBuku,
    b.JudulBuku,
    pen.KodePenerbit,
    pen.NamaPenerbit
FROM Peminjaman p
JOIN Anggota a ON p.IDAnggota = a.IDAnggota
JOIN DetailPeminjaman dp ON p.NoPinjam = dp.NoPinjam
JOIN Buku b ON dp.KodeBuku = b.KodeBuku
JOIN Penerbit pen ON b.KodePenerbit = pen.KodePenerbit
ORDER BY p.NoPinjam ASC, b.KodeBuku ASC;

