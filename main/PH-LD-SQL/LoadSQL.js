// LoadSQL.js

// avval har bir key uchun 1 line edi
// LoadSQLFile v 1.0.3 funksiya ham
// shu nostandart formatdagi SQL faylni 
// o'qishaga mos edi

// yangi format: v 1.0.4
// sql formallanishi mumkin va undagi izoh 
// qismi endi ham kalit sifatida ishlatiladi
// va SQL qatori ham bir nechta line bo'lishi mumkin
// LoadSQLFile funksiyasi ham yangilandi

// LoadSQL.js
// v1.0.6
// Kalit ajratish qoidasi:
//   -- KEY:   → kalit (oxirida ':' bo'lishi SHART)
//   -- izoh   → oddiy comment, o'tkazib yuboriladi
// Yangilik: inline commentlar ham tozalanadi
//   masalan: "phone TEXT, -- izoh" → "phone TEXT,"

// v 1.0.7
// LoadSQLFILE avval 
//      1.app.ReadFile
//      2.app.FileExists
// qilardi, endi esa bu tekshiruvlar tashqarida amalga oshiriladi
// va LoadSQLFile faqat o'qish va parsing bilan shug'ullanadi
// Sababi APK building dan keyin ERROR berar edi shunday qilinmasa

// v 1.7.7
// LoadSQLFile_v1_7_3 ni umumiy va yaxshilangan versiyasi
// bunda queries[ KEY_SQL_X ] da saqlanuvchi malumot
// .sql fayldagi bilan 100% bir xil bo'ladi, 
// ya'ni formatlanish va izohlar saqlanadi 
// Eslatma:
//      1. FOYDALANISH:     LoadSQLFile_v1_7_3( "path", callback )
//      2. TAHRIRLASH:      LoadSQLFile_v1_7_7( hasfile, content, callback )

function LoadSQLFile_v1_7_7(hasfile, content, callback) {

    if (!hasfile) {
        console.log("File not found: ");
        if (callback) callback();
        return;
    }

    content = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    var lines = content.split("\n");
    var currentKey = null;
    var currentSQL = [];

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        // faqat KEY header: -- key:
        // var keyMatch = line.match(/^--\s*([^:]+)\s*:/);
        var keyMatch = line.match(/^\s*--\s*([^:]+)\s*:/);
        if (keyMatch) {

            // old blockni saqlash
            if (currentKey !== null) {
                queries[currentKey] = currentSQL.join("\n");
            }

            currentKey = keyMatch[1].trim();
            currentSQL = [];

        } else {
            // HAMMASI ASL HOLIDA SAQLANADI (comment ham, space ham)
            if (currentKey !== null) {
                currentSQL.push(line);
            }
        }
    }

    // oxirgi block
    if (currentKey !== null) {
        queries[currentKey] = currentSQL.join("\n");
    }

    if (callback) callback();
}

// LoadSQL.js
// v 1.7.2
// endi APK buildingdan keyin ham ishlayapti
// shuning uchun pages.js kod qisqartirilishi
// maqsadida qayta versiya asosida yozildi
function LoadSQLFile_v1_7_3(path, callback) {
    let content = app.ReadFile(path);
    let hasfile = app.FileExists(path);
    LoadSQLFile_v1_7_7(hasfile, content, function() {  });
}