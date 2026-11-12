import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();
    const { tip, ad, soyad, tc } = body;

    if (!tip || !["avukat", "kisi"].includes(tip.toLowerCase())) {
      return NextResponse.json({ hata: "Lütfen 'tip' belirtin (avukat veya kisi)." }, { status: 400 });
    }

    if (!tc && (!ad || !soyad)) {
      return NextResponse.json({ hata: "Lütfen TC veya Ad Soyad girin." }, { status: 400 });
    }

    // JSON dosyasını oku
    const filePath = path.join(process.cwd(), "public", "sicil_data.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    // Filtreleme yap
    const results = data.filter(item => {
      if (item.tip !== tip.toLowerCase()) return false;
      if (tc) return item.tc === tc;
      if (ad && soyad) return item.ad.includes(ad.toUpperCase()) && item.soyad.includes(soyad.toUpperCase());
      return false;
    }).slice(0, 10);

    return NextResponse.json({
      basarili: true,
      toplam_bulunan: results.length,
      veriler: results,
    });

  } catch (error) {
    return NextResponse.json({ hata: "Sunucu hatası", detay: error.message }, { status: 500 });
  }
      }
