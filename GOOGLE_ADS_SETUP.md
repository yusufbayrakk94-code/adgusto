# Google Ads API Kurulumu

## Adım 1: Google Cloud Console'da API'yi Enable Et

1. [Google Cloud Console](https://console.cloud.google.com/) git
2. Projenizi seçin: `106129545085-k9tkm2r5qmkv1cnmd9gk2ler5bug4vrn`
3. Sol menüden **APIs & Services** > **Library** seçin
4. Arama kutusuna **"Google Ads API"** yazın
5. **Google Ads API**'yi seçin ve **Enable** butonuna tıklayın

## Adım 2: OAuth Consent Screen Ayarları

1. [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent) git
2. **Test users** bölümüne gidin
3. **+ ADD USERS** butonuna tıklayın
4. Google hesabınızı (Gmail adresinizi) ekleyin
5. **Save** yapın

### Test Kullanıcıları Neden Önemli?

- Test kullanıcıları "uygulama güvenli değil" uyarısı görmez
- Hemen test edebilirsiniz
- Production'a geçmek için Google verification gerekmez

## Adım 3: Google Ads Developer Token Kontrolü

Şu anki developer token: `gRvIDCuBNcUkh0FP9zMHwg`

### Developer Token Test Mode Kontrolü

1. [Google Ads](https://ads.google.com/) git
2. Sağ üstten **Tools & Settings** tıkla
3. **API Center** seçin
4. Developer token'ın durumunu kontrol et:
   - ✅ **Approved**: Production'da kullanılabilir
   - ⚠️ **Test**: Sadece kendi hesaplarınızla çalışır
   - ❌ **Pending**: Onay bekliyor

### Test Mode İse Ne Yapmalı?

Test mode'da iken:
- Sadece developer token'ı aldığınız Google Ads hesabına erişebilirsiniz
- Başka müşteri hesaplarına erişemezsiniz
- Production approval için [başvuru yapmanız](https://developers.google.com/google-ads/api/docs/access-levels#token_approval) gerekir

## Adım 4: OAuth Scope Kontrolü

OAuth consent screen'de şu scope'un eklendiğinden emin olun:
- `https://www.googleapis.com/auth/adwords`

## Adım 5: Bağlantıyı Test Et

1. Tüm ayarları yaptıktan sonra uygulamayı yeniden başlatın
2. Google Ads sayfasına gidin
3. **Google Ads ile Bağlan** butonuna tıklayın
4. Google hesabınızla giriş yapın (test kullanıcısı olarak eklediğiniz hesap)
5. İzinleri onaylayın

## Sık Karşılaşılan Hatalar

### "Failed to list accessible customers"
- ✅ Google Ads API'yi enable ettin mi?
- ✅ Developer token aktif mi?
- ✅ Google Ads hesabın var mı?
- ✅ OAuth scope doğru mu? (`https://www.googleapis.com/auth/adwords`)

### "No accessible Google Ads accounts found"
- ✅ Google Ads hesabın aktif mi?
- ✅ Manager hesap mı yoksa müşteri hesabı mı?
- ✅ Developer token'ın erişimi var mı?

### "Uygulama güvenli değil" uyarısı
- ✅ OAuth consent screen'de test kullanıcısı olarak eklendin mi?
- Ya da: "Advanced" > "Go to app (unsafe)" diyerek devam et

## Production'a Geçiş

Production'da kullanmak için:

1. **Google Ads API Developer Token Approval**: [Başvuru yap](https://developers.google.com/google-ads/api/docs/access-levels#token_approval)
2. **OAuth App Verification**: [Verification başvurusu](https://support.google.com/cloud/answer/9110914)
3. Bu süreçler haftalar sürebilir

Test aşamasında ise test kullanıcıları ekleyerek devam edebilirsiniz.
