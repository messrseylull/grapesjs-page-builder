const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection Setup
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'grapesjs_db'
});

// Connect to database and create table if it doesn't exist
db.connect((err) => {
  if (err) {
    if (err.code === 'ER_BAD_DB_ERROR') {
        console.error('HATA: Lütfen phpMyAdmin veya MySQL üzerinden "grapesjs_db" adında bir veritabanı oluşturun.');
    } else {
        console.error('Veritabanı bağlantı hatası:', err);
    }
    return;
  }
  console.log('MySQL veritabanına bağlanıldı.');

  // Create table if not exists (added proje_json for GrapesJS state)
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sayfalar (
      id INT AUTO_INCREMENT PRIMARY KEY,
      html_icerik LONGTEXT,
      css_icerik LONGTEXT,
      proje_json LONGTEXT
    )
  `;
  db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error("Tablo oluşturulurken hata:", err);
    } else {
        console.log('sayfalar tablosu hazır.');
        // Ensure proje_json column exists if table was already created
        db.query("ALTER TABLE sayfalar ADD COLUMN proje_json LONGTEXT", (err) => {
           // Ignore error if column already exists
        });
    }
  });
});

// API Endpoints for GrapesJS Storage Manager

// POST /api/sayfa (Save data)
app.post('/api/sayfa', (req, res) => {
  console.log("GrapesJS'ten gelen veri:", Object.keys(req.body));
  
  const html_icerik = req.body['gjs-html'] || '';
  const css_icerik = req.body['gjs-css'] || '';
  const proje_json = JSON.stringify(req.body); // Save entire state to be able to load it back

  db.query('SELECT * FROM sayfalar LIMIT 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      const updateQuery = 'UPDATE sayfalar SET html_icerik = ?, css_icerik = ?, proje_json = ? WHERE id = ?';
      db.query(updateQuery, [html_icerik, css_icerik, proje_json, results[0].id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Başarıyla güncellendi.' });
      });
    } else {
      const insertQuery = 'INSERT INTO sayfalar (html_icerik, css_icerik, proje_json) VALUES (?, ?, ?)';
      db.query(insertQuery, [html_icerik, css_icerik, proje_json], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Başarıyla kaydedildi.', id: result.insertId });
      });
    }
  });
});

// GET /api/sayfa (Load data)
app.get('/api/sayfa', (req, res) => {
  db.query('SELECT proje_json FROM sayfalar LIMIT 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0 && results[0].proje_json) {
      try {
        const data = JSON.parse(results[0].proje_json);
        res.status(200).json(data);
      } catch (e) {
        res.status(200).json({});
      }
    } else {
      res.status(200).json({});
    }
  });
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
