---
name: bolunmus
description: Üstte siyah-altın editoryal çubuk grafik, altta yuvarlak köşeli video kartı; kişinin başı kartın üstünden grafiğe taşar. Kullanıcının kendi videosuna özel hazır efekt uygular ve yeni bir MP4 çıkarır.
argument-hint: "[video yolu] [başlangıç saniyesi]"
allowed-tools: Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/*) Read Write
---

# Efekt: bolunmus

Üstte siyah-altın editoryal çubuk grafik, altta yuvarlak köşeli video kartı; kişinin başı kartın üstünden grafiğe taşar.

> Bu efekt kişiyi arka plandan keser. İlk seferde kesim birkaç dakika sürebilir (kare başına birkaç saniye); bilgisayar kullanılabilir kalır.

## Adımlar

1. **Video**: `$ARGUMENTS` içinde video yolu varsa onu kullan, yoksa kullanıcıya sor. Dikey (9:16) konuşan kafa videoları için tasarlandı; yatay video ortadan 9:16 kırpılır.
2. **Aralık**: Efekt 5–6 saniyelik bir bölüme uygulanır. Kullanıcı başlangıç saniyesi vermediyse sor ("Videonun kaçıncı saniyesinden başlasın? Konuştuğun bir an seç."). Süre varsayılan 5.7 sn; 2–15 sn arası olabilir.
3. **İçerik**: Kullanıcıya kendi içeriğini vermek isteyip istemediğini sor ve aşağıdaki alanları kısaca açıkla. Verirse yalnızca verdiği anahtarlarla bir JSON dosyası yaz (ör. işletim sisteminin geçici klasörüne `efekt-icerik.json`) ve `--icerik` ile geçir. Vermediği anahtarlar örnek içerikle kalır.
4. **Kurulum kontrolü**: `${CLAUDE_PLUGIN_ROOT}/engine/node_modules/remotion` yoksa kullanıcıya şunu söyle ve onay al: "İlk kullanım için motoru kurmam gerekiyor (npm paketleri ve ~224 MB kesim modeli). Kurayım mı?" Onay gelirse çalıştır:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/kurulum.mjs"`
5. **Çalıştır**:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/efekt.mjs" bolunmus --klip "<video>" --bas <saniye> [--sure <saniye>] [--icerik "<json dosyası>"]`
   Sessiz çıktı istenirse `--sessiz` ekle. Çıktı varsayılan olarak videonun yanına `<ad>-bolunmus.mp4` adıyla kaydedilir, var olan dosyanın üzerine yazmaz.
6. Bitince çıktı dosyasının tam yolunu söyle.

## Kurallar

- **İçerik uydurma.** Rakam, isim, yorum, tarih gibi hiçbir şeyi kendin üretme. Kullanıcının verdiğini yerleştir; uzun metni kısaltabilirsin ama anlamını değiştirme. Kullanıcı içerik vermezse `--icerik` vermeden çalıştır; efekt örnek içerikle gelir.
- Kullanıcı bir alanı boş istemişse o anahtara boş nesne/dizi ver; o kart iskelet (boş) görünür.
- Komutu çalıştırmadan önce ne yapacağını tek cümleyle söyle; hata olursa mesajı Türkçe ve kısaca aktar.

## İçerik alanları (hepsi isteğe bağlı)

```json
{
  "ust": "Rapor · 2026", "baslik": "En çok izlenen 7 reels", "vurgu": "izlenme sayısına göre",
  "cubuklar": [ { "ad": "GIF", "deger": 138 }, { "ad": "Hukuk", "deger": 96 } ],
  "birim": "B", "ortalama": 60
}
```

En fazla 7 çubuk, büyükten küçüğe sıralanması önerilir; ilki altın renkte vurgulanır. `ad` en fazla ~9 karakter.
