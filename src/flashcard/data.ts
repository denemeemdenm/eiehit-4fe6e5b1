import { Course, Unit, Flashcard } from './types';

export const courses: Course[] = [
  { id: 'tarih', name: 'Tarih', emoji: '📜', order: 1 },
  { id: 'anayasa', name: 'Anayasa Hukuku', emoji: '⚖️', order: 2 },
  { id: 'idare', name: 'İdare Hukuku', emoji: '🏛️', order: 3 },
  { id: 'idari-yargilama', name: 'İdari Yargılama Hukuku', emoji: '⚔️', order: 4 },
  { id: 'medeni-usul', name: 'Medeni Usul Hukuku', emoji: '📋', order: 5 },
  { id: 'medeni', name: 'Medeni Hukuk', emoji: '👥', order: 6 },
  { id: 'milletlerarasi', name: 'Milletlerarası Hukuk ve Milletlerarası Özel Hukuk', emoji: '🌍', order: 7 },
  { id: 'borclar', name: 'Borçlar Genel ve Borçlar Özel Hukuku', emoji: '📝', order: 8 },
  { id: 'ceza', name: 'Ceza Genel ve Ceza Özel Hukuku', emoji: '🔒', order: 9 },
  { id: 'cmk', name: 'CMK (Ceza Muhakemesi Kanunu)', emoji: '🔍', order: 10 },
  { id: 'ticaret', name: 'Ticaret Hukuku', emoji: '💼', order: 11 },
  { id: 'is-hukuku', name: 'İş Hukuku', emoji: '👷', order: 12 },
  { id: 'icra-iflas', name: 'İcra ve İflas Hukuku', emoji: '📌', order: 13 },
];

export const units: Unit[] = [
  // Anayasa Hukuku
  { id: 'anayasa-1', courseId: 'anayasa', name: 'Temel Kavramlar', order: 1 },
  { id: 'anayasa-2', courseId: 'anayasa', name: 'Anayasanın Üstünlüğü', order: 2 },
  { id: 'anayasa-3', courseId: 'anayasa', name: 'Temel Hak ve Özgürlükler', order: 3 },
  { id: 'anayasa-4', courseId: 'anayasa', name: 'Devletin Temel Organları', order: 4 },
  { id: 'anayasa-5', courseId: 'anayasa', name: 'Anayasa Yargısı', order: 5 },
  // Tarih
  { id: 'tarih-1', courseId: 'tarih', name: 'Osmanlı Devleti Son Dönemi', order: 1 },
  { id: 'tarih-2', courseId: 'tarih', name: 'Kurtuluş Savaşı', order: 2 },
  { id: 'tarih-3', courseId: 'tarih', name: 'Cumhuriyet Dönemi İnkılâpları', order: 3 },
  // İdare Hukuku
  { id: 'idare-1', courseId: 'idare', name: 'İdarenin Yapısı', order: 1 },
  { id: 'idare-2', courseId: 'idare', name: 'İdari İşlemler', order: 2 },
  { id: 'idare-3', courseId: 'idare', name: 'Kamu Görevlileri', order: 3 },
  // Ceza Hukuku
  { id: 'ceza-1', courseId: 'ceza', name: 'Suç Genel Teorisi', order: 1 },
  { id: 'ceza-2', courseId: 'ceza', name: 'Ceza Sorumluluğu', order: 2 },
  { id: 'ceza-3', courseId: 'ceza', name: 'Yaptırımlar', order: 3 },
  // İdari Yargılama
  { id: 'idari-yargilama-1', courseId: 'idari-yargilama', name: 'İdari Dava Türleri', order: 1 },
  { id: 'idari-yargilama-2', courseId: 'idari-yargilama', name: 'Yürütmenin Durdurulması', order: 2 },
  // Medeni Usul
  { id: 'medeni-usul-1', courseId: 'medeni-usul', name: 'Dava Çeşitleri', order: 1 },
  { id: 'medeni-usul-2', courseId: 'medeni-usul', name: 'İspat Hukuku', order: 2 },
  // Medeni Hukuk
  { id: 'medeni-1', courseId: 'medeni', name: 'Kişiler Hukuku', order: 1 },
  { id: 'medeni-2', courseId: 'medeni', name: 'Aile Hukuku', order: 2 },
  { id: 'medeni-3', courseId: 'medeni', name: 'Eşya Hukuku', order: 3 },
  // Milletlerarası
  { id: 'milletlerarasi-1', courseId: 'milletlerarasi', name: 'Devletlerin Tanınması', order: 1 },
  { id: 'milletlerarasi-2', courseId: 'milletlerarasi', name: 'Uluslararası Antlaşmalar', order: 2 },
  // Borçlar
  { id: 'borclar-1', courseId: 'borclar', name: 'Borcun Kaynakları', order: 1 },
  { id: 'borclar-2', courseId: 'borclar', name: 'Borçların İfası', order: 2 },
  // CMK
  { id: 'cmk-1', courseId: 'cmk', name: 'Soruşturma', order: 1 },
  { id: 'cmk-2', courseId: 'cmk', name: 'Kovuşturma', order: 2 },
  // Ticaret
  { id: 'ticaret-1', courseId: 'ticaret', name: 'Ticari İşletme', order: 1 },
  { id: 'ticaret-2', courseId: 'ticaret', name: 'Şirketler Hukuku', order: 2 },
  // İş Hukuku
  { id: 'is-hukuku-1', courseId: 'is-hukuku', name: 'İş Sözleşmesi', order: 1 },
  { id: 'is-hukuku-2', courseId: 'is-hukuku', name: 'Sendikal Haklar', order: 2 },
  // İcra İflas
  { id: 'icra-iflas-1', courseId: 'icra-iflas', name: 'İcra Takip Yolları', order: 1 },
  { id: 'icra-iflas-2', courseId: 'icra-iflas', name: 'İflas Hukuku', order: 2 },
];

