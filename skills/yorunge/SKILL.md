---
name: yorunge
description: Kişinin etrafında 7 cam kart döner: üstte başın arkasından, altta göğsün önünden geçer. Kartlara kişinin kendi videoları/görselleri girer. Kullanıcının kendi videosuna özel hazır efekt uygular ve yeni bir MP4 çıkarır.
argument-hint: "[video yolu] [başlangıç saniyesi]"
allowed-tools: Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/*) Read Write
---

# Efekt: yorunge

Kişinin etrafında 7 cam kart döner: üstte başın arkasından, altta göğsün önünden geçer. Kartlara kişinin kendi videoları/görselleri girer.

> Bu efekt kişiyi arka plandan keser. İlk seferde kesim birkaç dakika sürebilir (kare başına birkaç saniye); bilgisayar kullanılabilir kalır.

## Adımlar

1. **Video**: `$ARGUMENTS` içinde video yolu varsa onu kullan, yoksa kullanıcıya sor. Dikey (9:16) konuşan kafa videoları için tasarlandı; yatay video ortadan 9:16 kırpılır.
2. **Aralık**: Efekt 5–6 saniyelik bir bölüme uygulanır. Kullanıcı başlangıç saniyesi vermediyse sor ("Videonun kaçıncı saniyesinden başlasın? Konuştuğun bir an seç."). Süre varsayılan 5.7 sn; 2–15 sn arası olabilir.
3. **İçerik**: Kullanıcıya kartlarda dönecek kendi videolarının/görsellerinin olduğu klasörü sor (en fazla 7 dosya). Vermezse kartlar boş cam çerçeve olarak döner.
4. **Kurulum kontrolü**: `${CLAUDE_PLUGIN_ROOT}/engine/node_modules/remotion` yoksa kullanıcıya şunu söyle ve onay al: "İlk kullanım için motoru kurmam gerekiyor (npm paketleri ve ~224 MB kesim modeli). Kurayım mı?" Onay gelirse çalıştır:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/kurulum.mjs"`
5. **Çalıştır**:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/efekt.mjs" yorunge --klip "<video>" --bas <saniye> [--sure <saniye>] [--medya "<klasör>"]`
   Sessiz çıktı istenirse `--sessiz` ekle. Çıktı varsayılan olarak videonun yanına `<ad>-yorunge.mp4` adıyla kaydedilir, var olan dosyanın üzerine yazmaz.
6. Bitince çıktı dosyasının tam yolunu söyle.

## Kurallar

- **İçerik uydurma.** Rakam, isim, yorum, tarih gibi hiçbir şeyi kendin üretme. Kullanıcının verdiğini yerleştir; uzun metni kısaltabilirsin ama anlamını değiştirme. Kullanıcı içerik vermezse kartlar boş döner; asla başka bir yerden medya bulup ekleme.
- Kullanıcı bir alanı boş istemişse o anahtara boş nesne/dizi ver; o kart iskelet (boş) görünür.
- Komutu çalıştırmadan önce ne yapacağını tek cümleyle söyle; hata olursa mesajı Türkçe ve kısaca aktar.

## Not

İçerik JSON'u yok. Kullanıcının videolarının/görsellerinin olduğu klasörü `--medya` ile verin (en fazla 7 dosya; mp4, mov, jpg, png). Klasör verilmezse kartlar boş cam çerçeve olarak döner.
