/* Varsayılan (örnek) içerikler. Kullanıcı içerik verirse üst düzey anahtar bazında bunların yerine geçer:
   ör. grafik için yalnızca "sayi" verilirse diğer widget'lar örnek olarak kalır.
   Bir widget'ı bilerek boş (iskelet) göstermek için o anahtara boş nesne verilir: { "puan": {} }.
   Yörüngenin varsayılanı yoktur: video verilmezse boş cam çerçeveler döner. */
export const DEF: Record<string, any> = {
  grafik: {
    sayi: { etiket: "Meta Ads", deger: 30, birim: "x", alt: "ROAS ilk hafta" },
    rapor: { dosya: "diyetisyen.html", baslik: "Online randevu", deger: "+%240", cubuklar: [0.18, 0.27, 0.36, 0.5, 0.62, 0.8, 1] },
    tarih: { gun: "Çarşamba", saat: "14:30", etiket: "Kuaför · fön" },
    ilerleme: { baslik: "Emlak ilanı yayında", alt: "18.250 görüntülenme", yuzde: 73 },
    puan: { baslik: "Diş kliniği", deger: 4.9, alt: "128 Google yorumu" },
    oynatici: { ust: "Şu an yayında", baslik: "Kafe reels", alt: "menü · 0:15" },
    halka: { deger: 12, toplam: 12, etiket: "görev bitti" },
  },
  liste: {
    baslik: "Eski reklam düzeni",
    maddeler: [
      { metin: "Tek kampanya", etiket: "1 hedef" },
      { metin: "Tek reklam seti", etiket: "geniş kitle" },
      { metin: "Tek kreatif", etiket: "1 görsel" },
      { metin: "Maliyet çok yüksek", etiket: "CPA ↑", kotu: true },
    ],
  },
  yorunge: {},
  bildirim: {
    bildirimler: [
      { uygulama: "Mesaj", mesaj: "Merhaba, koltuk takımı fiyatı?" },
      { uygulama: "Instagram", mesaj: "Yemek odası stokta var mı?" },
      { uygulama: "Form", mesaj: "Yeni talep: yatak odası" },
      { uygulama: "Mesaj", mesaj: "Teslimat ne zaman olur?" },
      { uygulama: "Instagram", mesaj: "Kampanya hâlâ geçerli mi?" },
    ],
    kart: { baslik: "CRM · Talepler", rozet: "5 yeni", satirlar: [{ ad: "Koltuk takımı", durum: "Görüşüldü" }, { ad: "Yemek odası", durum: "Teklif verildi" }, { ad: "Yatak odası", durum: "Satışa dönüştü" }] },
  },
  spot: { kelimeler: [{ metin: "Sistem" }, { metin: "30x ROAS" }] },
  bolunmus: {
    ust: "Rapor · 2026", baslik: "En çok izlenen 7 reels", vurgu: "izlenme sayısına göre",
    cubuklar: [{ ad: "GIF", deger: 138 }, { ad: "Hukuk", deger: 96 }, { ad: "İzo", deger: 71 }, { ad: "Meet", deger: 52 }, { ad: "Kodak", deger: 34 }, { ad: "IG", deger: 21 }, { ad: "Dinle", deger: 9 }],
    birim: "B", ortalama: 60,
  },
  konum: { arama: "yakınımdaki kahveci", ad: "Moda", vurgu: "Kahve", semt: "Kadıköy · 400 m", puan: 4.9, yorum: 312, durum: "Açık · 23:00'e kadar", sure: "🚶 5 dk" },
  takvim: {
    ay: "Kasım", yil: "2026", tarihler: [16, 17, 18, 19, 20, 21, 22], bugun: 2, bildirim: "7 etkinlik bu haftaya eklendi",
    etkinlikler: [
      { gun: 0, saat: "09:30", sure: 2, baslik: "Reels", alt: "çekim", vurgulu: true },
      { gun: 1, saat: "13:00", sure: 1.7, baslik: "Diyetisyen", alt: "post" },
      { gun: 2, saat: "10:30", sure: 1.7, baslik: "Kuaför", alt: "story" },
      { gun: 3, saat: "14:30", sure: 1.8, baslik: "Emlak", alt: "ilan" },
      { gun: 4, saat: "09:00", sure: 1.6, baslik: "Reklam", alt: "kontrol", vurgulu: true },
      { gun: 5, saat: "12:00", sure: 1.8, baslik: "Kafe", alt: "menü" },
      { gun: 6, saat: "15:00", sure: 1.6, baslik: "Klinik", alt: "yorum" },
    ],
  },
};
