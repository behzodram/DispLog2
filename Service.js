var path = "/storage/emulated/0/DCIM/Last_Ring.json";

function OnStart() {
    app.SetInForeground(
        "Skaner TERMUX", "Raqam aniqlash faol",
        "pages/images/Termux-Call.png", "Img/DispLog2.png"
    );

    setInterval(CheckFile, 2000);
}

function CheckFile() {
    if( !app.FileExists(path) ) return;

    var raw = app.ReadFile(path).trim();

    if( !raw.startsWith("{") ) raw = "{" + raw;
    if( !raw.endsWith("}") ) raw = raw + "}";
    
    // app.ShowPopup( raw )
    try {
        var obj = JSON.parse(raw);

        // agar ishlatilgan bo'lsa skip
        if(obj.used === true) return;

        var number = obj.ocr_digits.split("\n");
        
        // if( number )
        //     app.ShowPopup( number[0] )
        
        app.SendMessage( NormalizePhone( number[0] ) )
        
        // rasmni delete qilish
        if(obj.file && app.FileExists(obj.file))
        {
            app.DeleteFile(obj.file);
            app.ShowPopup("Screenshot o'chirildi");
        }

        // used ni true qilish
        obj.used = true;

        var updated = JSON.stringify(obj, null, 4);
        app.WriteFile(path, updated);
    }
    catch(e) {
        app.ShowPopup("JSON xato: " + e.message);
    }
}

function OnStop() {
    app.SetInBackground();
}

function NormalizePhone(number) {
    // stringga aylantiramiz
    number = number.toString().trim();

    // agar +998 bilan boshlansa olib tashlaymiz
    if(number.startsWith("+998")) {
        return number.substring(4);
    }

    // aks holda o'zini qaytaradi
    return number;
}