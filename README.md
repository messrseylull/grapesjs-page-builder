# GrapesJS Web Sayfası Oluşturucu Ödevi

Bu proje, GrapesJS kütüphanesinin projeye dahil edilerek bir web sayfası oluşturucu (page builder) tasarlanması ve yapılan tasarımların Node.js (Express) ile MySQL veritabanına kaydedilip geri yüklenmesi işlemlerini içerir. Sistem **Docker** üzerinde çalışacak şekilde yapılandırılmıştır.

## Github Linki
**Github Proje Adresi:** [Buraya Github Repo Linkinizi Yapıştırın]

---

## Docker Container Uygulama Linkleri
Proje `docker-compose up` ile başlatıldıktan sonra aşağıdaki linklerden uygulamalara erişebilirsiniz:
- **Web Uygulaması (Node.js & GrapesJS):** [http://localhost:3000](http://localhost:3000)
- **MySQL Veritabanı Erişimi:** `localhost:3306`

---

## Veritabanı ve Kullanıcı Bilgileri
Projedeki örnek veritabanı Docker imajı içerisinde otomatik olarak ayağa kalkmaktadır. 

**MySQL Bağlantı Bilgileri:**
- **Veritabanı Adı:** `grapesjs_db`
- **Kullanıcı Adı:** `grapesjs_user`
- **Şifre:** `grapesjs_pass`
- **Root Şifresi:** `root_password_123`

**Örnek Kullanıcı Tanımlamaları:**
*Not: Bu projede özel bir giriş (login) ekranı istenmemiştir. Ancak genel yetkilendirme veya test süreçleri için aşağıdaki örnek kullanıcı kullanılabilir:*
- **Örnek Login Kullanıcısı:** `admin`
- **Örnek Login Şifresi:** `123456`

---

## Kurulum ve Çalıştırma Adımları

Projeyi çalıştırmak için bilgisayarınızda **Docker** ve **Docker Compose** kurulu olması yeterlidir. Herhangi bir Node.js veya XAMPP kurmanıza gerek yoktur.

1. Proje klasörünü terminalde (komut satırı) açın.
2. Aşağıdaki komutu çalıştırarak tüm sistemi ayağa kaldırın:
   ```bash
   docker-compose up --build
   ```
3. Docker, Node.js uygulamasını ve MySQL veritabanını indirip çalıştıracaktır. İşlem tamamlandığında (terminalde `Sunucu http://localhost:3000 adresinde çalışıyor` mesajını gördüğünüzde), tarayıcınızdan **http://localhost:3000** adresine gidin.

## Proje Kullanımı
- Editör üzerinden tasarım yapıp üst kısımdaki **Kaydet (Disket)** butonuna bastığınızda veriler doğrudan Docker içindeki MySQL'e kaydedilir.
- Sayfayı yenilediğinizde (F5), kaydedilen tasarım veritabanından çekilerek otomatik olarak editöre geri yüklenir.
- Sistemi durdurmak için terminalde `CTRL+C` yapıp ardından `docker-compose down` komutunu kullanabilirsiniz.
