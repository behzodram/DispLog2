// Barcha funksiya ichida eng kerakli 
// preset argumentlarini olib beruvchi funksiya
function PasteType(type) {
    return pastePresets.filter(p => p.sources[0] === type);
}

function USER_ROW_TGHR(phone) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;

    if ( PasteType('contact').length > 1 ) { app.Alert("contact 1ta bo'lishi kerak"); return; }
    if ( PasteType('role').length > 1 ) { app.Alert("role 1ta bo'lishi kerak"); return; }
    if ( PasteType('location').length > 2 ) { app.Alert("lokatsiya 2ta bo'lishi kerak"); return; }
    if ( PasteType('car').length > 1 ) { app.Alert("transport 1ta bo'lishi kerak"); return; }
    
    var idem = {
        role:      PasteType('role')[0]?.values['role'] || '',
        qayerdan:  PasteType('location')[0]?.values['location'] || '',
        qayerga:   PasteType('location')[1]?.values['location'] || '',
        transport: PasteType('car')[0]?.values['car'] || ''
    };
    
    var validMsg = {
        role:      idem.role === '' ? "User role ?" : "",
        qayerdan:  idem.qayerdan === '' ? "User qayerdan ?" : "",
        qayerga:   idem.qayerga === '' ? "User qayerga ?" : "",
        transport: idem.transport === '' ? "User transport ?" : ""
    };

    var handler = new TogetherQuery(phone, idem, validMsg, 'User', 'INSERT_USER_PRFTV');
    db.ExecuteSql(
        queries["USER_ROW_TGHR"],
        [phone], handler.onResult.bind(handler), onUpdateError
    );
}

function LOAD_ROW_TGHR(phone) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;

    if ( PasteType('contact').length > 1 ) { app.Alert("contact 1ta bo'lishi kerak"); return; }
    if ( PasteType('weight').length > 1 ) { app.Alert("weight 1ta bo'lishi kerak"); return; }
    if ( PasteType('type17').length > 1 ) { app.Alert("type17 1ta bo'lishi kerak"); return; }

    var idem = {
        tonna:     PasteType('weight')[0]?.values['weight'] || '',
        turi:      PasteType('type17')[0]?.values['type17'] || ''
    };
    var validMsg = {
        tonna:     idem.tonna === '' ? "Yuk vazni ?" : "",
        turi:      idem.turi === '' ? "Yuk turi ?" : ""
    };

    var handler = new TogetherQuery(phone, idem, validMsg, 'Load', 'INSERT_Load_MTTY');
    db.ExecuteSql(
        queries["LOAD_ROW_TGHR"],
        [phone], handler.onResult.bind(handler), onUpdateError
    );
}

function USER_ROW_UPD_UNBP_TGHR(phone) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;

    if ( PasteType('contact').length > 1 ) { app.Alert("contact 1ta bo'lishi kerak"); return; }
    if ( PasteType('name').length > 1 ) { app.Alert("name 1ta bo'lishi kerak"); return; }

    var idem = { ismi: PasteType('name')[0]?.values['name'] || '' };
    var validMsg = { ismi: idem.ismi === '' ? "User ismi ?" : "" };

    var handler = new TogetherQuery(phone, idem, validMsg, 'User', 'UPDATE_USER_NAME_BY_PHONE');
    db.ExecuteSql(
        queries["USER_ROW_UPD_UNBP_TGHR"],
        [phone], handler.onResult.bind(handler), onUpdateError
    );
}
function USER_ROW_UPD_URBP_TGHR(phone) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;

    if ( PasteType('contact').length > 1 ) { app.Alert("contact 1ta bo'lishi kerak"); return; }
    if ( PasteType('role').length > 1 ) { app.Alert("role 1ta bo'lishi kerak"); return; }
    
    var idem = { role: PasteType('role')[0]?.values['role'] || '' };
    var validMsg = { role: idem.role === '' ? "User role ?" : "" };
    
    var handler = new TogetherQuery(phone, idem, validMsg, 'User', 'UPDATE_USER_ROLE_BY_PHONE');
    db.ExecuteSql(
        queries["USER_ROW_UPD_URBP_TGHR"],
        [phone], handler.onResult.bind(handler), onUpdateError
    );
}

