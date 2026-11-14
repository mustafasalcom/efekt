---
name: liste
description: Göğüs hizasında buzlu cam checklist; maddeler konuşurken sırayla tik alır, sıradaki maddede halka döner. Kullanıcının kendi videosuna özel hazır efekt uygular ve yeni bir MP4 çıkarır.
argument-hint: "[video yolu] [başlangıç saniyesi]"
allowed-tools: Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/*) Read Write
---

# Efekt: liste

Göğüs hizasında buzlu cam checklist; maddeler konuşurken sırayla tik alır, sıradaki maddede halka döner.

## Adımlar

1. **Video**: `$ARGUMENTS` içinde video yolu varsa onu kullan, yoksa kullanıcıya sor. Dikey (9:16) konuşan kafa videoları için tasarlandı; yatay video ortadan 9:16 kırpılır.
2. **Aralık**: Efekt 5–6 saniyelik bir bölüme uygulanır. Kullanıcı başlangıç saniyesi vermediyse sor ("Videonun kaçıncı saniyesinden başlasın? Konuştuğun bir an seç."). Süre varsayılan 5.7 sn; 2–15 sn arası olabilir.
3. **İçerik**: Kullanıcıya kendi içeriğini vermek isteyip istemediğini sor ve aşağıdaki alanları kısaca açıkla. Verirse yalnızca verdiği anahtarlarla bir JSON dosyası yaz (ör. işletim sisteminin geçici klasörüne `efekt-icerik.json`) ve `--icerik` ile geçir. Vermediği anahtarlar örnek içerikle kalır.
4. **Kurulum kontrolü**: `${CLAUDE_PLUGIN_ROOT}/engine/node_modules/remotion` yoksa kullanıcıya şunu söyle ve onay al: "İlk kullanım için motoru kurmam gerekiyor (npm paketleri). Kurayım mı?" Onay gelirse çalıştır:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/kurulum.mjs" --kesimsiz`
5. **Çalıştır**:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/efekt.mjs" liste --klip "<video>" --bas <saniye> [--sure <saniye>] [--icerik "<json dosyası>"]`
   Sessiz çıktı istenirse `--sessiz` ekle. Çıktı varsayılan olarak videonun yanına `<ad>-liste.mp4` adıyla kaydedilir, var olan dosyanın üzerine yazmaz.
6. Bitince çıktı dosyasının tam yolunu söyle.

## Kurallar

- **İçerik uydurma.** Rakam, isim, yorum, tarih gibi hiçbir şeyi kendin üretme. Kullanıcının verdiğini yerleştir; uzun metni kısaltabilirsin ama anlamını değiştirme. Kullanıcı içerik vermezse `--icerik` vermeden çalıştır; efekt örnek içerikle gelir.
- Kullanıcı bir alanı boş istemişse o anahtara boş nesne/dizi ver; o kart iskelet (boş) görünür.
- Komutu çalıştırmadan önce ne yapacağını tek cümleyle söyle; hata olursa mesajı Türkçe ve kısaca aktar.

## İçerik alanları (hepsi isteğe bağlı)

```json
{
  "baslik": "Eski reklam düzeni",
  "maddeler": [
    { "metin": "Tek kampanya", "etiket": "1 hedef", "zaman": 0.6 },
    { "metin": "Maliyet çok yüksek", "etiket": "CPA ↑", "kotu": true }
  ]
}
```

En fazla 5 madde. `zaman`: maddenin işaretleneceği saniye (verilmezse eşit dağılır). `kotu: true` kırmızı çarpı yapar.