export const flashcards: Flashcard[] = [
  // Anayasa - Ünite 1: Temel Kavramlar
  { id: 'a1-1', front: 'Anayasa nedir?', back: 'Devletin temel yapısını, organlarının görev ve yetkilerini, bireylerin temel hak ve özgürlüklerini düzenleyen en üst hukuk normudur.', courseId: 'anayasa', unitId: 'anayasa-1' },
  { id: 'a1-2', front: 'Kuvvetler ayrılığı ilkesini ilk kez sistematize eden düşünür kimdir?', back: 'Montesquieu — "Kanunların Ruhu" (De l\'Esprit des Lois, 1748) adlı eserinde yasama, yürütme ve yargı güçlerinin ayrılması gerektiğini savunmuştur.', courseId: 'anayasa', unitId: 'anayasa-1' },
  { id: 'a1-3', front: 'Sert anayasa ile yumuşak anayasa arasındaki fark nedir?', back: 'Sert anayasa: Değiştirilmesi özel ve ağırlaştırılmış usullere tabidir (ör. nitelikli çoğunluk). Yumuşak anayasa: Olağan kanunlarla aynı usulde değiştirilebilir.', courseId: 'anayasa', unitId: 'anayasa-1' },
  { id: 'a1-4', front: 'Kurucu iktidar nedir?', back: 'Anayasayı yapma ve değiştirme yetkisine sahip olan iktidardır. Asli kurucu iktidar ve tali kurucu iktidar olmak üzere ikiye ayrılır.', courseId: 'anayasa', unitId: 'anayasa-1' },
  { id: 'a1-5', front: 'Anayasanın bağlayıcılığı ve üstünlüğü hangi maddede düzenlenmiştir?', back: '1982 Anayasası\'nın 11. maddesi: "Anayasa hükümleri, yasama, yürütme ve yargı organlarını, idare makamlarını ve diğer kuruluş ve kişileri bağlayan temel hukuk kurallarıdır."', courseId: 'anayasa', unitId: 'anayasa-1' },
  // Anayasa - Ünite 2: Anayasanın Üstünlüğü
  { id: 'a2-1', front: 'Anayasanın değiştirilmesi teklif edilemez maddeleri hangileridir?', back: 'Madde 1: Devletin şekli (Cumhuriyet)\nMadde 2: Cumhuriyetin nitelikleri\nMadde 3: Devletin bütünlüğü, resmi dili, bayrağı, milli marşı, başkenti\n(Madde 4 ile değiştirilemezlik güvencesi altına alınmıştır)', courseId: 'anayasa', unitId: 'anayasa-2' },
  { id: 'a2-2', front: 'Anayasa değişikliği için gerekli çoğunluk nedir?', back: 'Teklif: TBMM üye tamsayısının en az 1/3\'ü (200 milletvekili)\nKabul: Üye tamsayısının 3/5\'i (360 oy) ile 2/3\'ü (400 oy) arasında ise halkoyuna sunulabilir; 2/3 ve üzeri ile kabul edilirse doğrudan yayımlanır.', courseId: 'anayasa', unitId: 'anayasa-2' },
  { id: 'a2-3', front: 'Normlar hiyerarşisi nedir?', back: 'Anayasa > Uluslararası Antlaşmalar > Kanunlar > KHK/CBK > Tüzükler > Yönetmelikler. Her norm, kendisinden üst norma uygun olmak zorundadır.', courseId: 'anayasa', unitId: 'anayasa-2' },
  // Anayasa - Ünite 3
  { id: 'a3-1', front: 'Temel hak ve özgürlüklerin sınırlandırılması hangi ilkelere tabidir?', back: '1) Kanunla sınırlama\n2) Anayasanın sözüne ve ruhuna uygunluk\n3) Demokratik toplum düzeninin gereklerine uygunluk\n4) Ölçülülük ilkesi\n5) Öze dokunmama (AY m.13)', courseId: 'anayasa', unitId: 'anayasa-3' },
  { id: 'a3-2', front: 'Olağanüstü hallerde temel hakların sınırlandırılmasının sınırı nedir?', back: 'Savaş, seferberlik veya olağanüstü hallerde dahi:\n- Yaşam hakkı, din ve vicdan özgürlüğü\n- Masumiyet karinesi\n- Suç ve cezaların kanuniliği dokunulamaz (AY m.15)', courseId: 'anayasa', unitId: 'anayasa-3' },
  // Anayasa - Ünite 4
  { id: 'a4-1', front: 'TBMM kaç milletvekilinden oluşur?', back: '600 milletvekilinden oluşur (2017 Anayasa değişikliği ile 550\'den 600\'e çıkarılmıştır).', courseId: 'anayasa', unitId: 'anayasa-4' },
  { id: 'a4-2', front: 'Cumhurbaşkanlığı Kararnamesi (CBK) ile düzenlenemeyecek konular nelerdir?', back: '1) Temel haklar, kişi hakları ve ödevleri\n2) Siyasi haklar ve ödevler\n3) Kanunda açıkça düzenlenen konular\n4) Münhasıran kanunla düzenlenmesi öngörülen konular (AY m.104/17)', courseId: 'anayasa', unitId: 'anayasa-4' },
  // Anayasa - Ünite 5
  { id: 'a5-1', front: 'Anayasa Mahkemesi\'ne bireysel başvuru koşulları nelerdir?', back: '1) Kamu gücü tarafından temel hak ihlali\n2) Olağan kanun yollarının tüketilmesi\n3) 30 gün içinde başvuru\n4) AİHS kapsamındaki haklar\n5) Güncel ve kişisel hak ihlali', courseId: 'anayasa', unitId: 'anayasa-5' },
  // Tarih
  { id: 't1-1', front: 'Tanzimat Fermanı ne zaman ve kim tarafından ilan edilmiştir?', back: '3 Kasım 1839\'da, Mustafa Reşit Paşa tarafından Gülhane Parkı\'nda okunmuştur. Osmanlı\'da modernleşme sürecinin önemli adımlarından biridir.', courseId: 'tarih', unitId: 'tarih-1' },
  { id: 't1-2', front: 'I. Meşrutiyet hangi padişah döneminde ilan edilmiştir?', back: 'II. Abdülhamit döneminde, 23 Aralık 1876\'da Kanun-i Esasi ilan edilerek I. Meşrutiyet dönemi başlamıştır.', courseId: 'tarih', unitId: 'tarih-1' },
  { id: 't2-1', front: 'Amasya Genelgesi\'nin önemi nedir?', back: 'Kurtuluş Savaşı\'nın gerekçesi, amacı ve yöntemi ilk kez belirlenmiştir. "Vatanın bütünlüğü, milletin istiklali tehlikededir" ifadesi kullanılmıştır. Milli egemenlik ilkesine ilk vurgu yapılmıştır.', courseId: 'tarih', unitId: 'tarih-2' },
  { id: 't2-2', front: 'Misak-ı Milli kararları ne zaman kabul edilmiştir?', back: '28 Ocak 1920\'de Son Osmanlı Mebusan Meclisi tarafından kabul edilmiştir. Milli sınırlar içinde tam bağımsızlık ve toprak bütünlüğü temel ilkeleridir.', courseId: 'tarih', unitId: 'tarih-2' },
  { id: 't3-1', front: 'Halifelik ne zaman kaldırılmıştır?', back: '3 Mart 1924\'te TBMM tarafından kabul edilen 431 sayılı kanunla kaldırılmıştır.', courseId: 'tarih', unitId: 'tarih-3' },
  // Ceza Hukuku
  { id: 'c1-1', front: 'Suçta ve cezada kanunilik ilkesi ne anlama gelir?', back: 'Kanunsuz suç ve ceza olmaz (nullum crimen, nulla poena sine lege). Bir fiil, kanunda açıkça suç olarak tanımlanmadıkça kimseye ceza verilemez (TCK m.2).', courseId: 'ceza', unitId: 'ceza-1' },
  { id: 'c1-2', front: 'Suçun unsurları nelerdir?', back: '1) Maddi unsur (fiil, netice, nedensellik bağı)\n2) Manevi unsur (kast veya taksir)\n3) Hukuka aykırılık unsuru\n4) Tipiklik (kanuni tanıma uygunluk)', courseId: 'ceza', unitId: 'ceza-1' },
  { id: 'c2-1', front: 'Meşru müdafaa (nefsi müdafaa) şartları nelerdir?', back: '1) Haksız bir saldırı bulunmalı\n2) Saldırı halen devam ediyor olmalı\n3) Savunma zorunlu olmalı\n4) Savunma ile saldırı arasında oran bulunmalı (TCK m.25/1)', courseId: 'ceza', unitId: 'ceza-2' },
  // İdare
  { id: 'i1-1', front: 'Merkezden yönetim ile yerinden yönetim arasındaki temel fark nedir?', back: 'Merkezden yönetim: Hizmetler merkezi idare tarafından yürütülür (Bakanlıklar, valilikler).\nYerinden yönetim: Hizmetler tüzel kişiliğe sahip kuruluşlar eliyle yürütülür (Belediyeler, üniversiteler, KİT\'ler).', courseId: 'idare', unitId: 'idare-1' },
  { id: 'i2-1', front: 'İdari işlemin unsurları nelerdir?', back: '1) Yetki\n2) Şekil\n3) Sebep\n4) Konu\n5) Amaç (maksat)\nBu unsurlardan birindeki sakatlık, idari işlemin iptaline yol açabilir.', courseId: 'idare', unitId: 'idare-2' },
  // Borçlar
  { id: 'b1-1', front: 'Borcun kaynakları nelerdir?', back: '1) Sözleşme (hukuki işlem)\n2) Haksız fiil\n3) Sebepsiz zenginleşme\n(TBK m.1 vd.)', courseId: 'borclar', unitId: 'borclar-1' },
  // CMK
  { id: 'cmk1-1', front: 'Soruşturma evresi nedir?', back: 'Suç şüphesinin öğrenilmesinden iddianamenin kabulüne kadar geçen evredir. Cumhuriyet savcısı tarafından yürütülür (CMK m.2/1-e).', courseId: 'cmk', unitId: 'cmk-1' },
  // Ticaret
  { id: 'tic1-1', front: 'Ticari işletme nedir?', back: 'Esnaf faaliyeti sınırlarını aşan düzeyde gelir sağlamayı hedef tutan faaliyetlerin devamlı ve bağımsız şekilde yürütüldüğü işletmedir (TTK m.11).', courseId: 'ticaret', unitId: 'ticaret-1' },
  // İş Hukuku
  { id: 'is1-1', front: 'İş sözleşmesinin unsurları nelerdir?', back: '1) İş görme (hizmet) unsuru\n2) Ücret unsuru\n3) Bağımlılık (talimat altında çalışma) unsuru\n(İş Kanunu m.8)', courseId: 'is-hukuku', unitId: 'is-hukuku-1' },
  // İcra İflas
  { id: 'ii1-1', front: 'İlamsız icra takibi nedir?', back: 'Alacaklının herhangi bir mahkeme kararına (ilama) ihtiyaç duymadan doğrudan icra dairesine başvurarak başlattığı takip yoludur. Borçlunun 7 gün içinde itiraz hakkı vardır (İİK m.62).', courseId: 'icra-iflas', unitId: 'icra-iflas-1' },
  // More placeholders
  { id: 'iy1-1', front: 'İptal davası nedir?', back: 'İdari işlemlerin hukuka aykırılığı iddiasıyla açılan davadır. Menfaati ihlal edilen kişiler tarafından 60 gün içinde açılır (İYUK m.2/1-a).', courseId: 'idari-yargilama', unitId: 'idari-yargilama-1' },
  { id: 'mu1-1', front: 'Eda davası nedir?', back: 'Davalının bir şeyi vermeye, yapmaya veya yapmamaya mahkûm edilmesinin talep edildiği davadır (HMK m.105).', courseId: 'medeni-usul', unitId: 'medeni-usul-1' },
  { id: 'med1-1', front: 'Hak ehliyeti nedir?', back: 'Hak sahibi olabilme ve borç altına girebilme ehliyetidir. Her insanın doğumla birlikte sahip olduğu bir ehliyettir (TMK m.8).', courseId: 'medeni', unitId: 'medeni-1' },
  { id: 'mil1-1', front: 'Devletlerin tanınması kaça ayrılır?', back: 'De jure tanıma: Tam, kesin ve geri alınamaz tanıma.\nDe facto tanıma: Geçici, koşullu ve geri alınabilir tanıma.', courseId: 'milletlerarasi', unitId: 'milletlerarasi-1' },
];

export function getCardsByCourse(courseId: string): Flashcard[] {
  return flashcards.filter(c => c.courseId === courseId);
}

export function getCardsByUnit(unitId: string): Flashcard[] {
  return flashcards.filter(c => c.unitId === unitId);
}

export function getUnitsByCourse(courseId: string): Unit[] {
  return units.filter(u => u.courseId === courseId).sort((a, b) => a.order - b.order);
}
