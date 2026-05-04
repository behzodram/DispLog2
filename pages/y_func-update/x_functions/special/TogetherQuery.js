
class TogetherQuery {
    constructor(phone, idem, validMsg, tableName, funcName) {
        this.phone = phone;
        this.idem = idem;
        this.validMsg = validMsg;
        this.tableName = tableName;
        this.funcName = funcName;
    }

    validate() {
        // Validatsiya: Role, qayerdan, qayerga, transport
        // (Contact validatsiya USER_ROW_TGHR da tashqarida)
        for (let key in this.validMsg) {
            if (this.validMsg[key] !== '') {
                app.Alert(this.validMsg[key]);
                return false;
            }
        }
        return true;
    }
    onResult(results) {
        var item = results.rows.length > 0 ? results.rows.item(0) : null;
        if (!item) {
            if (!this.validate()) return;
            app.ShowPopup("Yangi " + this.tableName + " qo'shilmoqda");
            setTimeout(() => {
                executeUniversalFunction(this.funcName);
            }, 1700);
            return;
        }

        if (!this.validate()) return;
        // Ma'lumotlarni jadval ko'rinishida taqqoslash
        let QQT_table = TogetherQuery.pad("AVVAL", 9) + " | KEYIN\n\n";
        for (let key in this.idem)
            QQT_table += TogetherQuery.pad((item[key] || ''), 9) + " | " + TogetherQuery.pad(this.idem[key], 9) + "\n";

        let timePretty = TogetherQuery.formatTimePretty(item.sec_before_update);
        let ITEM_DLG = app.CreateYesNoDialog(
            this.tableName + " topildi:\n\n"
            + "Phone: " + this.phone + "\n\n"
            + QQT_table + "\n\n"
            + "So'nggi yangilanish:\n" + timePretty + " oldin\n\n"
            + "Yangilamoqchimisiz?"
        );
        ITEM_DLG.SetOnTouch(this.onDlgTouch.bind(this));
        ITEM_DLG.Show();
    }

    onDlgTouch(result) {
        if (result == "Yes") {
            app.ShowPopup(this.tableName + " yangilanmoqda");
            setTimeout(() => {
                executeUniversalFunction(this.funcName);
            }, 1700);
        } else {
            app.Alert("Hech narsa o'zgarmadi");
        }
    }

    static formatTimePretty(seconds) {
        seconds = Math.floor(seconds);
        const units = [
            { label: "yil",    value: 365 * 24 * 3600 },
            { label: "oy",     value: 30 * 24 * 3600 },
            { label: "hafta",  value: 7 * 24 * 3600 },
            { label: "kun",    value: 24 * 3600 },
            { label: "soat",   value: 3600 },
            { label: "daqiqa", value: 60 },
            { label: "soniya", value: 1 }
        ];
        for (let u of units) {
            let val = Math.floor(seconds / u.value);
            if (val >= 1) return val + " " + u.label;
        }
        return "0 soniya";
    }

    static pad(str, len) {
        str = String(str);

        // agar uzun bo‘lsa → kesib "..." qo‘shamiz
        if (str.length > len) {
            return str.slice(0, Math.max(0, len - 1)) + ".-";
        }

        // aks holda → pad qilamiz
        return str + ".-".repeat(len - str.length);
    }
}