function USER_ROW_UPD_VEHICLE_TGHR(phone) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;

    if ( PasteType('contact').length > 1 ) { app.Alert("contact 1ta bo'lishi kerak"); return; }
    if ( PasteType('car').length > 1 ) { app.Alert("transport 1ta bo'lishi kerak"); return; }

    var idem = { transport: PasteType('car')[0]?.values['car'] || '' };
    var validMsg = { transport: idem.transport === '' ? "User transport ?" : "" };

    var handler = new TogetherQuery(phone, idem, validMsg, 'User', 'UPDATE_USER_VEHICLE_BY_PHONE');
    db.ExecuteSql(
        queries["USER_ROW_UPD_VEHICLE_TGHR"],
        [phone], handler.onResult.bind(handler), onUpdateError
    );
}

function UPDATE_CASH_CLOSED_TGHR(phone) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;

    if ( PasteType('contact').length > 1 ) { app.Alert("contact 1ta bo'lishi kerak"); return; }
    if ( PasteType('load_cash').length > 1 ) { app.Alert("load_cash 1ta bo'lishi kerak"); return; }
    if ( PasteType('closed').length > 1 ) { app.Alert("closed 1ta bo'lishi kerak"); return; }

    var idem = {
        narx: PasteType('load_cash')[0]?.values['load_cash'] || '',
        yopilgan: PasteType('closed')[0]?.values['closed'] || ''
    };
    var validMsg = {
        narx: idem.narx === '' ? "Yuk narxi ?" : "",
        yopilgan: idem.yopilgan === '' ? "Yuk yopilganmi ?" : ""
    };

    var handler = new TogetherQuery(phone, idem, validMsg, 'Load', 'UPDATE_CASH_CLOSED');
    db.ExecuteSql(
        queries["UPDATE_CASH_CLOSED_TGHR"],
        [phone], handler.onResult.bind(handler), onUpdateError
    );
}

function UPDATE_TONNA_TURI_TGHR(phone) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;

    if ( PasteType('contact').length > 1 ) { app.Alert("contact 1ta bo'lishi kerak"); return; }
    if ( PasteType('weight').length > 1 ) { app.Alert("weight 1ta bo'lishi kerak"); return; }
    if ( PasteType('type17').length > 1 ) { app.Alert("turi 1ta bo'lishi kerak"); return; }

    var idem = {
        tonna: PasteType('weight')[0]?.values['weight'] || '',
        turi: PasteType('type17')[0]?.values['type17'] || ''
    };
    var validMsg = {
        tonna: idem.tonna === '' ? "Yuk vazni ?" : "",
        turi: idem.turi === '' ? "Yuk turi ?" : ""
    };

    var handler = new TogetherQuery(phone, idem, validMsg, 'Load', 'UPDATE_TONNA_TURI');
    db.ExecuteSql(
        queries["UPDATE_TONNA_TURI_TGHR"],
        [phone], handler.onResult.bind(handler), onUpdateError
    );
}

function UPDATE_TUMAN_TUMAN_TGHR(phone) {
    phone = FormatPhonePretty(phone);
    if ( policyPhone(phone) === false ) return;

    if ( PasteType('contact').length > 1 ) { app.Alert("contact 1ta bo'lishi kerak"); return; }
    if ( PasteType('tuman').length > 2 ) { app.Alert("tuman 2ta bo'lishi kerak"); return; }
    if ( PasteType('tuman').length < 2 ) { app.Alert("tuman 2ta bo'lishi kerak"); return; }

    var idem = {
        tumandan: PasteType('tuman')[0]?.values['tuman'] || '',
        tumanga: PasteType('tuman')[1]?.values['tuman'] || ''
    };
    var validMsg = {
        tumandan: idem.tumandan === '' ? "Yuk qaysi tumandan ?" : "",
        tumanga: idem.tumanga === '' ? "Yuk qaysi tumanga ?" : ""
    };
    
    var handler = new TogetherQuery(phone, idem, validMsg, 'Load', 'UPDATE_TUMAN_TUMAN');
    db.ExecuteSql(
        queries["UPDATE_TUMAN_TUMAN_TGHR"],
        [phone], handler.onResult.bind(handler), onUpdateError
    );
}