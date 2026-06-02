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

  // Create table if not exists
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sayfalar (
      id INT AUTO_INCREMENT PRIMARY KEY,
      html_icerik LONGTEXT,
      css_icerik LONGTEXT
    )
  `;
  db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error("Tablo oluşturulurken hata:", err);
    } else {
        console.log('sayfalar tablosu hazır.');
    }
  });
});

// API Endpoints for GrapesJS Storage Manager

// POST /api/sayfa (Save data)
app.post('/api/sayfa', (req, res) => {
  // GrapesJS sends data as defined in storage manager.
  // We extract 'gjs-html' and 'gjs-css' (default prefixes)
  const html_icerik = req.body['gjs-html'] || '';
  const css_icerik = req.body['gjs-css'] || '';

  // Get the first record to update, or insert if no record exists
  db.query('SELECT * FROM sayfalar LIMIT 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      // Update existing record
      const updateQuery = 'UPDATE sayfalar SET html_icerik = ?, css_icerik = ? WHERE id = ?';
      db.query(updateQuery, [html_icerik, css_icerik, results[0].id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Başarıyla güncellendi.' });
      });
    } else {
      // Insert new record
      const insertQuery = 'INSERT INTO sayfalar (html_icerik, css_icerik) VALUES (?, ?)';
      db.query(insertQuery, [html_icerik, css_icerik], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Başarıyla kaydedildi.', id: result.insertId });
      });
    }
  });
});

// GET /api/sayfa (Load data)
app.get('/api/sayfa', (req, res) => {
  db.query('SELECT html_icerik, css_icerik FROM sayfalar LIMIT 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      // Return data in the format GrapesJS expects for remote loading
      res.status(200).json({
        'gjs-html': results[0].html_icerik,
        'gjs-css': results[0].css_icerik
      });
    } else {
      // Return empty JSON if no data exists
      res.status(200).json({});
    }
  });
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
