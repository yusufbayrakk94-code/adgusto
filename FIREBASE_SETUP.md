# Firebase Firestore Kurallarını Uygulama Rehberi

## Firestore Security Rules Kurulumu

1. **Firebase Console'a giriş yapın**:
   - https://console.firebase.google.com adresine gidin
   - **adgusto-27e8f** projenizi seçin

2. **Firestore Database sayfasına gidin**:
   - Sol menüden **"Firestore Database"** seçeneğine tıklayın
   - Üst menüden **"Rules"** (Kurallar) sekmesine gidin

3. **Güvenli kuralları kopyalayın**:
   - `firestore.rules` dosyasındaki tüm içeriği kopyalayın
   - Firebase Console'daki editor'e yapıştırın

4. **Kuralları yayınlayın**:
   - **"Publish"** (Yayınla) butonuna tıklayın
   - Değişikliklerin birkaç saniye içinde aktif olmasını bekleyin

## Firebase Authentication Ayarları

1. **Email/Password Authentication'ı aktif edin**:
   - Sol menüden **"Authentication"** seçeneğine tıklayın
   - **"Sign-in method"** sekmesine gidin
   - **"Email/Password"** seçeneğini bulun ve **Enable** edin
   - **Email link** seçeneğini kapalı bırakın

2. **Email Doğrulama Ayarları**:
   - **"Templates"** sekmesine gidin
   - **"Email address verification"** şablonunu özelleştirin (opsiyonel)
   - Türkçe içerik ekleyebilirsiniz

3. **Google Sign-In (Opsiyonel)**:
   - **"Sign-in method"** sekmesinden **"Google"** seçeneğini bulun
   - Enable edin ve gerekli ayarları yapın

## Uygulama Akışı

### 1. Kayıt Olma Akışı:
- Kullanıcı email ve şifre ile kayıt olur
- ✉️ Otomatik email doğrulama linki gönderilir
- 📧 Kullanıcı emailVerification ekranında bekler
- ✅ Email doğrulandığında onboarding ekranına yönlendirilir
- 📝 5 adımlık onboarding sorularını cevaplar
- 🎉 Dashboard'a giriş yapar

### 2. Giriş Yapma Akışı:
- Kullanıcı email ve şifre ile giriş yapar
- Email doğrulanmamışsa → EmailVerification ekranı
- Email doğrulanmış ama onboarding tamamlanmamışsa → Onboarding ekranı
- Her şey tamam ise → Dashboard

### 3. Şifremi Unuttum:
- "Şifremi unuttum" butonuna tıklar
- Email adresini girer
- Şifre sıfırlama linki gönderilir
- Email'deki linke tıklayarak yeni şifre oluşturur

## Firestore Güvenlik Özellikleri

✅ **Kullanıcı Doğrulaması**: Tüm işlemler için auth gerekli
✅ **Email Doğrulaması**: Data işlemleri için email doğrulanmış olmalı
✅ **Veri İzolasyonu**: Her kullanıcı sadece kendi verisini görebilir
✅ **Yazma Koruması**: Kullanıcılar sadece kendi userId'li datalara yazabilir
✅ **Silme Koruması**: User profilleri silinemez (güvenlik)

## Test Etme

1. **Yeni Kullanıcı Kaydı**:
   ```
   - Kayıt ol
   - Email doğrula
   - Onboarding'i tamamla
   - Dashboard'a eriş
   ```

2. **Email Doğrulama**:
   ```
   - Spam klasörünü kontrol et
   - Doğrulama linkine tıkla
   - Otomatik olarak devam et
   ```

3. **Firestore Data Erişimi**:
   ```
   - Firebase Console > Firestore Database
   - Users collection'ı kontrol et
   - Her kullanıcının kendi datası olmalı
   ```

## Sorun Giderme

### Email gelmiyorsa:
- Spam klasörünü kontrol edin
- Firebase Console > Authentication > Templates kontrol edin
- Email provider ayarlarını kontrol edin

### Firestore hatası alıyorsanız:
- Kuralların doğru uygulandığından emin olun
- Browser console'da hata mesajlarını kontrol edin
- User email'inin doğrulandığından emin olun

### Onboarding geçilmiyorsa:
- Firestore > users > {userId} dokümanını kontrol edin
- onboardingCompleted field'ının true olduğunu kontrol edin

## Önemli Notlar

⚠️ **Güvenlik**: Test kurallarını (allow read, write: if true) asla production'da kullanmayın!

⚠️ **Email Doğrulama**: Email doğrulanmadan Firestore'a yazı yazılamaz

⚠️ **Onboarding**: İlk girişte mutlaka tamamlanmalı, data Firestore'da saklanır

✅ **Güncel Durum**: Tüm güvenlik kuralları aktif ve hazır!

## API Keys ve Config

Mevcut Firebase config güvenlidir ve kullanılabilir:
- Project ID: adgusto-27e8f
- API Key: Public (client-side kullanım için güvenli)
- Auth Domain: adgusto-27e8f.firebaseapp.com

⚠️ **Not**: .env dosyasındaki Firebase config'i git'e commitlemeyin!
