# efekt

**Kendi videona tek komutla uygulanan özel hazır efekt skilleri.** Claude Code eklentisi.

Dikey (9:16) konuşan kafa videonu ver, efektin adını yaz; Claude videonun 5–6 saniyelik bir bölümüne efekti uygular ve yeni bir MP4 çıkarır. Kendi rakamlarını, metinlerini, videolarını verirsen onlar yerleşir; vermezsen örnek içerikle gelir.

| Komut | Ne yapar |
|---|---|
| `/efekt:grafik` | Kişinin arkasına 7 cam widget: büyük sayı, mini rapor, tarih, ilerleme, puan, oynatıcı, halka |
| `/efekt:liste` | Göğüs hizasında cam checklist; maddeler konuştukça işaretlenir |
| `/efekt:yorunge` | Kendi videoların kişinin etrafında döner (başın arkasından, göğsün önünden) |
| `/efekt:bildirim` | Bildirimler ekrana düşer, tek bir cam kartta toplanır |
| `/efekt:spot` | Oda kararır, kişi aydınlık kalır, neon kelimeler yanar |
| `/efekt:bolunmus` | Üstte siyah-altın grafik, altta video; baş grafiğe taşar |
| `/efekt:konum` | Arama, harita, altın pin, rota ve "Yol tarifi al" |
| `/efekt:takvim` | Haftalık cam takvim; etkinlikler günlere düşer |

## Kurulum

Claude Code içinde:

```
/plugin marketplace add mustafasalcom/efekt
/plugin install efekt@mustafasalcom
```

İlk efekti çalıştırdığında Claude motoru kurmak için onay ister (npm paketleri; kesim gereken efektler için ~224 MB model ve birkaç Python paketi). Bir kez yapılır.

**Gerekenler:** Node.js 18+, ffmpeg. Kesim gereken efektler (grafik, yörünge, bölünmüş) için ayrıca Python 3.9+.

```
Windows: winget install ffmpeg
Mac:     brew install ffmpeg
```

## Kullanım

```
/efekt:takvim videom.mp4 12
```

`12`: efektin başlayacağı saniye. Konuştuğun bir an seç. Claude sana kendi içeriğini vermek isteyip istemediğini sorar:

> "Diyet planımı koy: pazartesi 10:00 tartı, çarşamba 13:00 menü hazırlığı, cuma 16:00 online kontrol."

Çıktı, videonun yanına `videom-takvim.mp4` olarak kaydedilir. Var olan dosyanın üzerine yazmaz.

### İçerik kuralları

- Verdiğin anahtarlar örnek içeriğin yerine geçer, vermediklerin örnek olarak kalır.
- Bir kartı boş (iskelet) istiyorsan söyle; o kart boş görünür.
- Claude içerik **uydurmaz**: rakam, isim, yorum yazmaz, yalnızca senin verdiğini yerleştirir.
- Yörüngede video vermezsen kartlar boş cam çerçeve olarak döner.

Her efektin alanları `skills/<efekt>/SKILL.md` içinde.

### Komut satırından (Claude olmadan)

```
node scripts/kurulum.mjs
node scripts/efekt.mjs grafik --klip videom.mp4 --bas 12 --icerik icerik.json
node scripts/efekt.mjs yorunge --klip videom.mp4 --bas 30 --medya ./eski-videolarim
```

Seçenekler: `--sure 5.7` (2–15 sn), `--cikti yol.mp4`, `--sessiz`.

### Kısa komut (`/takvim`) istersen

Eklenti komutları `/efekt:` ile başlar. Başında `efekt:` olmadan kullanmak istersen `skills/` içindeki klasörleri `~/.claude/skills/` altına kopyala ve SKILL.md içindeki `${CLAUDE_PLUGIN_ROOT}` yollarını bu reponun yerel yoluyla değiştir.

## Nasıl çalışır

- **Motor:** [Remotion](https://www.remotion.dev) (React ile video). Efektler `engine/src/fx/` altında.
- **Kesim:** [BiRefNet](https://github.com/ZhengPeng7/BiRefNet) (MIT), ONNX ile. Ekran kartı varsa onu dener, bellek yetmezse işlemciye geçer. Kare başına birkaç saniye sürer; işlem düşük öncelikte çalışır.
- **Yazı tipleri:** Inter, Playfair Display, JetBrains Mono (Google Fonts, OFL).

## Lisans

Bu repo [MIT](LICENSE) lisanslıdır: kullan, değiştir, dağıt.

**Önemli:** Motorun kullandığı Remotion kendi lisansına tabidir. Bireyler ve en fazla 3 çalışanı olan şirketler için ücretsizdir; daha büyük şirketlerin [Remotion şirket lisansı](https://www.remotion.dev/license) alması gerekir. Kesim modeli repoya dahil değildir, ilk kurulumda kendi kaynağından indirilir.

---

[mustafasal.com](https://mustafasal.com) · Instagram [@mustafasal.co](https://instagram.com/mustafasal.co)
