FROM node:18-alpine

# Uygulama dizinini oluştur
WORKDIR /usr/src/app

# Bağımlılıkları kopyala ve kur
COPY package*.json ./
RUN npm install

# Proje dosyalarını kopyala
COPY . .

# Uygulamanın çalışacağı port
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "server.js"]
