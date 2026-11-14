---
name: grafik
description: Kişinin arkasına 7 cam widget yerleştirir (büyük sayı, mini rapor grafiği, tarih, ilerleme çubuğu, puan, oynatıcı, halka). Kullanıcının kendi videosuna özel hazır efekt uygular ve yeni bir MP4 çıkarır.
argument-hint: "[video yolu] [başlangıç saniyesi]"
allowed-tools: Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/*) Read Write
---

# Efekt: grafik

Kişinin arkasına 7 cam widget yerleştirir (büyük sayı, mini rapor grafiği, tarih, ilerleme çubuğu, puan, oynatıcı, halka).

> Bu efekt kişiyi arka plandan keser. İlk seferde kesim birkaç dakika sürebilir (kare başına birkaç saniye); bilgisayar kullanılabilir kalır.

## Adımlar

1. **Video**: `$ARGUMENTS` içinde video yolu varsa onu kullan, yoksa kullanıcıya sor. Dikey (9:16) konuşan kafa videoları için tasarlandı; yatay video ortadan 9:16 kırpılır.
2. **Aralık**: Efekt 5–6 saniyelik bir bölüme uygulanır. Kullanıcı başlangıç saniyesi vermediyse sor ("Videonun kaçıncı saniyesinden başlasın? Konuştuğun bir an seç."). Süre varsayılan 5.7 sn; 2–15 sn arası olabilir.
3. **İçerik**: Kullanıcıya kendi içeriğini vermek isteyip istemediğini sor ve aşağıdaki alanları kısaca açıkla. Verirse yalnızca verdiği anahtarlarla bir JSON dosyası yaz (ör. işletim sisteminin geçici klasörüne `efekt-icerik.json`) ve `--icerik` ile geçir. Vermediği anahtarlar örnek içerikle kalır.
4. **Kurulum kontrolü**: `${CLAUDE_PLUGIN_ROOT}/engine/node_modules/remotion` yoksa kullanıcıya şunu söyle ve onay al: "İlk kullanım için motoru kurmam gerekiyor (npm paketleri ve ~224 MB kesim modeli). Kurayım mı?" Onay gelirse çalıştır:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/kurulum.mjs"`
5. **Çalıştır**:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/efekt.mjs" grafik --klip "<video>" --bas <saniye> [--sure <saniye>] [--icerik "<json dosyası>"]`
   Sessiz çıktı istenirse `--sessiz` ekle. Çıktı varsayılan olarak videonun yanına `<ad>-grafik.mp4` adıyla kaydedilir, var olan dosyanın üzerine yazmaz.
6. Bitince çıktı dosyasının tam yolunu söyle.

## Kurallar

- **İçerik uydurma.** Rakam, isim, yorum, tarih gibi hiçbir şeyi kendin üretme. Kullanıcının verdiğini yerleştir; uzun metni kısaltabilirsin ama anlamını değiştirme. Kullanıcı içerik vermezse `--icerik` vermeden çalıştır; efekt örnek içerikle gelir.
- Kullanıcı bir alanı boş istemişse o anahtara boş nesne/dizi ver; o kart iskelet (boş) görünür.
- Komutu çalıştırmadan önce ne yapacağını tek cümleyle söyle; hata olursa mesajı Türkçe ve kısaca aktar.

## İçerik alanları (hepsi isteğe bağlı)

```json
{
  "sayi":     { "etiket": "Meta Ads", "deger": 30, "birim": "x", "alt": "ROAS ilk hafta" },
  "rapor":    { "dosya": "rapor.html", "baslik": "Online randevu", "deger": "+%240", "cubuklar": [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1] },
  "tarih":    { "gun": "Çarşamba", "saat": "14:30", "etiket": "Kuaför · fön" },
  "ilerleme": { "baslik": "Emlak ilanı yayında", "alt": "18.250 görüntülenme", "yuzde": 73 },
  "puan":     { "baslik": "Diş kliniği", "deger": 4.9, "alt": "128 Google yorumu" },
  "oynatici": { "ust": "Şu an yayında", "baslik": "Kafe reels", "alt": "menü · 0:15" },
  "halka":    { "deger": 12, "toplam": 12, "etiket": "görev bitti" }
}
```

Kısa tutun: etiketler ~16, başlıklar ~11–18 karakter. `cubuklar` 0–1 arası en fazla 7 değer.
