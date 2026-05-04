commitni debug qilish usulida 
izlab izlab pages.js -> 
    INSERT_USER_PRFTV func ning ->

        db.ExecuteSql(
            queries["INSERT_USER_PRFTV"],
            [phone, role /*, qayerdan, qayerga, transport */ ],  onUpdateSuccess, onUpdateError
        );

        izoh qismi mavjudmas shaklda yozib 
        qoldirilgan ekan.

# USUL of COMMIT DEBUG:
# git status toza holda boshlanadi

# 1
    Eski commitga qaytamiz:
        git checkout cmt-id
# 2
    xatolikni tekshiramiz
    Agar shu yerda xatolik yo'qolsa

    barcha fayllardan PC ga nusxa olamiz
# 3
    o'zgarish fayllari ko'rinadi
    kutilgan faylda 
        CTRL + Z
    qilinsa, eski holida yani joriy 
    main branchdagi nusxasida bo'ladi
# 4
    Run berib xatolikni tekshiramiz
    xatolik yo'q holatdan
    xatolik bor holatga o'tganda

    o'sha fayl DEBUG qilinadi
    