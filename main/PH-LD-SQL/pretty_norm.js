

// pastdagi funksiyalar 
// TERMUX OCR DAN OLINGAN RAQAM FORMATI 
// BILAN BIR XILLIGINI TAMINKANGANDA
// HAMDA SQL PHONE FORMATI O"ZGARISHI KERAK BO"LGAN
// HOLDA QO"LLANILADI

// FOR LATER USAGE
function NormalizePhone(number) {
    // 1️⃣ stringga aylantiramiz va trim qilamiz
    number = number.toString().trim();

    // 2️⃣ barcha bo'sh joylar va '-' kabi belgilarni olib tashlaymiz
    number = number.replace(/\s+/g, ""); // faqat bo'sh joylarni olib tashlaydi
    number = number.replace(/-/g, "");   // '-' belgilarini olib tashlash
    number = number.replace(/\(/g, "").replace(/\)/g, ""); // qavslar bo'lsa olib tashlash

    // 3️⃣ agar +998 bilan boshlansa olib tashlaymiz
    // if(number.startsWith("+998")) {
    //     number = number.substring(4);
    // }
    // 3️⃣ oxirgi 9 raqamni qaytarish
    if(number.length > 9) {
        number = number.slice(-9); // oxirgi 9 raqam
    }

    return number;
}

// --- Misollar ---
// console.log(NormalizePhone("+998 99 709 06 66")); // "997090666"
// console.log(NormalizePhone("998-99-709-06-66"));  // "997090666"
// console.log(NormalizePhone("(99) 709 06 66"));    // "997090666"
// console.log(NormalizePhone("997090666"));         // "997090666"

// FOR LATER USAGE
function FormatPhonePretty(number) {
    // 1️⃣ Avval raqamlarni normalize qilamiz (bo'sh joy va +998 olib tashlash)
    number = NormalizePhone(number); // oldingi NormalizePhone funksiyasini ishlatamiz

    // 2️⃣ 9 raqam borligini tekshiramiz
    if (number.length !== 9) {
        return number; // noto'g'ri uzunlik bo'lsa aslini qaytaradi
    }

    // 3️⃣ Formatlash: aa-bbb-cc-dd
    let part1 = number.slice(0, 2);  // aa
    let part2 = number.slice(2, 5);  // bbb
    let part3 = number.slice(5, 7);  // cc
    let part4 = number.slice(7, 9);  // dd

    return `${part1}-${part2}-${part3}-${part4}`;
}

// --- Misollar ---
// console.log(FormatPhonePretty("+998 99 709 06 66")); // "99-709-06-66"
// console.log(FormatPhonePretty("998997090666"));      // "99-709-06-66"
// console.log(FormatPhonePretty("997090666"));         // "99-709-06-66"