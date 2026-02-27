const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques depuis dist
app.use(express.static(path.join(__dirname, 'dist')));

// Servir sitemap.xml et robots.txt directement (avant le catch-all)
app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.sendFile(path.join(__dirname, 'dist', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.sendFile(path.join(__dirname, 'dist', 'robots.txt'));
});

// Pour toutes les autres routes, servir index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`📄 Sitemap disponible sur http://localhost:${PORT}/sitemap.xml`);
});

